import { CreateSnippet } from "../../src/utils/snippet";
import { getAuth0Token } from "../support/auth-provider-commands/auth0";  // Adjust the path as necessary

describe('Home', () => {
  beforeEach(() => {
    cy.loginToAuth0(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));
  });

  it('Renders home', () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
  });

  it('Renders the first snippets', () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    const first10Snippets = cy.get('[data-testid="snippet-row"]');
    first10Snippets.should('have.length.greaterThan', 0);
  });

  it('Can create snippet and find snippets by name', () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    const snippetData: CreateSnippet = {
      userName: "valensecondary",
      name: "Test name",
      content: "print(1)",
      language: "printscript",
      extension: ".prs"
    };

    getAuth0Token().then((token) => {  // Call the function to get the token
      cy.intercept('GET', Cypress.env("BACKEND_URL")+"/snippet*", (req) => {
        req.reply((res) => {
          expect(res.statusCode).to.eq(200);
        });
      }).as('getSnippets');

      cy.request({
        method: 'POST',
        url: `${Cypress.env("BACKEND_URL")}/snippet`,
        body: snippetData,
        headers: {
          Authorization: `Bearer ${token}`  // Use the token here
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(snippetData.name);
        expect(response.body.content).to.eq(snippetData.content);
        expect(response.body.language).to.eq(snippetData.language);
        expect(response.body).to.haveOwnProperty("id");

        cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
        cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}");

        cy.wait("@getSnippets");
        cy.contains(snippetData.name).should('exist');
      });
    });
  });
});
