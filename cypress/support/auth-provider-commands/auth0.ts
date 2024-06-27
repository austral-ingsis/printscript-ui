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
