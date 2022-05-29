import React from 'react';

describe('Brand', () => {
  beforeEach(() => {
    cy.clearCookies();

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
  afterEach(() => {
    cy.clearCookies();
  });

  it('Login and creating a brand', () => {
    cy.visit('http://localhost:3000/brands/create');
    cy.get('#name-input').type('Test').should('have.value', 'Test');
    cy.get('#description-input')
      .type('Description')
      .should('have.value', 'Description');
    cy.get('#create-btn').click();
  });
});
