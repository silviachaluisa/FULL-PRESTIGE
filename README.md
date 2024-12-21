# GESTIÓN DE UN TALLER AUTOMOTRIZ "FULL PRESTIGE" (FRONTEND) <br>

## Descripción del Proyecto <br>

Este proyecto es la interfaz web para gestionar los servicios web del taller automotriz Full Prestige. <br>
Permite a los usuarios manejar información de clientes y vehículos de forma segura y eficiente.<br>

## Características <br>
Se presenta una lista de las principales funcionalidades del frontend:
* Inicio de sesión y autenticación
* Gestión de perfiles de usuarios
* Visualización y gestión de clientes y vehículos
* Control de asistencia del personal
* Historial de mantenimientos realizados y pagos
  
## Tecnologías Utilizadas <br>
***Herramientas y entorno***<br>
- **npm**: Gestor de paquetes
- **Node.js**: Entorno de ejecución de JavaScript en el servidor<br>

***Frameworks y bibliotecas***<br>
- **React:** Biblioteca para la creación de interfaces de usuario.<br>

***Librerías para funcionalidades específicas***<br>
- **axios:** Librería para realizar solicitudes HTTP.
- **jsdpf:** Líbreria para la generación de documentos PDF.
- **xlsl:** Librería para la manipulación de hojas de cálculo.

***Lenguajes***<br>
- **JavaScript:** Lenguaje de programación base para React.
  
***Hooks y Estados Principales***<br>
* **useState:** Hook para manejar el estado en componentes funcionales.
* **useContext:** Hook para acceder al contexto `HistoryContext`.
* **useLocation y useNavigate:** Hook para manejar el estado en componente funcionales.

***Estilo y diseño***<br>
- **TailwindCss:** Framework de utilidades para estilos CSS.

***Caraterísticas nativas
- **Prototype:** Propiedad nativa de JavaScript para extender y modificar clases y objetos.
  
> [!CAUTION]
> Al momento de instalar las dependencias si da algun error y no se instala, forzarlo con el siguiente comando: `npm install nombre-paquete --force`(NO RECOMENDABLE)<br>
> Ejemplo: `npm i --force`

> [!NOTE]
> Este comando puede forzar la instalación, pero podría generar inestabilidad en el proyecto. Úsalo solo como último recurso y verifica el funcionamiento del proyecto después de aplicarlo. 
    
## Requisitos Previos <br>
Herramientras y configuraciones necesarias para trabajar en el proyecto:
- Editor de código fuente **"Visual Studio Code"**
- Git
- Node js (v22.11.0)
- Npm
-  
## Instalación <br>
Intrucciones paso a paso para configurar y ejecutar el proyecto localmente
1. Clonar repositorio: `git clone https://github.com/silviachaluisa/FULL-PRESTIGE.git`  
2. Ir al directorio del proyecto: `cd frontend`
3. Instalar dependencias: `npm install`
4. Iniciar el servidor de desarrollo: `npm run dev`
5. Abrir el navegador en: http:localhost:3000

> [!TIP]
> **Para clonar el repositorio se lo puede realizar mediante la terminal de windows o
> utilizando GitHub Desktop para mayor facilidad**<br>
> Para crear iniciar un proyecto desde 0 usar el comando: `npm create vite@latest`



## Estructura del Proyecto<br>
<pre>
src/
├── assets/
│   ├── imagenes/
│   │   ├── Redes/
│   │   ├── asistencia.png
│   │   ├── bg.jpg
│   │   ├── bg2.png
│   │   ├── client.png
│   │   ├── excel.png
│   │   ├── Fondo.png
│   │   ├── icon.jpg
│   │   ├── logo.jpg
│   │   ├── pdf.png
│   │   ├── user.jpg
│   │   └── usuarios.png
├── components/
├── context/
│   ├── AuthProvider.jsx
│   ├── HistoryContext.jsx
│   └── historyProvider.jsx
├── Layouts/
│   └── verifyAuth.jsx
├── Paginas/
│   ├── Asistencias/
│   ├── Clientes/
│   ├── Pagos/
│   ├── Tecnicos/
│   └── Borrador.jsx

</pre>
## Contribución <br>
Instrucciones para colaborar en el proyecto
Si deseas contribuir, por favor abre un issue o envia un pull request con tus cambios

## Estado del Proyecto <br>
> [!IMPORTANT]
> **El proyecto esta en desarrollo y sujeto a cambios frecuentemente**<br>

## Autores <br>
**Frontend-Silvia Chaluisa:**<br>  
Correo: veronica-14-1998@hotmail.com
> [!NOTE]
> **Backend-Marcelo Pinzón:**<br>  
> Correo: marcelo.pinzon@epn.edu.ec

## Licencia <br>
> [!WARNING]
> **NO APLICA**

##Pruebas
Para realizar las pruebas de aceptación se debe configurar el archivo
![{12AC4363-1B9D-4442-AEAF-21CCC59A90E2}](https://github.com/user-attachments/assets/8972892c-cdc0-484d-b8b6-db0120686c7d)









