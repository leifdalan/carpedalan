import { API_PATH } from '../../shared/constants';

const checkPosts = (description = false) => {
  if (description) {
    it('should have a description on posts', () => {
      cy.getTestId('description');
    });
  }

  it('should have a date on posts', () => {
    cy.getTestId('date');
  });

  it('should have a download link', () => {
    cy.getTestId('download')
      .first()
      .should($el => {
        expect($el.attr('href')).to.contain('photo');
      });
  });
};

const checkGallery = (beforeFun = () => {}) => {
  describe('Thumbnail Modal', () => {
    before(beforeFun);
    beforeEach(() => {
      cy.get('picture')
        .first()
        .click();
    });
    it('should be able to close with close button', () => {
      cy.closeModal();
      cy.get('[data-test="closeModal"]').should('not.exist');
    });
    // it('should be able to close with click away', () => {
    //   cy.get('[data-test="background"]').click('left');
    //   cy.get('[data-test="background"]').should('not.exist');
    // });
    describe('Thumbnail', () => {
      afterEach(cy.closeModal);
      checkPosts();
    });
  });
};

const checkGrid = () => {
  it('should show a grid and be able to switch back', () => {
    cy.getTestId('Grid').click();
    cy.url().should('contain', 'grid');
    cy.get('picture')
      .its('length')
      .should('be.greaterThan', 50);
    cy.getTestId('List').click();
    cy.url().should('not.contain', 'grid');
  });
};

['iphone-6+', 'macbook-13'].forEach(view => {
  describe(`${view}`, () => {
    before(() => {
      cy.login();
      cy.visit('/');
    });
    beforeEach(() => cy.viewport(view));
    describe('Read User', () => {
      beforeEach(() => {
        cy.ensureLoggedIn();
      });
      describe('Main feed', () => {
        beforeEach(cy.goHome);

        it('should get more posts when scrolling', () => {
          cy.server();
          cy.route('GET', `${API_PATH}/posts?*page=2*`).as('page2');
          cy.scrollTo('bottom');
          cy.wait(100);
          cy.scrollTo('bottom');
          cy.wait(100);
          cy.scrollTo('bottom');
          cy.wait(100);
          cy.wait('@page2')
            .its('status')
            .should('be', 200);
        });
        checkGrid();
        checkPosts(true);
      });

      checkGallery(cy.goHome);

      describe('Tag Page', () => {
        before(() => {
          cy.server();
          cy.route('GET', `${API_PATH}/tags/*/posts`).as('tagRoute');
          cy.ensureLoggedIn();
          cy.goHome();
          cy.getTestId('menu').click();
          cy.getTestId('tag')
            .eq(2)
            .click();
          cy.wait('@tagRoute')
            .its('status')
            .should('be', 200);
        });

        it('should have a tag title', () => {
          cy.getTestId('title').contains('#');
        });

        checkPosts();
        checkGrid();
        checkGallery();
      });
    });
  });
});
