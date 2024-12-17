import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import logo from '../assets/imagenes/logo.jpg';
import Mensaje from '../components/Alertas';
import CambiarContraseña from '../components/Modals/CambiarContraseña';

const EditarPerfil = () => {
  const { auth, actualizarPerfil, message} = useContext(AuthContext);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [perfil, setPerfil] = useState({

    cedula: '',
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    cargo: '',
    estado: 'Activo'
  });
  const [showModal, setShowModal] = useState(false); //Estado para controlar la visibilidad del modal
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }

    setPerfil({
      cedula: auth?.cedula || '',
      nombre: auth?.nombre || '',
      telefono: auth?.telefono || '',
      correo: auth?.correo || '',
      direccion: auth?.direccion || '',
      cargo: auth?.cargo || '',
      estado: auth?.estado || 'Activo'
    });
  }, [auth]);

  const toggleModal = () => {setShowModal(!showModal)}; //Manejador para abrir y cerrar el modal

  // Manejador de cambios en el formulario
  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar los cambios del perfil
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updateProfile = {
        ...perfil,
        estado: perfil.estado === 'Activo' ? true : false
      }

      // Validar si el usuario se cambio el cargo
      if (updateProfile.cargo === auth.cargo) {
        delete updateProfile.cargo;
      }

      const response = await actualizarPerfil(updateProfile);
      setMensaje({ respuesta: response.respuesta, tipo: response.tipo });
      setTimeout(() => {
        setMensaje("");
        // Redirigir al dashboard si la actualización fue exitosa
        if (response.tipo) navigate('/dashboard');
      }, 5000);
    } catch (error) {
      setMensaje({ respuesta: error.message, tipo: false });
      console.error("Error al actualizar el perfil:", error);
    } finally {
      setTimeout(() => {
        setMensaje("");
      }, 5000);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        <button
          onClick={() => navigate('/Dashboard')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>

      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
        MI PERFIL
      </h2>

      <div className="w-full max-w-3xl px-10 py-6 border-2 border-red-600 rounded-lg bg-black text-white">
        <div className='mb-4'>    
          {mensaje && (<Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} 
          />
        )}
      </div>
         

        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          {/* Otros campos del formulario */}
          <div>
            <label className="block font-semibold mb-2">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={perfil.cedula}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              disabled
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={perfil.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Correo</label>
            <input
              type="email"
              name="correo"
              value={perfil.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={perfil.direccion}
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
              value={perfil.cargo}
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

          <div>
            <label className="block font-semibold mb-2">Estado</label>
            <select
              name="estado"
              value={perfil.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800"
            >
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
        {/* Boton para cambiar la contraseña */}
        <div className="text-left">
          <button
            onClick={() => setShowModal(true)} // Actualiza el estado para mostrar el modal
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-red-800"
          >
            Cambiar Contraseña
          </button>
      </div>
    </div>
    {/* Modal para cambiar la contraseña */}
    {showModal && <CambiarContraseña onClose={() => setShowModal(false)} />}
  </div>
  );
};

export default EditarPerfil;
