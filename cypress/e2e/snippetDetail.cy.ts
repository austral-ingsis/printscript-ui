describe("Add snippet tests", () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    );
    cy.intercept("GET", Cypress.env("BACKEND_URL") + "/snippet/**/*", (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as("getSnippetById");
    cy.intercept("GET", Cypress.env("BACKEND_URL") + "/snippet/**/*", (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as("getSnippets");

    cy.visit("/");

    cy.wait("@getSnippets");
    cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(1)").click();
  });

  it("Can share a snippet ", () => {
    cy.get('[aria-label="Share"]').click();
    cy.get('button[aria-label="Open"]').click();
    cy.get('[role="listbox"] li:nth-child(1)').click();
    cy.get(".css-1yuhvjn > .MuiBox-root > .MuiButton-contained").click();
    cy.wait(2000);
  });

  it("Can format snippets", function () {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it("Can save snippets", function () {
    cy.get(
      ".css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea"
    ).click();
    cy.get(
      ".css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea"
    ).type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it("Can delete snippets", function () {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
});
