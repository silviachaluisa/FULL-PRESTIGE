import { useState, useContext } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import usuario from '../../assets/imagenes/usuarios.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../../components/Alertas';
import { HistoryContext } from '../../context/historyProvider';


export const RegistrarUsuarios = () => {
  const navigate = useNavigate();
  const {usuarios}= useContext (HistoryContext)
  const { pathname } = useLocation(); //Para la ruta actualizar

  const [registro, setRegistro] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
    direccion: '',
    cargo: '',
  });
  
  const [mensaje, setMensaje] = useState(null);

  const handleRegister = async (event) => {
    event.preventDefault();
  
    try {
      // Construir la URL de la API para el registro
      const URLRegister = `${import.meta.env.VITE_BACKEND_URL}/register`;
      console.log(registro)

      // Realizar la petición POST
      const respuesta = await axios.post(URLRegister, registro);
      console.log(respuesta)
      
      // Guardar el token en localStorage y establecer el contexto de autenticación
      localStorage.setItem('token', respuesta.data.token);
      
      // Navegar al dashboard después del registro exitoso
      navigate('/historial-usuarios');
    } catch (error) {
      // Configurar el mensaje de error recibido desde la respuesta del servidor
      setMensaje({ respuesta: error.response.data.message, tipo: false });
      console.log(error)
      // Limpiar el formulario después del error
      //setRegistro({}); // Esto no se debio colocar porque no estaba limpiando, sino borrando la informacion de los campos
      
      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/historial-usuarios');
    }
  };

  // Manejador de cambio de valores del formulario
  const handleChange = (e) => {
    setRegistro({
      ...registro,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Contenedor de la cabecera */}
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        
        <button 
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>

      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
        {pathname.split("-")[0].slice(1).toUpperCase()} USUARIOS
      </h2>

      <div>
        <img src={usuario} alt="Usuario" style={{ width: '120px', height: '120px' }} className='mx-auto' />
      </div>

      <div className="w-full max-w-7xl px-10">
      {mensaje && <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} />}

        <form onSubmit={handleRegister} className="grid grid-cols-3 gap-6 border-2 border-red-600 p-6 rounded-lg bg-black mb-7">
          
          {/* Cédula */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cédula</label>
            <input
              type="number"
              name="cedula"
              value={registro.cedula}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='1234567890'
            />
          </div>
          
          {/* Nombre y Apellido */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              value={registro.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Juan Perez'
            />
          </div>
          
          {/* Teléfono */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Teléfono</label>
            <input
              type="number"
              name="telefono"
              value={registro.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='099999999 o 0222222'
            />
          </div>

          {/* Correo */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Correo</label>
            <input
              type="email"
              name="correo"
              value={registro.correo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Juan@hotmail.com'
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block font-semibold mb-2">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={registro.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              required
            />
          </div>
          

          {/* Cargo */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cargo</label>
            <select
            
              name="cargo"
              value={registro.cargo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
              <option value="">Selecciona una opción</option>
              <option value="Gerente">Gerente</option>
              <option value="Administrador">Administrador</option>
              <option value="Tecnico">Técnico</option>
            </select>
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={registro.contrasena}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Ingresa la contraseña'
            />
          </div>

          {/* Estado (solo visible en actualización) */}
          {pathname === '/actualizar-usuarios' && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estado</label>
              <select
                name="estado"
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              >
                <option value="">Selecciona una opción</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          )}
        </form>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            onClick={handleRegister}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            GUARDAR
          </button>
        </div>
      </div>

      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">Empresa Dedicada al Cuidado y Mantenimiento de tu Vehículo</p>
      </footer>
    </div>
  );
};

export default RegistrarUsuarios;
