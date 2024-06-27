export function loginViaAuth0Ui(username, password) {
  cy.visit(`${Cypress.env('FRONTEND_URL')}/`)
  cy.wait(1000)
  cy.contains('Button', 'Log In').click()
  cy.origin(
    Cypress.env('auth0_domain'),
    { args: { username, password } },
    ({ username, password }) => {
      cy.url().should('include', Cypress.env('auth0_domain'))
      
      cy.get('input#username').type(username)
      cy.get('input#password').type(password, { log: false })
      cy.contains('button[value=default]', 'Continue').click()
    }
  )

  cy.url().should('equal', 'http://localhost:5173/')
}


export function getAuth0Token() {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('AUTH0_URL')}/oauth/token`,
    body: {
      grant_type: 'password',
      username: Cypress.env('AUTH0_USERNAME'),
      password: Cypress.env('AUTH0_PASSWORD'),
      audience: Cypress.env('auth0_audience'),
      scope: 'read:snippets write:snippets change:rules',
      client_id: Cypress.env('client_id'),
      client_secret: Cypress.env('client_secret')
    }
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return resp.body.access_token;
  });
};
