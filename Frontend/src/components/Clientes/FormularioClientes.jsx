import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Mensaje from '../Alertas';
import { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryContext.jsx';

export const FormularioClientes = ({clientes}) => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [tecnicos, setTecnicos] = useState([]);
  
  const {
    upDateClient,
    registerClient,
    updateClientVehicle,
    registerVehicle,
    fetchUsuarios,
    asignarVehiculo,
  }=useContext(HistoryContext)
 
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
    fecha_ingreso: '',
    fecha_salida: '',
    cedula_tecnico: '',
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
            fecha_ingreso: clientes?.fecha_ingreso?.split("T")[0] ?? '',
            fecha_salida: clientes?.fecha_salida?.split("T")[0] ?? '',
            cedula_tecnico: clientes?.encargado?.cedula ?? '',
            estado: clientes.estado ?? '',
          });
        }
      }, [clientes]);

      useEffect(() => {
        const filtrarTecnicos = async () => {
          const usuarios = await fetchUsuarios();
          const ltecnicos = usuarios.filter(
              (usuario) => usuario.cargo === "Técnico" && usuario.estado === "Activo"
          );
          setTecnicos(ltecnicos);
        };
        filtrarTecnicos();
      }, []);

      const handleSubmit = async (event) => {
        event.preventDefault();
        //Iniciliza un objeto para los errores
        const nuevosErrores = {};
        
      // Validaciones de cédula
      if (!regisclientes.cedula) {
        nuevosErrores.cedula = "La cédula es obligatoria.";
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
      // Validacion de seleccion del técnico
      if (!regisclientes.cedula_tecnico || regisclientes.cedula_tecnico === "") {
        nuevosErrores.tecnico = "Debes seleccionar un técnico.";
      }

      // Validaciones de fecha de ingreso
      if (!regisclientes.fecha_ingreso) {
        nuevosErrores.fechaIngreso = "La fecha de ingreso es obligatoria.";
      }
   
      // Validaciones de fecha de salida
      if (new Date(regisclientes.fecha_ingreso) > new Date(regisclientes.fecha_salida)) {
        nuevosErrores.fechaSalida = "La fecha de salida debe ser posterior a la fecha de ingreso.";
      }
      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);
        return;
      }

   // Si no hay errores, limpia los errores anteriores y continúa
   setErrores({});

   try {
    const updateinfo = { ...regisclientes };

    const clientInfo = { 
      nombre: updateinfo.nombre,
      telefono: updateinfo.telefono,
      correo: updateinfo.correo,
      direccion: updateinfo.direccion
    };

    const vehicleInfo = {
      n_orden: updateinfo.orden,
      marca: updateinfo.marca,
      modelo: updateinfo.modelo,
      placa: updateinfo.placa,
      fecha_ingreso: updateinfo.fecha_ingreso,
      fecha_salida: updateinfo.fecha_salida,
      cedula_tecnico: updateinfo.cedula_tecnico,
      cedula_cliente: "",
      estado: updateinfo.estado
    };
     if (clientes?.propietario.cedula) {
        console.log("Actualizando cliente...");
        console.log(clientes);
        console.log(clientInfo);
        vehicleInfo.cedula_cliente = clientes.propietario.cedula;
        console.log(vehicleInfo);

        // Llamar a la función para actualizar el usuario
        const res1 = await upDateClient(clientes?.propietario.cedula, clientInfo);
        if (res1.success){
          setMensaje({ respuesta: res1.message, tipo: true });
        }else{
          setMensaje({ respuesta: res1.message, tipo: false });
        }

        const res2 = await updateClientVehicle(clientes.placa, vehicleInfo);
        if (res2.success){
          setMensaje({ respuesta: res2.message, tipo: true });
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        }else{
          setMensaje({ respuesta: res2.message, tipo: false });
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        }
        let res3 = {
          success: true,
        };
        console.log("Actualizacion tecnico encargado ->", clientes)
        // Comprobar si se selecciono un nuevo tecnico
        if (clientes?.encargado?.cedula !== regisclientes.cedula_tecnico) {
          res3 = await asignarVehiculo({placa: vehicleInfo.placa, cedula_tecnico: vehicleInfo.cedula_tecnico});
          if (res3.success){
            setMensaje({ respuesta: res3.message, tipo: true });
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
              setMensaje(null);
            }, 3000);
        }else{
          setMensaje({ respuesta: res3.message, tipo: false });
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        }
      }

      if (res1.success && res2.success && res3.success) {
        // Limpiar los campos del formulario
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
          fecha_ingreso: '',
          fecha_salida: '',
          cedula_tecnico: '',
          estado: '',
        });
        // Navegar al historial de usuarios
        navigate('/dashboard/historial-clientes');
      }
    }else {
      // Preparar los datos para el registro, excluyendo la propiedad 'estado'
      clientInfo.cedula = regisclientes.cedula;
      vehicleInfo.cedula_cliente = regisclientes.cedula;
      delete vehicleInfo.estado;
      console.log("Registrando cliente...");
      console.log(clientInfo);
      console.log(vehicleInfo);
          
      const respuesta = await registerClient(clientInfo);
      if (respuesta.success){
        // Configurar el mensaje de éxito
        setMensaje({ respuesta: respuesta.message, tipo: true });
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }else{
        // Configurar el mensaje de error
        setMensaje({ respuesta: respuesta.message, tipo: false });
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }

      const respuesta2 = await registerVehicle(vehicleInfo);
      if (respuesta2.success){
        // Configurar el mensaje de éxito
        setMensaje({ respuesta: respuesta2.message, tipo: true });
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      } else {
        // Configurar el mensaje de error
        setMensaje({ respuesta: respuesta2.message, tipo: false });
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }

      // Comprobar si se seleccionó un técnico diferente
      if (regisclientes.cedula_tecnico) {
        const res3 = await asignarVehiculo({placa: vehicleInfo.placa, cedula_tecnico: vehicleInfo.cedula_tecnico});
        if (res3.success){
          setMensaje({ respuesta: res3.message, tipo: true });
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        } else {
          setMensaje({ respuesta: res3.message, tipo: false });
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        }
      }

      if (respuesta.success && respuesta2.success) {
        // Limpiar los campos del formulario
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
          fecha_ingreso: '',
          fecha_salida: '',
          cedula_tecnico: '',
          estado: '',
        });
        
        // Navegar al historial de usuarios
        navigate('/dashboard/historial-clientes');
      }
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
      const soloNumeros = /^[0-9]*$/; // Expresión regular para permitir solo números

      // Validar entrada solo para los campos "cedula" y "telefono"
    
        // Validación para cédula
        if (name === "cedula") {
          // Permite solo números mientras el valor esté escribiéndose
          if (!soloNumeros.test(value)) {
            return; // Ignora si no tiene solo números
          }

        }
        
        
      // Validación para teléfono
      if (name === "telefono") {
        // Permite solo números para el teléfono
        if (!soloNumeros.test(value)) {
          return; // Ignora si no tiene solo números
        }
      }
    
      // ----------------------------------------------------------
      //Validar entrada solo para el campo "placa"
      if(name === "placa"){

         //Convierte las letras a mayúsculas automáticamente
         const valoMayusculas = value.toUpperCase();

        //Permite solo 3 letras seguidas de 4 números
        const formatoPlaca = /^[A-Z]{0,3}[0-9]{0,4}$/;
        if(!formatoPlaca.test(valoMayusculas)){
          return;//Ignora si no cumple con el formato
        }
       
        setRegisclientes({
          ...regisclientes,
          [name]: value.toUpperCase()
        });
        return;
      }

      // ----------------------------------------------------------
      //Validar entrada solo para el campo "orden"
      if(name === "orden"){ 

        //Convierte las letras a mayúsculas automáticamente
        const valoMayusculas = value.toUpperCase();

        //Permite solo 3 números hasta 5 dígitos
        const formatoOrden = /^[A-Z]{0,2}-?[0-9]{0,4}$/;
        if(!formatoOrden.test(valoMayusculas)){
          return;//Ignora si no cumple con el formato
        }
      }

      //Actualiza el estado
      setRegisclientes({
        ...regisclientes,
        [name]: value
      }) 
     };
    //  ----------------------------------------------------------
    return (
      <div className="w-full max-w-7xl px-10">
      {/* {mensaje && <Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} />} */}
      {mensaje && (<Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} 
      />
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 border-2 border-red-600 p-6 rounded-lg bg-black mb-7">
          
          {/* Cédula */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cédula/RUC 🪪</label>
            <input
              id='cedula'
              type="texto"
              maxLength="13"
              required= {clientes?.propietario.cedula ? false : true}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='1234567890'
              name="cedula"
              value={regisclientes.cedula}
              disabled={clientes?.propietario.cedula ? true : false}
              onChange={handleChange}
            />
            {errores.cedula && <p className="text-red-500 text-sm">{errores.cedula}</p>}
          </div>
          
          {/* Nombre y Apellido */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nombre y Apellido🦸</label>
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
            <label className="block font-semibold mb-2">Teléfono📲</label>
            <input
              id='telefono'
              type="text"
              name="telefono"
              maxLength="10"
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
            <label className="block font-semibold mb-2">Correo 📧</label>
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
            <label className="block font-semibold mb-2">Dirección🏠</label>
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
            <label className="block font-semibold mb-2">N° Orden 🅾️</label>
            <input
              id='orden'
              type="text"
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

          {/* Modelo */}
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

          {/* Placa*/}
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
            <label className="block font-semibold mb-2">Fecha de Ingreso🗓️</label>
            <input
              id='fecha_ingreso'
              type="date"
              name="fecha_ingreso"
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
            <label className="block font-semibold mb-2">Fecha Salida📅</label>
            <input
              id='fecha_salida'
              type="date"
              name="fecha_salida"
              value={regisclientes.fecha_salida}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              placeholder='Fecha de Salida'
            />
            {errores.fecha_salida && <p className="text-red-500 text-sm">{errores.fecha_salida}</p>}
          </div>

          {/* Descripcion */}
          {/* <div className="mb-4">
            <label className="block font-semibold mb-2">Descripción de Mantenimiento ⚙️</label>
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
          </div> */}


          {/* Tecnico Responsable */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Técnico Responsable 👤</label>
            <select
              id='cedula_tecnico'
              name="cedula_tecnico"
              value={regisclientes.cedula_tecnico}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
              <option value="">Selecciona un técnico</option>
              {tecnicos && tecnicos.map((tecnico) => (
                <option key={tecnico.cedula} value={tecnico.cedula}>
                  {tecnico.nombre}
                </option>
              ))}
            </select>
            {errores.tecnico && <p className="text-red-500 text-sm">{errores.tecnico}</p>}
          </div>

          {/* Estado (solo visible en actualización) */}
          {clientes && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Estado del vehículo</label>
              <select
              id='estado'
              name="estado"
              value={regisclientes.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
              >
                <option value="">Selecciona una opción</option>
                <option value="Pendiente">🟠Pendiente</option>
                <option value="En Proceso">🔵En Proceso</option>
                <option value="Finalizado">🟡Finalizado</option>
                <option value="Entregado">🟢 Entregado</option>
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
    fecha_ingreso: PropTypes.string,
    fecha_salida: PropTypes.string,
    detalles: PropTypes.string,
    encargado: PropTypes.shape({
      cedula: PropTypes.string,
    }),
    estado: PropTypes.string,
    some: PropTypes.func,
  }),
};