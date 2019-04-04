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

const whitelist = [
  'user_sid',
  'CloudFront-Policy',
  'CloudFront-Signature',
  'CloudFront-Key-Pair-Id',
];
Cypress.Commands.add('loginAsAdmin', () => {
  Cypress.Cookies.defaults({
    whitelist,
  });
  Cypress.log({
    name: 'farts',
    displayName: 'fuck yea',
    message: 'command args?',
    consoleProps: () => {
      return {
        obj: 'literal',
      };
    },
  });
  cy.server();
  cy.request({
    url: `${API_PATH}/login`,
    method: 'POST',
    body: { password: Cypress.env('ADMIN_PASSWORD') },
    log: false,
  });
});
Cypress.Commands.add('login', () => {
  Cypress.Cookies.defaults({
    whitelist,
  });
  Cypress.log({
    name: 'Login',
    displayName: 'Login',
    message: 'Loigging in',
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
    whitelist,
  });
  cy.getCookie('user_sid', { log: false }).then(userCookie => {
    if (!userCookie) {
      cy.login();
    }
  });
});

Cypress.Commands.add('ensureLoggedInAsAdmin', () => {
  Cypress.Cookies.defaults({
    whitelist,
  });
  cy.getCookie('user_sid', { log: false }).then(userCookie => {
    if (!userCookie) {
      cy.loginAsAdmin();
    }
  });
});

Cypress.Commands.add('goHome', () => {
  cy.url().then(url => {
    if (url === 'about:blank') {
      Cypress.log({
        name: 'Hard Visiting',
        displayName: 'Go home',
        message: 'Hard refresh',
      });

      cy.visit('/', { failOnStatusCode: false, log: false });
    } else {
      Cypress.log({
        name: 'Soft Visiting',
        displayName: 'Go home',
        message: 'No hard refresh, using UI',
      });

      cy.get('[data-test=menu]', { log: false }).click({ log: false });
      cy.get('[data-test=home]', { log: false }).click({ log: false });
    }
  });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-test="closeModal"]', { log: false }).click({ log: false });
  Cypress.log({
    name: 'Closing Modal by clicking data-test"closeModal"',
    displayName: 'Modal close',
    message: 'Closed modal in UI',
  });
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
  const thing = cy.get(`[data-test="${testId}"]`, { log: false });
  thing.then($el => {
    Cypress.log({
      // $el: thing,
      name: 'Get Test Id',
      displayName: 'TEST ID',
      message: `Getting test element "${testId}"`,
    });
    return cy.wrap($el);
  });
  return thing;
});

// Cypress.Commands.add('');
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
