// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

Cypress.Commands.add('loginAsAdmin', () => {
  cy.server();
  cy.route('POST', '/api/login').as('login');
  cy.visit('/login');
  cy.get('[data-test="secret"]').click();
  cy.get('[data-test="inputField"]').type(Cypress.env('ADMIN_PASSWORD'), {
    log: false,
  });
  cy.get('button[type="submit"]').click();
  cy.wait('@login')
    .its('status')
    .should('be', 200);
  cy.get('a')
    .contains('admin')
    .click();
  cy.url().should('include', 'admin');
});

Cypress.Commands.add('logout', () => {
  cy.request('POST', '/api/logout');
});

Cypress.Commands.add('cleanDb', () => {
  cy.task('cleanDb');
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
