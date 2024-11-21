import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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

          FormularioClientes.propTypes = {
          clientes: PropTypes.shape({
            propietario: PropTypes.shape({
            cedula: PropTypes.string,
            nombre: PropTypes.string,
            telefono: PropTypes.string,
            correo: PropTypes.string,
            direccion: PropTypes.string,
            }),
            cedula: PropTypes.string,
            n_orden: PropTypes.string,
            marca: PropTypes.string,
            modelo: PropTypes.string,
            placa: PropTypes.string,
            fechaIngreso: PropTypes.string,
            fechaSalida: PropTypes.string,
            detalles: PropTypes.string,
            encargado: PropTypes.shape({
            nombre: PropTypes.string,
            }),
            estado: PropTypes.bool,
            some: PropTypes.func,
          }),
          };
      const handleSubmit = async (event) => {
        event.preventDefault();
        

        //Iniciliza un objeto para los errores
        const nuevosErrores = {};
        

      // Validaciones de cédula
      if (!regisclientes.cedula) {
        nuevosErrores.cedula = "La cédula es obligatoria.";
      } else if (regisclientes.cedula.length !== 10) {
        nuevosErrores.cedula = "La cédula debe tener 10 dígitos.";
      } else if (clientes && clientes.some((user) => user.cedula === regisclientes.cedula)) {
        nuevosErrores.cedula = "La cédula ya está registrada.";
      }

      // Validaciones de nombre
      if (!regisclientes.nombre) {
        nuevosErrores.nombre = "El nombre es obligatorio.";
      }

      // Validaciones de teléfono
      if (!regisclientes.telefono) {
        nuevosErrores.telefono = "El teléfono es obligatorio.";
      }

      // Validaciones de correo
      if (!regisclientes.correo) {
        nuevosErrores.correo = "El correo electrónico es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(regisclientes.correo)) {
        nuevosErrores.correo = "El correo electrónico debe tener un @.";
      } else if (clientes && clientes.some((user) => user.correo === regisclientes.correo)) {
        nuevosErrores.correo = "El correo ya está registrado.";
      }

      //Validacion para la direción
      if (!regisclientes.direccion) {
        nuevosErrores.direccion = "La dirección es obligatoria";
      } else if (regisclientes.direccion.length < 5 || regisclientes.direccion.length > 20) {
        nuevosErrores.direccion = "La dirección debe tener entre 5 y 20 caracteres";
      }
      // Validaciones de orden
      if (!regisclientes.orden) {
        nuevosErrores.orden = "El N° de orden es obligatorio.";
      }

      // Validaciones de marca
      if (!regisclientes.marca) {
        nuevosErrores.marca = "La marca es obligatoria.";
      }

      // Validaciones de modelo
      if (!regisclientes.modelo) {
        nuevosErrores.modelo = "El modelo es obligatorio.";
      }

      // Validaciones de placa
      if (!regisclientes.placa) {
        nuevosErrores.placa = "La placa es obligatoria.";
      }

   
    // Validaciones de fecha de salida
    if (new Date(regisclientes.fechaIngreso) > new Date(regisclientes.fechaSalida)) {
      nuevosErrores.fechaSalida = "La fecha de salida debe ser posterior a la fecha de ingreso.";
    }
    // Validaciones de descripción
    if (!regisclientes.descripcion) {
      nuevosErrores.descripcion = "La descripción del mantenimiento es obligatoria.";
    }

    // Validaciones de técnico
    if (!regisclientes.tecnico) {
      nuevosErrores.tecnico = "El técnico responsable es obligatorio.";
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
  }

   // Si no hay errores, limpia los errores anteriores y continúa
   setErrores({});

   try {
     if (clientes?.cedula) {
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
   
    }else {
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
  }  
     
  } catch (error) {
     // Configurar el mensaje de error recibido desde la respuesta del servidor
     setMensaje({ respuesta: error.response?.data?.message || "Error al actualizar el usuario", tipo: false });
  
     // Limpiar el mensaje de error después de 3 segundos
     setTimeout(() => {
         setMensaje(null);
     }, 4000);
  
     console.log(error);
        
   }
  };

     // Manejador de cambio de valores del formulario
     const handleChange = (e) => {
      const {name, value} = e.target;

      //Validar entrada solo para los campos "cedula" y "teléfono"
      if(name=== "cedula" || name === "telefono"){
        const soloNumeros = /^[0-9]*$/; //Expresión regular para permitir solo números
        if(!soloNumeros.test(value)){
          return;//Ignora si se ingresan letras u otros caracteres
        }

      }
      //Actualiza el estado
      setRegisclientes({
        ...regisclientes,
        [name]: value
      })
      
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
            <label className="block font-semibold mb-2">Fecha de Ingreso</label>
            <input
              id='fingreso'
              type="date"
              name="fingreso"
              value={regisclientes.fecha_ingreso}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Fecha de Ingreso'
            
            />
            {errores.fecha_salida && <p className="text-red-500 text-sm">{errores.fecha_salida}</p>}
          </div>

          {/* Fecha de Salida */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha Salida</label>
            <input
              id='fsalida'
              type="date"
              name="fsalida"
              value={regisclientes.fecha_salida}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Fecha de Salida'
            />
            {errores.fecha_salida && <p className="text-red-500 text-sm">{errores.fecha_salida}</p>}
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
