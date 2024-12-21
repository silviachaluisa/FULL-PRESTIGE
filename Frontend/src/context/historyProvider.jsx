import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { HistoryContext } from './HistoryContext';

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState ([]);
  const [asistencias, setAsistencias] = useState([]);
  const [pagos, setPagos] = useState([])
  const [mantenimientos, setMantenimientos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState(''); // Tipo de modal: 'registrar' o 'actualizar'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contrasenas, setContrasenas] = useState([]);

  // -------------------------------- Funciones de control en mensajes de validación --------------------------------
  async function mostrarErrores(errors) {
    for (const error of errors) {
      setErrorMessage(error.msg);
  
      // Mostrar el mensaje de error en la consola
      console.error("Error: ", error.msg);
  
      // Esperar 5 segundos antes de pasar al siguiente error
      await new Promise((resolve) => setTimeout(resolve, 5000));
  
      // Limpiar el mensaje de error antes de mostrar el siguiente
      setErrorMessage("");
    }
  }

  async function retornarErrores(errors){
    for (const error of errors) {
      new Promise((resolve) => setTimeout(resolve, 5000));
      console.error("Error: ", error.msg);
      return error.msg;
    }
  }

  // -------------------------------- Modal --------------------------------
  const handleModal = () => {
    setShowModal(!showModal);
  };

    // -----------------------------------FUNCIONES PARA USUARIOS--------------------------------------------

  // Función para obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token')
    if (!token )return
    try {
      setLoading(true); // Activar el estado de carga
      const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        }
      }

      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/employees`,options);
      console.log("Respuesta fetch usuarios ->",response.data)
      setUsuarios(response.data.empleados); // Suponiendo que la API retorna un array de usuarios
      return response.data.empleados;
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      return null;
    } finally {
      setLoading(false); // Desactivar el estado de carga
    };
  };

  const upDateUser=async(cedula,registro)=>{
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/employee/${cedula}`;
    const token=localStorage.getItem("token")
    const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        }
      }
    try {
      // Enviar la solicitud PUT al backend
      const respuesta = await axios.put(URLActualizar, registro, options);
      console.log(respuesta);
    } catch (error) {
      console.error("Error al actualizar usuario", error);
    }
  };

  const fetchUsuarioByCedula = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return null; // Asegurarse de que si no hay token, no haga la búsqueda
  
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/employee/${id}`,options);
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado

        setUsuarios(response.data) // 
        return true
      } else {
        return null
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);
      // Si no se encuentra el cliente, retornar null
      setUsuarios([])
      setTimeout(async ()=>{await fetchUsuarios()} ,3000) //Para eliminar la vista de tabla cuando el usuario no es encontrado
      return null; // En caso de error, retornar null
    }
  };
  // -----------------------------------FUNCIONES PARA CLIENTES--------------------------------------------
  const fetchClientes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true); // Activar el estado de carga
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/vehicles`, options);
      setClientes(response.data); // Suponiendo que la API retorna un array de clientes
      console.log("Clientes ->",response.data)
    } catch (error) {
      console.error("Error al obtener clientes", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };
  // -------------------------------------------------------------------------------------
  const upDateClient = async (cedula, regisclientes) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/client/${cedula}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, regisclientes, options);
      console.log(respuesta);
      return { success: true, message: "Cliente actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar cliente", error);
      return { success: false, message: error.response.data.message };
    }
  };
  // -----------------------------------------------------------------
  const fetchClienteByCedula = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) return null; // Asegurarse de que si no hay token, no haga la búsqueda
  
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/vehicles/client/${id}`, options);
      console.log(response.data)
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado
        setClientes(response.data)//Filtrando todos los usuarios
        return true
      } else {
        // Si no se encuentra el cliente, retornar null
        return null;
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);

      setClientes([])
      setTimeout(async ()=>{await fetchClientes()} ,3000)
      return null; // En caso de error, retornar null
    }
  };

  // -------------------------------------------------------------------------------
  const updateClientVehicle = async (placa, updateForm) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/vehicle/${placa}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, updateForm, options);
      console.log(respuesta);
      return { success: true, message: "Vehículo actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar vehículo", error);
      return { success: false, message: error.response.data.message };
    }
  };

  const registerClient = async (formRegistro) => {
    const URLRegistrar = `${process.env.VITE_BACKEND_URL}/client`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.post(URLRegistrar, formRegistro, options);
      console.log(respuesta);

      return { success: true, message: "Cliente registrado correctamente" };
    } catch (error) {
      console.error("Error al actualizar asistencia", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        return { success: false, message: error.response.data.errors[0] };
      } else {
        return { success: false, message: error.response.data.message };
      }
    }
  }

  const registerVehicle = async (formRegistro) => {
    const URLRegistrar = `${process.env.VITE_BACKEND_URL}/vehicle`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.post(URLRegistrar, formRegistro, options);
      console.log(respuesta);

      return { success: true, message: "Vehículo registrado correctamente" };
    } catch (error) {
      console.error("Error al registrar vehículo", error);
      console.error("Error al actualizar asistencia", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
        return { success: false, message: error.response.data.errors[0] };
      } else {
        return { success: false, message: error.response.data.message };
      }
    }
  };

  const asignarVehiculo = async (payload) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
      }

      const URLAsignar = `${process.env.VITE_BACKEND_URL}/vehicle/assign`;
      await axios.post(URLAsignar, payload, options);
      return { success: true, message: "Vehículo asignado correctamente" };
    } catch (error) {
      console.error("Error al asignar vehículo", error);
      return { success: false, message: error.response.data };
    }
  };

   // -----------------------------------FUNCIONES PARA ASISTENCIAS--------------------------------------------

   const fetchAsistencias = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/employee/${id}/assistance`, options);

      return response.data;
    } catch (error) {
      console.error("Error al obtener asistencias", error);
    }
  };

  const upDateAssistance = async (id, asistencia) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/employee/assistance/${id}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, asistencia, options);
      console.log(respuesta);
      setSuccessMessage("Asistencia actualizada correctamente");
      // Cerrar el modal automáticamente después de un breve tiempo
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        handleModal();
        fetchUsuarios();
      }, 2000); // Cierra el modal después de 2 segundos
    } catch (error) {
      console.error("Error al actualizar asistencia", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
      } else {
        setErrorMessage(error.response.data.message);
    
        // Limpiar el mensaje de error después de un breve tiempo
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 5000);
      }
    }
  };

  const registerAssistance = async (cedula, asistencia) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/employee/${cedula}/assistance`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.post(URLActualizar, asistencia, options);
      console.log(respuesta);
      setSuccessMessage("Asistencia registrada correctamente");
      // Cerrar el modal automáticamente después de un breve tiempo
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        handleModal();
        fetchUsuarios();
      }, 2000); // Cierra el modal después de 2 segundos
    } catch (error) {
      console.error("Error al actualizar asistencia", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
      } else {
        setErrorMessage(error.response.data.message);
    
        // Limpiar el mensaje de error después de un breve tiempo
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 5000);
      }
    }
  };

  // -------------------------------FUNCIONES PARA PAGOS-----------------------------------------

  const fetchPagos = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/employee/${id}/payments`, options);
      
      return(response.data); // Suponiendo que la API retorna un array de pagos
    } catch (error) {
      console.error("Error al obtener pagos", error);
    }
  };

  const upDatePayment = async (id, pago) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/employee/payment/${id}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    
      try {
        const respuesta = await axios.put(URLActualizar, pago, options);
        console.log(respuesta);
        setSuccessMessage("Pago actualizado correctamente");
        //Cerrar el modal automáticamente después de un breve tiempo
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
          handleModal();
          fetchUsuarios();
        }, 2000); // Cierra el modal después de 2 segundos
      }catch (error) {
        console.error("Error al actualizar pago", error);
        if (error.response.data?.errors && error.response.data.errors.length > 0) {
          // Mostrar errores de validación uno por uno
          await mostrarErrores(error.response.data.errors);
        } else {
          setErrorMessage(error.response.data.message);
      
          // Limpiar el mensaje de error después de un breve tiempo
          setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
          }, 5000);
        }
      }
  };

  const registerPayment = async (cedula, pago) => {
    const URLRegistrar = `${process.env.VITE_BACKEND_URL}/employee/${cedula}/payments/`;
    const token = localStorage.getItem("token");
    const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("URLRegistrar:", URLRegistrar);
      console.log("Payload enviando", pago);

      try {
        const respuesta = await axios.post(URLRegistrar, pago, options);
        console.log(respuesta);
        setSuccessMessage("Pago registrado correctamente");

        //Cerrar el modal automáticamente después de un breve tiempo
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
          handleModal();
          fetchUsuarios();
        }, 2000); // Cierra el modal después de 2 segundos  
      }catch (error) {
        console.error("Error al registrar pago", error);
        if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          // Mostrar errores de validación uno por uno
          await mostrarErrores(error.response.data.errors);
        } else {
          setErrorMessage(error.response?.data.message || "Error al registrar pago");
          // Limpiar el mensaje de error después de un breve tiempo
          setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
          }, 5000);
        }
      }
    };

    // -------------------------------FUNCIONES PARA HISTORIAL DE MANTENIMIENTOS-----------------------------------------
  const fetchMantenimientos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true); // Activar el estado de carga
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/maintenances`, options);
      setMantenimientos(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mantenimientos", error);
      setMantenimientos([]);
    } finally {
      setLoading(false); // Establecer la carga en falso
    }
  }

  const fetchMantenimientosByPlaca = async (placa) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true); // Activar el estado de carga
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/maintenance/vehicle/${placa}`, options);
      //Para busqueda de una placa que no ha sido asiganada al tecnico
      if (response.data.length === 0) {
        setTimeout(async ()=>{await fetchMantenimientos()} ,3000)//Para que los datos de la tabla regresen despues de no encontrar el vehiculo}

      }
      setMantenimientos(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mantenimientos", error);
      setMantenimientos([]);
      //Para busqueda de una placa que no existe
      setTimeout(async ()=>{await fetchMantenimientos()} ,3000)//Para que los datos de la tabla regresen despues de no encontrar el vehiculo
      return []; //Para que retorne un objeto vacio
    } finally {
      setLoading(false); // Establecer la carga en falso
    }
  }

  const fetchMantenimientosByID = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true); // Activar el estado de carga
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/maintenance/${id}`, options);
      setMantenimientos(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mantenimientos", error);
      setMantenimientos([]);
    } finally {
      setLoading(false); // Establecer la carga en falso
    }
  };

  const fetchMantenimientosByEmpleado = async (cedula) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true); // Activar el estado de carga
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${process.env.VITE_BACKEND_URL}/maintenance/employee/${cedula}`, options);
      setMantenimientos(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mantenimientos", error);
      setMantenimientos([]);
      return [];
    } finally {
      setLoading(false); // Establecer la carga en falso
    }
  };

  const upDateMaintance = async (id, mantenimiento) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/maintenance/${id}`;
    const token = localStorage.getItem("token");
    const options = {
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const respuesta = await axios.put(URLActualizar, mantenimiento, options);
      console.log(respuesta);
      setSuccessMessage("Mantenimiento actualizado correctamente");
      //Cerrar el modal automáticamente después de un breve tiempo
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        handleModal();
        fetchMantenimientos();
        // Actualizar el valor de seleccionado con el nuevo registro
        setSeleccionado(mantenimiento);
      }, 2000); // Cierra el modal después de 2 segundos
    }catch (error) {
      console.error("Error al actualizar mantenimiento", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
      } else {
        setErrorMessage(error.response.data.message);
    
        // Limpiar el mensaje de error después de un breve tiempo
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 5000);
      }
    }
  };

  const registerMaintance = async (id, infoMantenimiento) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/maintenance/register/${id}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try{
      const respuesta = await axios.post(URLActualizar, infoMantenimiento, options);
      console.log(respuesta);
      setSuccessMessage("Mantenimiento registrado correctamente");
      //Cerrar el modal automáticamente después de un breve tiempo
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        handleModal();
        fetchMantenimientos();
        // Actualizar el valor de seleccionado con el nuevo registro
        setSeleccionado(infoMantenimiento);
      }, 2000); // Cierra el modal después de 2 segundos
      return { success: true, message: "Mantenimiento registrado correctamente" };
    } catch (error) {
      console.error("Error al registrar mantenimiento", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
      } else {
        setErrorMessage(error.response.data.message);
    
        // Limpiar el mensaje de error después de un breve tiempo
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 5000);
      }
      return { success: false, message: error.response.data.message
    };
  };
  };

  const requestUpdateMaintenance = async (id, infoMantenimiento) => {
    const URLActualizar = `${process.env.VITE_BACKEND_URL}/maintenance/request/${id}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try{
      const respuesta = await axios.put(URLActualizar, infoMantenimiento, options);
      console.log(respuesta);
      setSuccessMessage("Solicitud enviada correctamente");
      //Cerrar el modal automáticamente después de un breve tiempo
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        handleModal();
        fetchMantenimientos();
      }, 2000); // Cierra el modal después de 2 segundos
      return { success: true, message: "Mantenimiento actualizado correctamente" };
    } catch (error) {
      console.error("Error al solicitar la actualizacion", error);
      if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Mostrar errores de validación uno por uno
        await mostrarErrores(error.response.data.errors);
      } else {
        setErrorMessage(error.response.data.message);
    
        // Limpiar el mensaje de error después de un breve tiempo
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
        }, 5000);
      }
      return { success: false, message: error.response.data.message
    };
  };
  }; 

  // -----------------FUNCION PARA CAMBIAR CONTRASEÑA-----------------------------------
  const changePassword = async (cedula, password, newPassword, confirmPassword) => {
    const token = localStorage.getItem("token");

    const URLActualizar = `${process.env.VITE_BACKEND_URL}/profile/update-password`;
    try {
      const respuesta = await axios.put(URLActualizar, { 
          contrasena: password,
          nuevaContrasena: newPassword,
          confirmarContrasena: confirmPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(respuesta);
      return { success: true, message: "Contraseña actualizada correctamente" };
    }catch (error) {
      console.error("Error al actualizar contraseña", error);
      return { success: false, message: error.response.data.message };
    }
  };
  

  return (
    <HistoryContext.Provider 
    value={{ 
      usuarios, 
      fetchUsuarioByCedula,
      upDateUser,
      fetchUsuarios,
      clientes,
      fetchClienteByCedula,
      registerClient,
      registerVehicle,
      asignarVehiculo,
      upDateClient,
      updateClientVehicle,
      fetchClientes,
      asistencias,
      setAsistencias,
      fetchAsistencias,
      upDateAssistance,
      registerAssistance,
      seleccionado,
      setSeleccionado,
      loading,
      showModal,
      handleModal,
      tipoModal,
      setTipoModal,
      errorMessage,
      setErrorMessage,
      successMessage,
      setSuccessMessage,
      pagos,
      setPagos,
      fetchPagos,
      upDatePayment,
      registerPayment,
      mantenimientos,
      setMantenimientos,
      fetchMantenimientos,
      fetchMantenimientosByEmpleado,
      fetchMantenimientosByPlaca,
      fetchMantenimientosByID,
      upDateMaintance,
      registerMaintance,
      requestUpdateMaintenance,
      contrasenas,
      setContrasenas,
      changePassword,
       }}>
      {children}
    </HistoryContext.Provider>
  );
};

HistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};