# Estructura del Frontend <br>
## Módulo Administrador <br>
### Componente: Registrar Usuario <br>
El componente RegistrarUsuario permite al administrador registrar nuevos usuarios en el sistema y asignarles roles específicos (como Gerente, Administrador o Técnico). Este componente facilita la creación de usuarios 
con sus datos personales y la asignación de un cargo dentro de la empresa.<br>

***Características***<br>
* **Registro de Usuarios:** Permite al administrador crear cuentas de usuario en el sistema 
  ingresando campos necesarios como cédula, nombre, teléfono, correo, dirección, cargo y 
  contraseña.
* **Asignación de Roles:** Asigna un rol a cada usuario según sus responsabilidades en la empresa.
* **Validación de Datos:** Realiza validaciones básicas de los datos para asegurar que los campos 
  sean completados correctamente.
* **Almacenamiento de Token:** Guarda el token de autenticación en localStorage después de 
  registrar exitosamente al usuario.
### Estructura del Código <br>
***Dependencias***<br>

El componente utiliza:

* **React:** Para la creación del estado y manejo de eventos.
* **Axios:** Para realizar la solicitud HTTP al backend y registrar al usuario en la base de 
   datos.
* **React Router:** Para redirigir al usuario después de un registro exitoso y obtener la URL 
  actual.
* **TailwindCSS:** Para el diseño y estilo del componente.
* **Mensaje de Confirmación:** Usa un componente personalizado Mensaje para mostrar mensajes de 
  éxito o error.

***Hooks y Estados Principales***<br>
* **useState:** Almacena la información ingresada en el formulario.
* **useContext:** Obtiene el contexto de HistoryContext para añadir el historial del usuario.
* **useLocation y useNavigate:** Para redirigir al usuario tras completar el registro y definir la lógica condicional en el componente.


***Estructura del Formulario***<br>
Campos de Registro
1. Cédula
2. Nombre y Apellido
3. Teléfono
4. Correo Electrónico
5. Dirección
6. Cargo: Selección de roles predefinidos (Gerente, Administrador, Técnico).
7. Contraseña
8. Campo de Estado (opcional en edición)
9. El campo de Estado solo es visible cuando el formulario es utilizado en modo de edición de 
   usuario. En el modo de registro, este campo está oculto.
> [!NOTE]
> **Campo de Estado (opcional en edición)**<br>
> El campo de Estado solo es visible cuando el formulario es utilizado en modo de edición de usuario. En el modo de registro, este campo está oculto.

## Componente EditarPerfil
Este componente permite a los usuarios ver y editar su perfil en una página que incluye un formulario prellenado con la información actual del usuario. Los usuarios pueden actualizar campos como cédula, nombre, teléfono, correo, dirección, cargo y estado.

Características
Visualización de datos personales en un formulario editable.
Actualización de la información del perfil mediante una solicitud PUT al backend.
Validación de token de usuario para asegurar que solo los usuarios autenticados accedan a esta página.
Mensaje de confirmación de éxito o error al guardar los cambios.
Estructura del Código
Dependencias
Este componente utiliza:

axios para realizar solicitudes HTTP.
useState y useEffect de React para manejar el estado y los efectos del componente.
useNavigate de React Router para redirigir al usuario.
Componente personalizado Mensaje para mostrar alertas (mensajes de éxito o error).
Código Principal
Estados y Hooks:

perfil: Estado que contiene los datos del perfil del usuario.
mensaje: Estado para manejar el mensaje de confirmación tras guardar cambios.
useEffect: Al montarse el componente, realiza una solicitud GET al backend para obtener el perfil del usuario.
Manejadores de Eventos:

handleChange: Actualiza el estado perfil conforme el usuario cambia los campos en el formulario.
handleSave: Envía los cambios al backend con una solicitud PUT al hacer clic en "Guardar cambios".
Autenticación:

Utiliza localStorage para verificar la existencia de un token. Si no existe, redirige al usuario a la página de inicio de sesión.
Estilos
El componente usa TailwindCSS para estilizar el formulario, botones y estructura. Asegúrate de tener instalado y configurado TailwindCSS en tu proyecto.

Instalación y Configuración
Instalar Axios

Si aún no tienes Axios en tu proyecto, instálalo con:

bash
Copy code
npm install axios
Configurar URL de Backend

Este componente asume que tienes una variable de entorno llamada VITE_BACKEND_URL que apunta a tu backend. Asegúrate de que esta variable esté configurada correctamente.

Ejemplo de Backend para Endpoint

Tu backend debe tener un endpoint para obtener (GET /perfil) y actualizar (PUT /perfil) la información del perfil del usuario autenticado. Ejemplo:

javascript
Copy code
// Backend - perfilController.js

const obtenerPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  res.json(usuario);
};

const actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(req.usuario.id, req.body, { new: true });
  res.json(usuario);
};
Uso
javascript
Copy code
import EditarPerfil from './ruta/del/componente/EditarPerfil';

function App() {
  return (
    <div className="App">
      <EditarPerfil />
    </div>
  );
}

export default App;
Personalización
Puedes adaptar este componente:

Campos adicionales: Si necesitas campos adicionales, agrégalos al estado perfil y ajusta el formulario.
Estilos: Modifica los estilos CSS o usa tu propio sistema de diseño.
Capturas de Pantalla
Formulario para Editar Perfil


Mensaje de Confirmación
