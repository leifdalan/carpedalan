describe('Smoke test', () => {
  it('can login', () => {
    cy.server();
    cy.route('POST', '/api/login').as('login');
    cy.visit('/login');
    cy.get('[data-test="secret"]').click();
    cy.get('[data-test="inputField"]').type(Cypress.env('PUBLIC_PASSWORD'), {
      log: false,
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@login')
      .its('status')
      .should('be', 200);
    cy.logout();
  });

  it('can login as admin', () => {
    cy.logout();
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
    cy.get('[data-test="menu"]').click();
    cy.get('a')
      .contains('ADMIN')
      .click();
    cy.url().should('include', 'admin');
  });

  it('should have images, sidebar', () => {
    cy.logout();
    cy.login();
    cy.get('img');
    cy.get('[data-test=menu]');
  });

  // it('can logout', () => {
  //   cy.logout();
  // });

  // it("shouldn't be allowed to go to /", () => {
  //   cy.logout();
  //   cy.visit('/');
  //   cy.url().should('include', 'login');
  //   cy.visit('/admin');
  //   cy.url().should('include', 'login');
  //   cy.request({ failOnStatusCode: false, method: 'GET', url: '/api/posts' })
  //     .its('status')
  //     .should('equal', 401);
  // });

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

  it('should have coming in 2019 text', () => {
    cy.logout();
    cy.visit('/');
    cy.get('[data-test="comingSoon"]').should(
      'have.text',
      'Coming February 1st',
    );
  });
});
