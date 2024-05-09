declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in using Auth0.
     * @example cy.loginToAuth0('username', 'password')
     */
    loginToAuth0(username: string, password: string): Chainable<void>
  }
}
