describe("Protected routes test", () => {
  it("should redirect to login when accessing a protected route unauthenticated", () => {
    // Visit the protected route
    cy.visit("/");

    // Check if the URL is redirected to the login page
    cy.origin("https://dev-7zn033qnk8llytib.us.auth0.com", () => {
      // Assert that the Auth0 login page is displayed
      cy.contains("Log in").should("exist");
      cy.get('input[name="username"]').should("exist");
      cy.get('input[name="password"]').should("exist");
    });
  });

  it("should not redirect to login when the user is already authenticated", () => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    );

    cy.visit("/");

    cy.wait(1000);

    // Check if the URL is redirected to the login page
    cy.url().should("not.include", "dev-7zn033qnk8llytib.us.auth0.com");
  });
});
