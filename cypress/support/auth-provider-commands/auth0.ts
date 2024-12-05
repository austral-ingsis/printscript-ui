export function loginViaAuth0Ui(username: string, password: string) {
    // Visit the app's landing page, which redirects to Auth0
    cy.visit('/');

    // Retrieve environment variables for Auth0 domain
    const auth0Domain = Cypress.env('VITE_AUTH0_DOMAIN'); // Access Auth0 domain from Cypress env

    // Perform login on Auth0
    cy.origin(
        auth0Domain, // Use the domain from Cypress env
        { args: { username, password } },
        ({ username, password }) => {
            // Type in the username
            cy.get('input#username').type(username);

            // Type in the password
            cy.get('input#password').type(password, { log: false }); // Prevent password from being logged in Cypress logs

            // Click the Continue button, forcing interaction if necessary
            cy.contains('button[value=default]', 'Continue').click({ force: true });
        }
    );

    // Ensure that Auth0 has redirected back to the app
    cy.url().should('eq', 'http://localhost:5173/');
}
