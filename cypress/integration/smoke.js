import { API_PATH } from '../../shared/constants';

describe('Smoke test', () => {
  beforeEach(cy.logout);
  it('can login', () => {
    cy.server();
    cy.route('POST', `/${API_PATH}/login`).as('login');
    cy.route('GET', `/${API_PATH}/tags`).as('tags');
    cy.route('GET', `/${API_PATH}/posts*`).as('posts');
    cy.visit('/login');
    cy.get('[data-test="inputField"]').type(Cypress.env('PUBLIC_PASSWORD'), {
      log: false,
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@login')
      .its('status')
      .should('be', 200);
    cy.wait('@tags')
      .its('status')
      .should('be', 200);
    cy.wait('@posts')
      .its('status')
      .should('be', 200);
  });

  it('can login as admin', () => {
    cy.server();
    cy.route('POST', `/${API_PATH}/login`).as('login');
    cy.visit('/login');
    cy.get('[data-test="inputField"]').type(Cypress.env('ADMIN_PASSWORD'), {
      log: false,
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@login')
      .its('status')
      .should('be', 200);
    cy.get('[data-test="menu"]').click();
    cy.get('a')
      .contains('ADMIN')
      .click();
    cy.url().should('include', 'admin');
  });

  it("shouldn't be allowed to go to /", () => {
    cy.logout();
    cy.visit('/');
    cy.contains('Login');
    cy.visit('/admin', { failOnStatusCode: false });
    cy.contains('Login');
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${API_PATH}/posts`,
    })
      .its('status')
      .should('equal', 401);
  });

  it("shouldn't be allowed to see photos", () => {
    cy.logout();
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url:
        'https://photos.local.carpedalan.com/web/176243296263-1280-1707-1536.webp',
    })
      .its('status')
      .should('equal', 403);
  });
});
