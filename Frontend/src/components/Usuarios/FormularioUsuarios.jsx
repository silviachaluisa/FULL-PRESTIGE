
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect} from 'react';
import Mensaje from '../Alertas';
import { useContext } from 'react';
import { HistoryContext } from '../../context/historyProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const FormularioUsuarios = ({usuarios}) => {
    console.log(usuarios)
    const navigate = useNavigate();
    const {upDateUser}=useContext(HistoryContext)
    const [registro, setRegistro] = useState({

        cedula: '',
        nombre: '',
        telefono: '',
        correo: '',
        contrasena: '',
        direccion: '',
        cargo: '',
      });
      // Sincronizar los valores cuando cambia `usuarios`
      useEffect(() => {
        if (usuarios) {
          setRegistro({
            cedula: usuarios.cedula ?? '',
            nombre: usuarios.nombre ?? '',
            telefono: usuarios.telefono ?? '',
            correo: usuarios.correo ?? '',
            contrasena: usuarios.contrasena ?? '',
            direccion: usuarios.direccion ?? '',
            cargo: usuarios.cargo ?? '',
            estado: usuarios.estado ?? '',
          });
        } else {
          // Limpia los campos si no hay datos de usuario
          setRegistro({
            cedula: '',
            nombre: '',
            telefono: '',
            correo: '',
            contrasena: '',
            direccion: '',
            cargo: '',
            estado: '',
          });
        }
      }, [usuarios]);
      
      const [mensaje, setMensaje] = useState(null);
      const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

      const handleSubmit = async (event) => {
        event.preventDefault();
        if (usuarios?.cedula){

            try {
                const updateinfo={...usuarios}
                updateinfo.estado=usuarios?.estado=="Activo" ? true:false

               await upDateUser(usuarios?.cedula, updateinfo)
             
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
        }else{

            try {
              // Construir la URL de la API para el registro
              const URLRegister = `${import.meta.env.VITE_BACKEND_URL}/register`;
              console.log(registro)
            // Se esta desctructurando del objeto registro y se esta quitando la propiedad estado que no es necesario para el regitro
              const DatosRegitrar = {...registro}
              delete DatosRegitrar.estado
      

              // Realizar la petición POST
              
              const respuesta = await axios.post(URLRegister, DatosRegitrar);
              console.log(respuesta)
              
              // Guardar el token en localStorage y establecer el contexto de autenticación
              //localStorage.setItem('token', respuesta.data.token);
              
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
        
      };
     // Manejador de cambio de valores del formulario
  const handleChange = (e) => {
    setRegistro({
      ...registro,
      [e.target.name]: e.target.value,
    });
  };

    return (
        
        <div className="w-full max-w-7xl px-10">
      {mensaje && <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} />}



      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 border-2 border-red-600 p-6 rounded-lg bg-black mb-7">
          
          {/* Cédula */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cédula</label>
            <input
              id='cedula'
              type="texto"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='1234567890'
              name="cedula"
              value={registro.cedula}
              onChange={handleChange}
            />
          </div>
          
          {/* Nombre y Apellido */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nombre y Apellido</label>
            <input
              id='nombre'
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
              id='telefono'
              type="text"
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
            <label className="block font-semibold mb-2">Direccion</label>
            <input
              id='direccion'
              type="texto"
              name="direccion"
              value={registro.direccion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Direccion'
              autoComplete="off" // Aquí se desactiva la auto-completación para este campo
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block font-semibold mb-2">Correo</label>
            <input
            id='correo'
              type="email"
              name="correo"
              value={registro.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Correo'
              required
              
            />
          </div>
          

          {/* Cargo */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cargo</label>
            <select
            id='cargo'
              name="cargo"
              value={registro.cargo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
              <option value="">Selecciona una opción</option>
              <option value="Gerente">Gerente</option>
              <option value="Administrador">Administrador</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>

          {/* Contraseña */}
          <div className="mb-4 relative">
            <label className="block font-semibold mb-2">Contraseña
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 mt-4"
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />} {/* Cambia el ícono */}
            </button>
            </label>
            
            <input
              id='contrasena'
              type={showPassword ? 'text': 'password'}
              name="contrasena"
              value={registro.contrasena}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Ingresa la contraseña'
            />
          </div>

          {/* Estado (solo visible en actualización) */}
          {usuarios && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estado</label>
              <select
              id='estado'
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
            onClick={handleSubmit}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            GUARDAR
          </button>
        </div>
        
      </div>
      

        
        
    )
}
