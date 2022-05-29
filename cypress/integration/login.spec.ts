import React from 'react';

describe('Login', () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  afterEach(() => {
    cy.clearCookies();
  });

  it('Open dashboard without login should redirect to the login page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // The new url should include "/about"
    cy.url().should('include', '/login');
  });

  it('Login with test credentials should redirect to the dashboard', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/login');
    // type email
    cy.get("input[type='text']")
      .type('test@test.com')
      .should('have.value', 'test@test.com');
    cy.get("input[type='password']")
      .type('123456')
      .should('have.value', '123456');
    cy.contains('Login With Email').click();
    cy.url().should('equal', 'http://localhost:3000/');
  });

  it('Login with unregistered account should show an error', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/login');
    // type email
    cy.get("input[type='text']")
      .type('someone@someone.com')
      .should('have.value', 'someone@someone.com');
    cy.get("input[type='password']")
      .type('123456')
      .should('have.value', '123456');
    cy.contains('Login With Email').click();
    cy.contains('Logged In Failed');
  });
});
