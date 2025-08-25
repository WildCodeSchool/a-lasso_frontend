export function loginAsAssociation(): void {
  cy.intercept('POST', '/auth/login', { fixture: '/common/userAssociation.json' });

  cy.visit('/');
  cy.get('#connexion-btn').click();
  cy.get('#input_email', { timeout: 10000 }).should('be.visible');
  cy.get('#input_email').clear()
    .type('association@example.com', { delay: 0 });
  cy.get('#input_password').clear()
    .type('Password', { delay: 0 });
  cy.get('#connexion-submit-button')
    .should('not.be.disabled')
    .click();
  cy.contains('Bonjour,').should('be.visible');
}

export function loginAsVoluntary(): void {
  cy.intercept('POST', '/auth/login', { fixture: '/common/userVoluntary.json' });

  cy.visit('/');
  cy.get('#connexion-btn').click();
  cy.get('#input_email', { timeout: 10000 }).should('be.visible');
  cy.get('#input_email').clear()
    .type('pierre@gmail.com', { delay: 0 });
  cy.get('#input_password').clear()
    .type('Password', { delay: 0 });
  cy.get('#connexion-submit-button')
    .should('not.be.disabled')
    .click();
  cy.contains('Bonjour,').should('be.visible');
}

export function loginAsAdmin(): void {
  cy.intercept('POST', '/auth/login', { fixture: '/common/userAdmin.json' });

  cy.visit('/');
  cy.get('#connexion-btn').click();
  cy.get('#input_email', { timeout: 10000 }).should('be.visible');
  cy.get('#input_email').clear()
    .type('admin@gmail.com', { delay: 0 });
  cy.get('#input_password').clear()
    .type('Password', { delay: 0 });
  cy.get('#connexion-submit-button')
    .should('not.be.disabled')
    .click();
  cy.contains('Bonjour,').should('be.visible');
}

export function logout(): void {
  cy.get('#avatar-connected-user').click();
  cy.get('#logout').click();
}
