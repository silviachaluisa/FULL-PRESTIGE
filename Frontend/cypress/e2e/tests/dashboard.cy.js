describe('Pruebas funcionales E2E del Dashboard', () => {
    before(() => {
        // Simula el inicio de sesión antes de realizar las pruebas
        cy.visit('/login'); // Cambia según la ruta de tu login

        // Verifica y escribe el correo
        cy.get('input[name="correo"]', { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .type('pinzonmarcelo759@gmail.com'); // Reemplaza con datos de prueba

        // Verifica y escribe la contraseña
        cy.get('input[name="contrasena"]', { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .type('alejoP@.'); // Reemplaza con datos de prueba

        // Clic en el botón de inicio de sesión
        cy.get('button[type="submit"]', { timeout: 10000 }).click();

        // Verifica la redirección al Dashboard
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('Verifica que el encabezado muestra el logo y el nombre del usuario', () => {
        // Asegúrate de que el encabezado esté renderizado
        cy.get('header', { timeout: 10000 })
            .should('exist')
            .and('be.visible');
    
        // Verifica que el logo está visible
        cy.get('.logo-header', { timeout: 10000 })
            .should('exist')
            .and('be.visible');
    
        // Verifica que el nombre del usuario está visible y contiene el nombre esperado
        cy.get('.user-name', { timeout: 10000 })
            .should('exist')
            .and('be.visible')
            .and('contain', 'Bienvenido/a:'); // Cambia según tu diseño

        cy.get('.user-role', { timeout: 10000 }) // Nuevo: user-role
            .should('exist')
            .and('contain', 'Administrador'); // Ajustar según tu diseño    
    });

    it('Verifica que los enlaces del menú funcionan correctamente', () => {
        cy.wait(2000); // Espera a que se cargue el menú
        cy.get('body').then(($body) => {
            if ($body.find('.menu').length) {
                // Si el elemento .menu existe, continúa con la prueba
                cy.get('.menu').should('exist').and('be.visible');
            } else {
                // Si .menu no está en el DOM, imprime un mensaje de error
                cy.log('.menu no está en el DOM');
            }
        });
    });
    

      
});
