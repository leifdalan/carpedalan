describe('Smoke test', () => {
  it('can login', () => {
    cy.server();
    cy.route('POST', '/api/login').as('login');
    cy.visit('/login');
    cy.get('[data-test="inputField"]').type(Cypress.env('PUBLIC_PASSWORD'), {
      log: false,
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@login')
      .its('status')
      .should('be', 200);
  });

  it('can login as admin', () => {
    cy.server();
    cy.route('POST', '/api/login').as('login');
    cy.visit('/login');
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
});
