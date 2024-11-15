import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/imagenes/logo.jpg';
import Mensaje from '../components/Alertas';

const EditarPerfil = () => {
  const [perfil, setPerfil] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    cargo: '',
    estado: ''
  });
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  // Obtener el perfil del usuario al cargar el componente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/perfil');
          return;
        }
        const respuesta = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPerfil(respuesta.data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        navigate('/perfil');
      }
    };
    fetchPerfil();
  }, [navigate]);

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
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/perfil`, 
        perfil, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje({ respuesta: "Perfil actualizado exitosamente", tipo: true });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({ respuesta: "Error al actualizar el perfil", tipo: false });
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>

      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
        MI PERFIL
      </h2>

      <div className="w-full max-w-3xl px-10 py-6 border-2 border-red-600 rounded-lg bg-black text-white">
        {mensaje && <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} />}

        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={perfil.cedula}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              required
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
      </div>
    </div>
  );
};

export default EditarPerfil;
