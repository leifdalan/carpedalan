describe('admin', () => {
  before(cy.loginAsAdmin);
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('sid');
    // cy.cleanDb();
  });
  it('should be able to upload multiple files', function() {
    cy.server();
    cy.route('POST', '/api/posts').as('posts');
    cy.fixture('neildegrasse.jpg').as('neildegrasse');
    cy.get('[data-test=multiUploader]').then(subject =>
      // From Cypress document: https://docs.cypress.io/api/utilities/blob.html#Examples
      Cypress.Blob.base64StringToBlob(this.neildegrasse, 'image/jpeg').then(
        blob => {
          const el = subject[0];
          const testFile = new File([blob], 'neildegrasse.jpg', {
            type: 'image/jpeg',
          });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          cy.get('[data-test=submitAll]').click();
          cy.wait('@posts')
            .its('status')
            .should('be', 200);
          cy.get('[href="/"]').click();
          cy.get('[data-test="neildegrasse.jpg"]');
          // cy.task('removeUpload');
        },
      ),
    );
  });
});
