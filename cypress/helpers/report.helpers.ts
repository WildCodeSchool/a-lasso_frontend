export function accessToReportModal(): void {
  cy.visit('/');
  cy.get('app-activity-card').first()
    .click();
  cy.location('pathname').should('match', /\/activity\/.+/);
  cy.get('p-button').contains('Signaler')
    .click();
}