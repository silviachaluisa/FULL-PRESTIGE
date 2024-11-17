import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect} from 'react';
import Mensaje from '../Alertas';
import { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const FormularioUsuarios = ({usuarios}) => {
  

  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});  
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad
  const {upDateUser,fetchUsuarios}=useContext(HistoryContext)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [registro, setRegistro] = useState({
        cedula: '',
        nombre: '',
        telefono: '',
        correo: '',
        contrasena: '',
        direccion: '',
        cargo: '',
        estado: '',
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
      const handleSubmit = async (event) => {
        event.preventDefault();

        //Iniciliza un objeto para los errores
        const nuevosErrores = {};

            // Validaciones de cada campo
        if (!registro.cedula) nuevosErrores.cedula = "La cédula es obligatoria.";
        if (!registro.nombre) nuevosErrores.nombre = "El nombre es obligatorio.";
        if (!registro.telefono) nuevosErrores.telefono = "El teléfono es obligatorio.";
        if (!registro.correo) nuevosErrores.correo = "El correo es obligatorio.";
        if (!registro.contrasena && !usuarios) nuevosErrores.contrasena = "La contraseña es obligatoria.";
        if (!registro.direccion) nuevosErrores.direccion = "La dirección es obligatoria.";
        if (!registro.cargo) nuevosErrores.cargo = "El cargo es obligatorio.";

            // Si hay errores, actualiza el estado de errores y detén el proceso
        if (Object.keys(nuevosErrores).length > 0) {
          setErrores(nuevosErrores);
          return;
      }

        // Si no hay errores, limpia los errores anteriores y continúa
        setErrores({});

        if (usuarios?.cedula) {
            try {
                const updateinfo = { ...registro };
                delete updateinfo.estado
                updateinfo.estado = registro?.estado === "Activo" ? true : false;
                console.log(updateinfo)
    
                // Llamar a la función para actualizar el usuario
                await upDateUser(usuarios?.cedula, updateinfo);
    
                // Configurar el mensaje de éxito
                setMensaje({ respuesta: "Usuario actualizado con éxito", tipo: true });
    
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                  fetchUsuarios()
                    setMensaje(null);
                    // Navegar al historial de usuarios
                    navigate('/historial-usuarios');
                }, 4000);
                
            } catch (error) {
                // Configurar el mensaje de error recibido desde la respuesta del servidor
                setMensaje({ respuesta: error.response?.data?.message || "Error al actualizar el usuario", tipo: false });
    
                // Limpiar el mensaje de error después de 3 segundos
                setTimeout(() => {
                    setMensaje(null);
                }, 4000);
    
                console.log(error);
            }
        } else {
            try {
                // Construir la URL de la API para el registro
                const URLRegister = `${import.meta.env.VITE_BACKEND_URL}/register`;
                console.log(registro);
    
                // Preparar los datos para el registro, excluyendo la propiedad 'estado'
                const DatosRegistrar = { ...registro };
                delete DatosRegistrar.estado;
    
                // Realizar la petición POST
                const respuesta = await axios.post(URLRegister, DatosRegistrar);
                console.log(respuesta);
    
                // Configurar el mensaje de éxito
                setMensaje({ respuesta: "Usuario registrado con éxito", tipo: true });
                console.log(respuesta)
    
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                    setMensaje(null);
                    // Navegar al historial de usuarios
                    navigate('/historial-usuarios');
                }, 3000);
            } catch (error) {
                // Configurar el mensaje de error recibido desde la respuesta del servidor
                setMensaje({ respuesta: error.response?.data?.message || "Error al registrar el usuario", tipo: false });
    
                // Limpiar el mensaje de error después de 3 segundos
                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
    
                console.log(error);
            }
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
        
        <div className="w-full max-w-7xl px-10">

      {mensaje && (<Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} 
    />
)}


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
            {errores.cedula && <p className="text-red-500 text-sm">{errores.cedula}</p>}
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
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
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
            {errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}
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
            {errores.direccion && <p className="text-red-500 text-sm">{errores.direccion}</p>}
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
            {errores.correo && <p className="text-red-500 text-sm">{errores.correo}</p>}
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
            {errores.cargo && <p className="text-red-500 text-sm">{errores.cargo}</p>}
          </div>

          {/* Contraseña */}
          <div className="mb-4 relative">
            <label className="block font-semibold mb-2">Contraseña</label>
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
              {errores.contrasena && <p className="text-red-500 text-sm">{errores.contrasena}</p>}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 mt-4"
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />} {/* Cambia el ícono */}
            </button>
            
            
          </div>

          {/* Estado (solo visible en actualización) */}
          {usuarios && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estado</label>
              <select
              id='estado'
              name="estado"
              value={registro.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              >
                <option value="">Selecciona una opción</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              {errores.estado && <p className="text-red-500 text-sm">{errores.estado}</p>}
            </div>
          )}

        </form>
        
        <div className="flex justify-end mt-4">
          <button
           
            onClick={handleSubmit}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            GUARDAR
          </button>
        </div>
        
      </div>
      

        
        
    )
}
