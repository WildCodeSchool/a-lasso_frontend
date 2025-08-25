beforeEach(() => {
  // the home page's necessary mocks
  cy.intercept('GET', '/activities', { fixture: '/common/activities.json' }).as('getActivities');
  cy.intercept('GET', '/themes', { fixture: '/common/themes.json' }).as('getThemes');
  cy.intercept('GET', 'https://api.maptiler.com/maps/**', { statusCode: 200, body: {} }).as('mapTiler');
});
