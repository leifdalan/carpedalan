describe('admin', () => {
  before(cy.loginAsAdmin);
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('sid');
  });
  it('should have a multi file uploader', () => {
    cy.get('[data-test=multiUploader]');
  });
});
