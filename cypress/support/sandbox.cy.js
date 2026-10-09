describe('Sandbox: генерація питання (позитивний сценарій)', () => {
  it('генерує питання за обраними фільтрами й дозволяє ввести відповідь', () => {
    // Очікувані питання беремо з тих самих даних, які використовує сторінка
    cy.request('/data/questions.json').then(({ body }) => {
      const expected = body.questions
        .filter((q) => q.level === 'Middle' && q.section === 'API')
        .map((q) => q.text);
      expect(expected, 'є питання Middle/API у даних').to.not.be.empty;

      cy.visit('/pages/sandbox.html');

      // 1. Сторінка завантажена, форма й елементи видимі
      cy.get('[data-testid="sandbox-form"]').should('be.visible');
      cy.get('[data-testid="generate-question"]')
        .should('be.visible')
        .and('be.enabled')
        .and('contain.text', 'Згенерувати питання');
      cy.get('[data-testid="question-block"]').should('not.be.visible');
      cy.get('[data-testid="empty-state"]').should('not.be.visible');

      // 2. Вибір параметрів
      cy.get('[data-testid="level"]').select('Middle').should('have.value', 'Middle');
      cy.get('[data-testid="section"]').select('API').should('have.value', 'API');
      cy.get('[data-testid="language"]').should('have.value', 'All');
      cy.get('[data-testid="tool"]').should('have.value', 'All');
      cy.get('[data-testid="experience"]').should('have.value', 'All');

      // 3. Генерація питання
      cy.get('[data-testid="generate-question"]').click();
      cy.get('[data-testid="question-block"]').should('be.visible');
      cy.get('[data-testid="empty-state"]').should('not.be.visible');
      cy.get('[data-testid="generated-question"]')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.not.be.empty;
          expect(expected).to.include(text.trim());
        });

      // 4. Введення відповіді
      const answer = 'Contract testing перевіряє сумісність між споживачем і провайдером.';
      cy.get('[data-testid="answer"]').type(answer).should('have.value', answer);

      // 5. Повторна генерація: питання знову показане, відповідь не зникає
      cy.get('[data-testid="generate-question"]').click();
      cy.get('[data-testid="generated-question"]')
        .invoke('text')
        .then((text) => expect(expected).to.include(text.trim()));
      cy.get('[data-testid="answer"]').should('have.value', answer);
    });
  });
});
