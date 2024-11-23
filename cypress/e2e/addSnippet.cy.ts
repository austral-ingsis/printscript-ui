describe("Add snippet tests", () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    );
  });
  it("Can add snippets manually", () => {
    cy.visit("/");
    cy.intercept("POST", `${Cypress.env("BACKEND_URL")}/snippet`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as("postRequest");

    /* ==== Generated with Cypress Studio ==== */
    cy.get(".css-9jay18 > .MuiButton-root").click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get("#name").type("Some snippet name");
    cy.get("#demo-simple-select").click();
    cy.get('[data-testid="menu-option-printscript 1.1"]').click();

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(
      `const snippet: string = "some snippet"; \n println(snippet);`
    );
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait("@postRequest").its("response.statusCode").should("eq", 200);
  });

  it("Can add snippets via file", () => {
    cy.visit("/");
    cy.intercept("POST", `${Cypress.env("BACKEND_URL")}/snippet`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as("postRequest");

    /* ==== Generated with Cypress Studio ==== */
    cy.wait(5000);
    cy.get('[data-testid="upload-file-input"').selectFile(
      "cypress/fixtures/example_ps.ps",
      { force: true }
    );

    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait("@postRequest").its("response.statusCode").should("eq", 200);
  });
});
