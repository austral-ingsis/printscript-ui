const backendUrl = Cypress.env('VITE_BACKEND_URL');
import {CreateSnippet} from "../../src/utils/snippet";

describe('Home', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        Cypress.env("VITE_AUTH0_USERNAME"),
        Cypress.env("VITE_AUTH0_PASSWORD")
    )
  })

  it('Renders home', () => {
    cy.visit("/")
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit("/")
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lessThan', 20)
  })

  it('Can creat snippet find snippets by name', () => {
    cy.visit("/")
    const snippetData: CreateSnippet = {
      name: "example_ps",
      content: "println(1);",
      language: "printscript",
      extension: ".prs",
      version: "1.1"
    }

    cy.intercept('GET', backendUrl +"/snippets", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');
    const token = localStorage.getItem('token')
    cy.request({
      method: 'POST',
      url: backendUrl+'/snippets/create', // Adjust if you have a different base URL configured in Cypress
      body: snippetData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      failOnStatusCode: false // Optional: set to true if you want the test to fail on non-2xx status codes
    }).then((response) => {
      console.log(response)
      expect(response.status).to.eq(200);

      expect(response.body.name).to.eq(snippetData.name)
      expect(response.body.content).to.eq(snippetData.content)
      expect(response.body.language).to.eq(snippetData.language)

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}");

      cy.wait("@getSnippets")
      cy.contains(snippetData.name).should('exist');
    })
  })
})
