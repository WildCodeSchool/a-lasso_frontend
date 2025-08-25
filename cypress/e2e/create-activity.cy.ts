import 'cypress-file-upload';

describe('As an association, create a new activity (mocked)', () => {
  it('should mock login and create activity', () => {
    cy.visit('/');

    // Simulate clicking login button and sending fake credentials
    cy.get('#login-btn').click();
    cy.get('#email').type('mock@asso.fr');
    cy.get('#password').type('fakepassword');
    cy.get('#submit-login').click();

    // Assert mocked login worked
    cy.contains('Bienvenue Association Test');

    // Navigate to activity creation
    cy.get('#create-activity-btn').click();

    // Upload photo (mocked, no backend)
    cy.get('#file-input-1').attachFile('spa.jpg', { force: true });

    // Fill form using fixture
    cy.fixture('activityCreation.json').then((activity) => {
      cy.get('#input_title').type(activity.title);
      cy.get('#input_requestedVolunteers').type(activity.requestedVolunteers.toString());
      cy.get('#input_date').type(activity.date);
      cy.get('#input_hour').type(activity.time);
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



