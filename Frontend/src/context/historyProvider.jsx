import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { HistoryContext } from './HistoryContext';

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState ([]);
  const [asistencias, setAsistencias] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState(''); // Tipo de modal: 'registrar' o 'actualizar'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pagos, setPagos] = useState([])

  // -------------------------------- Funciones de control en mensajes de validación --------------------------------
  async function mostrarErrores(errors) {
    for (const error of errors) {
      setErrorMessage(error.msg);
  
      // Mostrar el mensaje de error en la consola
      console.error("Error al registrar pago", error.msg);
  
      // Esperar 5 segundos antes de pasar al siguiente error
      await new Promise((resolve) => setTimeout(resolve, 5000));
  
      // Limpiar el mensaje de error antes de mostrar el siguiente
      setErrorMessage("");
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees`,options);
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
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}`;
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
  
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}`,options);
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`, options);
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
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/client/${cedula}`;
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
  
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles/client/${id}`, options);
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
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/vehicle/${placa}`;
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
    const URLRegistrar = `${import.meta.env.VITE_BACKEND_URL}/client`;
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
      console.error("Error al registrar cliente", error);
      return { success: false, message: error.response.data.message };
    }
  }
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}/assistance`, options);

      return response.data;
    } catch (error) {
      console.error("Error al obtener asistencias", error);
    }
  };

  const upDateAssistance = async (id, asistencia) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/assistance/${id}`;
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
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}/assistance`;
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}/payments`, options);
      
      return(response.data); // Suponiendo que la API retorna un array de pagos
    } catch (error) {
      console.error("Error al obtener pagos", error);
    }
  };

  const upDatePayment = async (id, pago) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/employee/payment/${id}`;
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
        successMessage("Pago actualizado correctamente");
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
    const URLRegistrar = `${import.meta.env.VITE_BACKEND_URL}/employee/${cedula}/payments/`;
    const token = localStorage.getItem("token");
    const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const respuesta = await axios.post(URLRegistrar, pago, options);
        console.log(respuesta);
        successMessage("Pago registrado correctamente");
        //Cerrar el modal automáticamente después de un breve tiempo
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
          handleModal();
          fetchUsuarios();
        }, 2000); // Cierra el modal después de 2 segundos  
      }catch (error) {
        console.error("Error al registrar pago", error);
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
      registerPayment
       }}>
      {children}
    </HistoryContext.Provider>
  );
};

HistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};