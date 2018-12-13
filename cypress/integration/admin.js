describe('admin', () => {
  before(cy.loginAsAdmin);
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('sid');
  });
  it('type a description', () => {
    cy.get('[data-test=inputField]').type('this is a description');
  });
});
