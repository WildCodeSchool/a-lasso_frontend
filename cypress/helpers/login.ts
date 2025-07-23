export function loginAsAssociation(): void {
  cy.fixture('associationLogin.json').then((association) => {
    cy.visit('/');
    cy.get('#connexion-btn').click();
cy.get('#input_email', { timeout: 10000 }).should('be.visible');
cy.get('#input_email').type(association.email, { delay: 0 });
    cy.get('#input_password')
      .type(association.password, { delay: 0 });
    cy.get('#connexion-submit-button')
      .should('not.be.disabled')
      .click();
    cy.contains('Bonjour,').should('be.visible');
  });
}