import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect} from 'react';
import Mensaje from '../Alertas';
import { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryContext.jsx';


export const FormularioClientes = ({clientes}) => {

  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({}); 
  const {upDateClient,fetchClientes}=useContext(HistoryContext)
 

  const [regisclientes, setRegisclientes] = useState({
        cedula: '',
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        orden: '',
        marca: '',
        modelo: '',
        placa: '',
        fechaIngreso: '',
        fechaSalida: '',
        descripcion: '',
        tecnico: '',
        estado: '',
      });
      // Sincronizar los valores cuando cambia `usuarios`
      useEffect(() => {
        if (clientes) {
          setRegisclientes({
            cedula: clientes.propietario.cedula ?? '',
            nombre: clientes.propietario.nombre ?? '',
            telefono: clientes.propietario.telefono ?? '',
            correo: clientes.propietario.correo ?? '',
            direccion: clientes.propietario.direccion ??'',
            orden: clientes.n_orden ??'',
            marca:clientes.marca ?? '',
            modelo: clientes.modelo ?? '',
            placa: clientes.placa ?? '',
            fechaIngreso: clientes.fechaIngreso ?? '',
            fechaSalida: clientes.fechaSalida ?? '',
            descripcion: clientes.detalles ?? '',
            tecnico: clientes.encargado.nombre ?? '',
            //estado: clientes.estado ?? '',
            estado: (clientes.estado ? "Entregado": "Pendiente") ?? '',
          });
        } else {
          // Limpia los campos si no hay datos de usuario
          setRegisclientes({
            cedula: '',
            nombre: '',
            telefono: '',
            correo: '',
            direccion: '',
            orden: '',
            marca: '',
            modelo: '',
            placa: '',
            fechaIngreso: '',
            fechaSalida: '',
            descripcion: '',
            tecnico: '',
            estado: '',
          });
        }
      }, [clientes]);
      const handleSubmit = async (event) => {
        event.preventDefault();

        //Iniciliza un objeto para los errores
        const nuevosErrores = {};

            // Validaciones de cada campo
        if (!regisclientes.cedula) nuevosErrores.cedula = "La cédula es obligatoria.";
        if (!regisclientes.nombre) nuevosErrores.nombre = "El nombre es obligatorio.";
        if (!regisclientes.telefono) nuevosErrores.telefono = "El nombre es obligatorio.";
        if (!regisclientes.correo) nuevosErrores.correo = "El correo es obligatorio.";
        if (!regisclientes.direccion) nuevosErrores.direccion = "El correo es obligatorio.";
        if (!regisclientes.orden) nuevosErrores.orden = "El N° de orden es obligatoria.";
        if (!regisclientes.marca) nuevosErrores.marca = "La marca es obligatoria.";
        if (!regisclientes.modelo) nuevosErrores.modelo = "El modelo es obligatorio.";
        if (!regisclientes.placa) nuevosErrores.placa= "La placa es obligatorio.";
        if (!regisclientes.fechaIngreso) nuevosErrores.fechaIngreso= "La fecha de ingreso es obligatorio.";
        if (!regisclientes.fechaSalida) nuevosErrores.fechaSalida = "La fecha de salida es obligatorio.";
        if (!regisclientes.descripcion) nuevosErrores.descripcion = "La descripcion del mantenimiento es obligatoria.";
        if (!regisclientes.tecnico) nuevosErrores.tecnico = "El tecnico responsable es obligatorio.";
       

            // Si hay errores, actualiza el estado de errores y detén el proceso
        if (Object.keys(nuevosErrores).length > 0) {
          setErrores(nuevosErrores);
          return;
      }

        // Si no hay errores, limpia los errores anteriores y continúa
        setErrores({});

        if (clientes?.cedula) {
            try {
                const updateinfo = { ...regisclientes };
                delete updateinfo.estado
                updateinfo.estado = regisclientes?.estado === "Activo" ? true : false;
                console.log(updateinfo)
    
                // Llamar a la función para actualizar el usuario
                await upDateClient(regisclientes?.cedula, updateinfo);
    
                // Configurar el mensaje de éxito
                setMensaje({ respuesta: "Usuario actualizado con éxito", tipo: true });
    
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                  fetchClientes()
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
                const URLRegister = `${import.meta.env.VITE_BACKEND_URL}/client`;
                console.log(regisclientes);
    
                // Preparar los datos para el registro, excluyendo la propiedad 'estado'
                const DatosRegistrar = { ...regisclientes};
                delete DatosRegistrar.estado;
    
                // Realizar la petición POST
                const respuesta = await axios.post(URLRegister, DatosRegistrar);
                console.log(respuesta);
    
                // Configurar el mensaje de éxito
                setMensaje({ respuesta: "Cliente registrado con éxito", tipo: true });
                console.log(respuesta)
    
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => {
                    setMensaje(null);
                    // Navegar al historial de usuarios
                    navigate('/historial-clientes');
                }, 3000);
            } catch (error) {
                // Configurar el mensaje de error recibido desde la respuesta del servidor
                setMensaje({ respuesta: error.response?.data?.message || "Error al registrar el cliente", tipo: false });
    
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
    setRegisclientes({
      ...regisclientes,
      [e.target.name]: e.target.value,
    });
  };

    return (
        
        <div className="w-full max-w-7xl px-10">
      {/* {mensaje && <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} />} */}
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
              value={regisclientes.cedula}
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
              value={regisclientes.nombre}
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
              value={regisclientes.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='099999999 o 0222222'
            />
            {errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}
          </div>

          {/* Correo*/}
          <div>
            <label className="block font-semibold mb-2">Correo</label>
            <input
            id='correo'
              type="email"
              name="correo"
              value={regisclientes.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Correo'
              required
            />
            {errores.correo && <p className="text-red-500 text-sm">{errores.correo}</p>}
          </div>
          
          {/* Direccion */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Dirección</label>
            <input
              id='direccion'
              type="texto"
              name="direccion"
              value={regisclientes.direccion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Direccion'
              autoComplete="off" // Aquí se desactiva la auto-completación para este campo
            />
            {errores.direccion && <p className="text-red-500 text-sm">{errores.direccion}</p>}
          </div>

          {/* N Orden*/}
          <div className="mb-4">
            <label className="block font-semibold mb-2">N° Orden</label>
            <input
              id='orden'
              type="number"
              name="orden"
              value={regisclientes.orden}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='564'
              
            />
            {errores.direccion && <p className="text-red-500 text-sm">{errores.direccion}</p>}
          </div>

          {/* Marca */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Marca</label>
            <input
              id='marca'
              type="texto"
              name="marca"
              value={regisclientes.marca}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Marca'
              autoComplete="off" // Aquí se desactiva la auto-completación para este campo
            />
            {errores.marca && <p className="text-red-500 text-sm">{errores.marca}</p>}
          </div>

          {/* Direccion */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Modelo</label>
            <input
              id='modelo'
              type="texto"
              name="modelo"
              value={regisclientes.modelo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Modelo' 
            />
            {errores.modelo && <p className="text-red-500 text-sm">{errores.modelo}</p>}
          </div>

          {/* Direccion */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Placa</label>
            <input
              id='placa'
              type="texto"
              name="placa"
              value={regisclientes.placa}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='PGU765'
            />
            {errores.placa && <p className="text-red-500 text-sm">{errores.placa}</p>}
          </div>
          {/* Fecha de Ingreso*/}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha ingreso</label>
            <input
              id='fingreso'
              type="date"
              name="fingreso"
              value={regisclientes.fechaIngreso}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Fecha de Ingreso'
            
            />
            {errores.fechaIngreso && <p className="text-red-500 text-sm">{errores.fechaIngreso}</p>}
          </div>

          {/* Fecha de Salida */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha Salida</label>
            <input
              id='fsalida'
              type="date"
              name="fsalida"
              value={regisclientes.fechaSalida}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Fecha de Salida'
            />
            {errores.fechaSalida && <p className="text-red-500 text-sm">{errores.fechaSalida}</p>}
          </div>

          {/* Descripcion */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Descripción de Mantenimiento</label>
            <input
              id='descripcion'
              type="texto"
              name="descripcion"
              value={regisclientes.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Detalle el mantenimiento a realizar'
            />
            {errores.descripcion && <p className="text-red-500 text-sm">{errores.descripcion}</p>}
          </div>


          {/* Tecnico Responsable */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Técnico Responsable</label>
            <input
              id='tecnico'
              type="texto"
              name="tecnico"
              value={regisclientes.tecnico}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Nombre del técnico'
              autoComplete="off" // Aquí se desactiva la auto-completación para este campo
            />
            {errores.tecnico && <p className="text-red-500 text-sm">{errores.tecnico}</p>}
          </div>


          {/* Estado (solo visible en actualización) */}
          {clientes && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estado</label>
              <select
              id='estado'
              name="estado"
              value={regisclientes.estado}
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
