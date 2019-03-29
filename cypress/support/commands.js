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
import { API_PATH } from '../../shared/constants';

Cypress.Commands.add('loginAsAdmin', () => {
  Cypress.Cookies.defaults({
    whitelist: ['user_sid', 'CloudFront-Policy'],
  });

  cy.server();
  cy.request({
    url: `${API_PATH}/login`,
    method: 'POST',
    body: { password: Cypress.env('ADMIN_PASSWORD') },
  });
});
Cypress.Commands.add('login', () => {
  Cypress.Cookies.defaults({
    whitelist: ['user_sid', 'CloudFront-Policy'],
  });

  cy.server();
  cy.request({
    url: `${API_PATH}/login`,
    method: 'POST',
    body: { password: Cypress.env('PUBLIC_PASSWORD') },
    log: false,
  });
});

Cypress.Commands.add('ensureLoggedIn', () => {
  Cypress.Cookies.defaults({
    whitelist: ['user_sid', 'CloudFront-Policy'],
  });
  cy.getCookie('user_sid').then(userCookie => {
    if (!userCookie) {
      cy.login();
    }
  });
});

Cypress.Commands.add('ensureLoggedInAsAdmin', () => {
  Cypress.Cookies.defaults({
    whitelist: ['user_sid', 'CloudFront-Policy'],
  });
  cy.getCookie('user_sid').then(userCookie => {
    if (!userCookie) {
      cy.loginAsAdmin();
    }
  });
});

Cypress.Commands.add('goHome', () => {
  cy.url().then(url => {
    cy.log('url');
    cy.log(url);
    if (url === 'about:blank') {
      cy.visit('/', { failOnStatusCode: false });
    } else {
      cy.get('[data-test=menu]').click();
      cy.get('[data-test=home]').click();
    }
  });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-test="closeModal"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.request('POST', `${API_PATH}/logout`).then(() => {
    cy.log('loggedOut');
  });
});

Cypress.Commands.add('cleanDb', () => {
  cy.task('cleanDb');
});

Cypress.Commands.add('getTestId', testId => {
  return cy.get(`[data-test="${testId}"]`);
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
