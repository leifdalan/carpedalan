describe('admin', () => {
  before(cy.loginAsAdmin);
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('sid');
    cy.cleanDb();
  });
  it('should be able to upload multiple files', function() {
    cy.server();
    cy.route('POST', '/api/posts').as('posts');
    cy.fixture('neildegrasse.jpg').as('neildegrasse');
    cy.fixture('kitty.jpg').as('kitty');
    // From Cypress document: https://docs.cypress.io/api/utilities/blob.html#Examples
    cy.get('[data-test=multiUploader]').then(subject => {
      Cypress.Blob.base64StringToBlob(this.neildegrasse, 'image/jpeg').then(
        blob1 => {
          Cypress.Blob.base64StringToBlob(this.kitty, 'image/jpeg').then(
            blob2 => {
              const el = subject[0];
              const testFile1 = new File([blob1], 'neildegrasse.jpg', {
                type: 'image/jpeg',
              });
              const testFile2 = new File([blob2], 'kitty.jpg', {
                type: 'image/jpeg',
              });
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(testFile1);
              dataTransfer.items.add(testFile2);
              el.files = dataTransfer.files;
              cy.get('[data-test=submitAll]').click();
              cy.wait('@posts')
                .its('status')
                .should('be', 200);
              cy.wait('@posts')
                .its('status')
                .should('be', 200);
              cy.get('[href="/"]').click();
              cy.get('[data-test="neildegrasse.jpg"]');
              cy.get('[data-test="kitty.jpg"]');
              cy.task('removeUpload');
            },
          );
        },
      );
    });
  });
});
