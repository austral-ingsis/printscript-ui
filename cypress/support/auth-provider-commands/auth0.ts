export function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit("/");

  cy.intercept(
    "POST",
    "https://" + Cypress.env("VITE_AUTH0_DOMAIN") + "/oauth/token"
  ).as("authRequest");

  // Login on Auth0.
  cy.origin(
    Cypress.env("VITE_AUTH0_DOMAIN"),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("input#username").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  cy.wait("@authRequest").then((interception) => {
    const { access_token } = interception.response.body;
    cy.window().then((window) => {
      window.localStorage.setItem("authAccessToken", access_token);
    });
  });

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should("equal", Cypress.env("FRONTEND_URL") + "/");
}
