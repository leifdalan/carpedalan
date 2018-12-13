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

  it('can logout', () => {
    cy.logout();
  });

  it("shouldn't be allowed to go to /", () => {
    cy.logout();
    cy.visit('/');
    cy.url().should('include', 'login');
    cy.visit('/admin');
    cy.url().should('include', 'login');
    cy.request({ failOnStatusCode: false, method: 'GET', url: '/api/posts' })
      .its('status')
      .should('equal', 401);
  });

  it("shouldn't be allowed to see photos", () => {
    cy.logout();
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: '/api/images/720/something.jpg',
    })
      .its('status')
      .should('equal', 401);
  });
});
