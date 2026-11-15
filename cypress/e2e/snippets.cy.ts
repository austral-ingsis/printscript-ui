import {BACKEND_URL} from "../../src/utils/constants";

// Respuestas simuladas con la forma real de snippet-service: el listado trae `content: null`, el detalle trae el
// contenido y los errores vienen como { error, message, errors: [{ rule, message, line, column }] }.
// Como en los otros specs, falta el login de Auth0 (ver loginToAuth0): la app exige sesión para cargar.
const snippet = (id: string, name: string, content: string | null = null) => ({
  id, name, description: "", language: "printscript", version: "1.1", extension: "ps",
  author: "auth0|ana", compliance: "pending", content,
})

const list = (snippets: ReturnType<typeof snippet>[]) => ({
  page: 0, page_size: 10, count: snippets.length, snippets,
})

const SNIPPETS = {method: "GET", pathname: `${BACKEND_URL}/snippets`}

describe('Snippets connected to the backend', () => {
  beforeEach(() => {
    // cy.loginToAuth0(AUTH0_USERNAME, AUTH0_PASSWORD) TODO: igual que en los otros specs, cuando esté listo
    cy.intercept({method: "GET", pathname: `${BACKEND_URL}/snippets/file-types`},
        [{language: "printscript", extension: "ps"}])
  })

  it('Lists the snippets of the first page', () => {
    cy.intercept(SNIPPETS, list([snippet("s1", "hola"), snippet("s2", "chau")])).as('list')
    cy.visit("/")

    cy.wait('@list').its('request.query').should('deep.include', {page: '0', page_size: '10'})
    cy.get('[data-testid="snippet-row"]').should('have.length', 2)
    cy.contains('hola')
    cy.contains('chau')
  })

  it('Shows an empty list with a total of 0', () => {
    cy.intercept(SNIPPETS, list([])).as('list')
    cy.visit("/")

    cy.wait('@list')
    cy.get('[data-testid="snippet-row"]').should('not.exist')
    cy.contains('of 0')
  })

  it('Searches by name', () => {
    cy.intercept(SNIPPETS, list([snippet("s1", "hola")])).as('list')
    cy.visit("/")
    cy.wait('@list')

    cy.get('input[aria-label="search"]').type('ho')

    cy.wait('@list').its('request.query').should('have.property', 'name', 'ho')
  })

  it('Shows an error when the list fails and recovers with Retry', () => {
    cy.intercept(SNIPPETS, {statusCode: 502, body: {error: "PERMISSIONS_UNAVAILABLE", message: "x", errors: []}})
    cy.visit("/")

    cy.get('[data-testid="api-error"]').should('contain', 'not available')

    cy.intercept(SNIPPETS, list([snippet("s1", "hola")])).as('list')
    cy.contains('button', 'Retry').click()
    cy.wait('@list')
    cy.get('[data-testid="snippet-row"]').should('have.length', 1)
  })

  it('Opens a snippet, edits it and saves only the content', () => {
    cy.intercept(SNIPPETS, list([snippet("s1", "hola")])).as('list')
    cy.intercept({method: "GET", pathname: `${BACKEND_URL}/snippets/s1`}, snippet("s1", "hola", "println(1);"))
    cy.intercept({method: "PUT", pathname: `${BACKEND_URL}/snippets/s1`},
        (req) => req.reply(snippet("s1", "hola", req.body.content))).as('update')
    cy.visit("/")
    cy.get('[data-testid="snippet-row"]').first().click()

    cy.get('.MuiDrawer-root textarea').should('have.value', 'println(1);').type(' println(2);')
    cy.get('[data-testid="SaveIcon"]').click()

    cy.wait('@update').its('request.body').should('deep.equal', {content: 'println(1); println(2);'})
    // Guardar también refresca el listado (el estado vuelve a "pending").
    cy.get('@list.all').should('have.length.greaterThan', 1)
  })

  it('Shows an error and no editor when the snippet does not exist', () => {
    cy.intercept(SNIPPETS, list([snippet("s1", "hola")]))
    cy.intercept({method: "GET", pathname: `${BACKEND_URL}/snippets/s1`},
        {statusCode: 404, body: {error: "SNIPPET_NOT_FOUND", message: "x", errors: []}})
    cy.visit("/")
    cy.get('[data-testid="snippet-row"]').first().click()

    cy.get('[data-testid="api-error"]').should('contain', "doesn't exist or you don't have access")
    // Sin el snippet no se puede guardar encima del contenido real.
    cy.get('[data-testid="SaveIcon"]').should('not.exist')
  })

  it('Keeps the modal open and shows the rule, line and column when the snippet is invalid', () => {
    cy.intercept(SNIPPETS, list([]))
    cy.intercept({method: "POST", pathname: `${BACKEND_URL}/snippets`}, {
      statusCode: 400,
      body: {
        error: "INVALID_SNIPPET", message: "Snippet does not comply with printscript 1.1",
        errors: [{rule: "syntax", message: "Unexpected token", line: 1, column: 5}],
      },
    }).as('create')
    cy.visit("/")

    cy.contains('button', 'Add Snippet').click()
    cy.contains('li', 'Create snippet').click()
    cy.get('#name').type('malo')
    cy.get('[data-testid="add-snippet-code-editor"]').type('let @@')
    cy.contains('button', 'Save Snippet').click()

    cy.wait('@create')
    cy.get('[data-testid="api-error"]').should('contain', 'syntax').and('contain', 'line 1, column 5')
    cy.contains('Add Snippet')
  })

  it('Creates a snippet sending name, language and content', () => {
    cy.intercept(SNIPPETS, list([])).as('list')
    cy.intercept({method: "POST", pathname: `${BACKEND_URL}/snippets`},
        (req) => req.reply({statusCode: 201, body: snippet("s9", req.body.name, req.body.content)})).as('create')
    cy.visit("/")
    cy.wait('@list')

    cy.contains('button', 'Add Snippet').click()
    cy.contains('li', 'Create snippet').click()
    cy.get('#name').type('nuevo')
    cy.get('[data-testid="add-snippet-code-editor"]').type('println(1);')
    cy.contains('button', 'Save Snippet').click()

    cy.wait('@create').its('request.body').should('deep.equal',
        {name: 'nuevo', language: 'printscript', content: 'println(1);'})
    cy.get('[data-testid="add-snippet-code-editor"]').should('not.exist')
    cy.get('@list.all').should('have.length.greaterThan', 1)
  })
})
