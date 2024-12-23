describe('Pruebas End-to-End del Login', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { message: 'Credenciales inválidas' },
      });
    }).as('postLogin');
    cy.visit('http://localhost:5173/login');
  });

  it('Renderiza correctamente el formulario de inicio de sesión', () => {
    cy.get('input[name="correo"]').should('exist');
    cy.get('input[name="contrasena"]').should('exist');
    cy.get('button[type="submit"]').should('exist').and('be.disabled');
  });

  it('El botón Iniciar Sesión se habilita con campos válidos', () => {
    cy.get('input[name="correo"]').type('pinzonmarcelo759@gmail.com');
    cy.get('input[name="contrasena"]').type('alejoP@');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('Muestra un mensaje de error con credenciales inválidas', () => {
    cy.get('input[name="correo"]').type('usuario_invalido@gmail.com');
    cy.get('input[name="contrasena"]').type('contraseñaIncorrecta');
    cy.get('button[type="submit"]').click();
    cy.contains('Credenciales inválidas').should('be.visible'); // Cambia al mensaje que envía tu backend
  });

  it('Redirige al dashboard con credenciales válidas', () => {
    cy.intercept('POST', '**/login', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          empleado: { token: 'fake-token' },
        },
      });
    }).as('postLogin');

    cy.get('input[name="correo"]').type('pinzonmarcelo759@gmail.com');
    cy.get('input[name="contrasena"]').type('alejoP@.');
    cy.get('button[type="submit"]').click();

    cy.wait('@postLogin'); // Espera la respuesta del backend
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido').should('be.visible'); // Ajusta según tu dashboard
  });

  it('El botón de visibilidad de contraseña alterna el tipo de campo', () => {
    // Verifica que el campo inicialmente es de tipo "password"
    cy.get('input[name="contrasena"]').should('have.attr', 'type', 'password');
  
    // Clic en el botón para mostrar la contraseña
    cy.get('button[aria-label="Mostrar contraseña"]').click();
  
    // Verifica que el campo cambia a tipo "text"
    cy.get('input[name="contrasena"]').should('have.attr', 'type', 'text');
  
    // Clic en el botón para ocultar la contraseña
    cy.get('button[aria-label="Ocultar contraseña"]').click();
  
    // Verifica que el campo vuelve a tipo "password"
    cy.get('input[name="contrasena"]').should('have.attr', 'type', 'password');
  });
  
});
