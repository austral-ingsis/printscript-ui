const backendUrl = Cypress.env('VITE_BACKEND_URL');

import {FakeSnippetStore} from "../../src/utils/mock/fakeSnippetStore";

describe('Add snippet tests', () => {
  const fakeStore = new FakeSnippetStore()
    beforeEach(() => {
      cy.loginToAuth0(
          Cypress.env("VITE_AUTH0_USERNAME"),
          Cypress.env("VITE_AUTH0_PASSWORD")
      )
    cy.intercept('GET', backendUrl+"/snippets/*", {
      statusCode: 201,
      body: fakeStore.getSnippetById("1"),
    }).as("getSnippetById")
    cy.intercept('GET', backendUrl+"/snippets").as("getSnippets")

    cy.visit("/")

    // cy.wait("@getSnippets")
    cy.wait(4000) // TODO comment this line and uncomment 19 to wait for the real data
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
  })

  it('Can share a snippet ', () => {
    cy.get('[aria-label="Share"]').click();
    cy.get('#\\:rj\\:').click();
    cy.get('#\\:rj\\:-option-0').click();
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').click();
    cy.wait(2000)
  })

  it('Can format snippets', function() {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})
