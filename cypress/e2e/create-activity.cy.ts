import 'cypress-file-upload';
import { loginAsAssociation } from '../helpers/login';

describe('As an association, create a new activity (mocked)', () => {
  beforeEach(() => {
      cy.intercept('POST', '/activities', {
        statusCode: 201,
        fixture: '/createActivity/createdActivity.json',
      });
    },
  );

  it('should mock login and create activity', () => {
    loginAsAssociation();

    // Navigate to activity creation
    cy.get('#create-activity-btn').click();

    // Ajouter nouvelle photo locale
    cy.get('#file-input-0').attachFile('/images/spa.jpg', { force: true });

    // Valider le recadrage
    cy.contains('button', 'Valider').click();

    // Vérifier que la photo est bien visible dans la box
    cy.get('#photo-box-0 img', { timeout: 10000 }).should('be.visible');

    // Fill form using fixture
    cy.fixture('/createActivity/activityCreation.json').then((activity) => {
      cy.get('#input_title').type(activity.title);
      cy.get('#input_requestedVolunteers').type(activity.requestedVolunteers.toString());
      cy.get('#input_date').type(activity.date);
      cy.get('#input_hour').type(activity.time);

      cy.get('#search-address-input input')
        .focus()
        .type(activity.address, { delay: 100 });

      cy.wait(100);

      cy.get('#search-address-input_0').should('be.visible')
        .click();

      cy.get('#textarea-field').type(activity.description);

      cy.contains('button', activity.themes[0]).click();
      cy.contains('button', activity.themes[1]).click();
    });

    // Submit
    cy.contains('button', 'Publier').click();

    // Assert success
    cy.get('.p-toast-message').contains('Opération effectuée avec succès')
      .should('be.visible');
  });
});



