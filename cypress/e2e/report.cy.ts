import { loginAsAdmin, loginAsVoluntary, logout } from '../helpers/login';
import { accessToReportModal } from '../helpers/report.helpers';
import reportMessages from '../fixtures/report/reportMessages.json';

describe('Feature Report', () => {

  beforeEach(() => {
    cy.intercept('GET', '/association/asso2', { fixture: '/common/association.json' }).as('getAssociationCard');
    cy.intercept('POST', '/report', { statusCode: 201, body: true }).as('postReport');
    cy.intercept('GET', '/report', { fixture: '/report/reports.json' }).as('getReports');
    cy.intercept('PUT', '/report', { statusCode: 200, body: true }).as('putReport');
  });

  describe('Only connected user can report an association', () => {
    it('should not be able to report an association', () => {
      cy.visit('/');
      cy.get('app-activity-card').first()
        .click();
      cy.location('pathname').should('match', /\/activity\/.+/);
      cy.get('body').should('not.contain', 'Signaler');
    });

    describe('A voluntary can report an association if he respects some conditions', () => {
      it('can\'t report with an empty reason', () => {
        loginAsVoluntary();
        accessToReportModal();
        cy.get('p-button').contains('Envoyer')
          .click();
        cy.get('app-textarea-field p')
          .contains('Ce champ est requis')
          .should('be.visible');
        cy.get('body').find('.p-dialog-mask')
          .click({ force: true });
        logout();
      });

      it('should be able to report', () => {
        loginAsVoluntary();
        accessToReportModal();
        cy.get('p-select').click()
          .get('.p-select-option')
          .last()
          .click();
        cy.get('app-textarea-field textarea').should('be.visible');
        cy.get('app-textarea-field textarea').type(reportMessages.correctMessage);
        cy.get('p-button').contains('Envoyer')
          .click();
        cy.get('.p-toast-message').contains('Opération effectuée avec succès')
          .should('exist');
        logout();
      });
    });
  });

  describe('How admin handle reports', () => {
    describe('Only admin can be connected to the report page', () => {
      it('should redirect to the home page', () => {
        loginAsVoluntary();
        cy.visit('/reports');
        cy.location('pathname').should('eq', '/');
        logout();
      });

      it('should access to the page report', () => {
        loginAsAdmin();
        cy.visit('/reports');
        cy.location('pathname').should('eq', '/reports');
        logout();
      });
    });

    describe('Admin can add comment, ban user and close report', () => {
      beforeEach(() => {
        loginAsAdmin();
        cy.visit('/reports');
        cy.get('p-table tbody tr').first()
          .click();
      });

      it('should be able to add a comment', () => {
        cy.get('.report-details-modal app-textarea-field textarea')
          .type('Commentaire test admin', { delay: 50, force: true });
        cy.get('.report-details-modal p-button')
          .contains('Sauvegarder')
          .scrollIntoView()
          .should('be.visible')
          .click();

        cy.get('.p-toast-message')
          .contains('Opération effectuée avec succès')
          .should('exist');

        cy.get('body').find('.p-dialog-mask')
          .click({ force: true });
        logout();
      });

      it('should be able to close a report', () => {
        cy.get('.report-details-modal app-textarea-field textarea')
          .clear()
          .type('Clôture du report par admin');

        cy.get('.report-details-modal app-report-details-action-admin')
          .contains('Clôturer')
          .click();

        cy.contains('.p-confirmdialog-accept-button', 'Oui, clôturer').click();

        cy.wait('@putReport');

        cy.get('.report-details-modal .p-dialog-close-button')
          .click({ force: true });

        cy.get('.p-toast-message')
          .contains('Opération effectuée avec succès')
          .should('be.visible');
      });
    });
  });
});