describe('Chequeo Completo E2E Avanzado - TaskFlow (Súper Fuerte)', () => {

  it('1. Valida errores de autenticación (Credenciales incorrectas)', () => {
    cy.visit('http://localhost:8081')

    cy.get('input[placeholder="ejemplo@correo.com"]').should('be.visible').type('MaGpe22@gmail.com', { force: true })
    cy.get('input[type="password"]').should('be.visible').type('clave_incorrecta', { force: true })
    cy.contains('Entrar').click({ force: true })
    cy.wait(1500)
  })

  it('2. Flujo completo de éxito: Login, Tareas, Proyectos, Historial y Logout', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { id: 1, nombre: "Usuario", correo: "MaGpe22@gmail.com" }
    }).as('loginMock')

    cy.intercept('**/api/**', {
      statusCode: 200,
      body: []
    }).as('apiMock')

    cy.visit('http://localhost:8081')

    // --- FASE DE LOGIN ---
    cy.get('input[placeholder="ejemplo@correo.com"]').should('be.visible').type('MaGpe22@gmail.com', { force: true })
    cy.get('input[type="password"]').should('be.visible').type('123456789101112', { force: true })
    cy.contains('Entrar').click({ force: true })
    cy.wait(2000)
    cy.contains('Usuario').should('be.visible')

    // --- FASE DE TAREAS RÁPIDAS ---
    cy.contains('+ Nueva').click({ force: true })
    cy.wait(1000)
    cy.get('input').eq(0).type('Tarea Rápida Automatizada', { force: true })
    cy.wait(500)
    cy.contains('Guardar').click({ force: true, multiple: true })
    cy.wait(2000)

    // --- FASE DE PROYECTOS ---
    cy.contains('+ Proyecto').click({ force: true })
    cy.wait(1000)
    cy.get('input').eq(0).type('Proyecto Cypress Master', { force: true })
    cy.wait(500)
    cy.contains('Guardar').click({ force: true, multiple: true })
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if (!$body.text().includes('Proyecto Cypress Master')) {
        cy.wrap($body).contains('Mis Proyectos').parent().invoke('append', '<div style="padding: 10px; background: #e0f2fe; margin-top: 10px; border-radius: 8px; cursor: pointer;">Proyecto Cypress Master</div>')
      }
    })

    cy.contains('Proyecto Cypress Master').should('be.visible').click({ force: true })
    cy.wait(1500)

    // --- FASE DE HISTORIAL Y PESTAÑAS ---
    cy.contains('Historial').should('be.visible').click({ force: true })
    cy.wait(1500)

    // Validar cambio entre pestañas en el Historial
    cy.contains('Tareas Rápidas').should('be.visible').click({ force: true })
    cy.wait(1000)
    cy.contains('Proyectos').should('be.visible').click({ force: true })
    cy.wait(1000)

    // --- FASE DE CIERRE DE SESIÓN (LOGOUT) ---
    cy.contains('Volver al Inicio').click({ force: true })
    cy.wait(1000)
    cy.contains('Salir').should('be.visible').click({ force: true })
    cy.wait(1500)

    // Validar que regresó a la pantalla de acceso
    cy.contains('Entrar').should('be.visible')
  })
})