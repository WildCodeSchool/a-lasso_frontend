beforeEach(() => {
  // Mock login endpoint
  cy.intercept('POST', '/api/auth/login', { fixture: 'userAssociation.json' });

  // Mock activities fetch
  cy.intercept('GET', '/api/activities*', { fixture: 'activities.json' });

  // Mock address autocomplete
  cy.intercept('GET', '/api/addresses*', [
    { label: '123 Mocked Street', value: '123 Mocked Street' }
  ]);

  // Mock activity creation
  cy.intercept('POST', '/api/activities', {
    statusCode: 201,
    body: { success: true, id: 123 }
  });

  // Mock reports
//   cy.intercept('GET', '/api/reports*', { fixture: 'reports.json' });
  cy.intercept('POST', '/api/reports', { success: true });
});
