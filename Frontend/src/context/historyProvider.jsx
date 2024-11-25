import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { HistoryContext } from './HistoryContext';

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState ([]);
  const [asistencias, setAsistencias] = useState([]);

    // -----------------------------------FUNCIONES PARA USUARIOS--------------------------------------------

  // Función para obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token')
    if (!token )return
    try {
      const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        }
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employees`,options);
      setUsuarios(response.data.empleados); // Suponiendo que la API retorna un array de usuarios
    } catch (error) {
      console.error("Error al obtener usuarios", error);
  };
  
  HistoryProvider.propTypes = {
    children: PropTypes.node.isRequired,
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
                // Realizar la petición POST
                //const respuesta = await axios.put(URLActualizar, registro, options);
                
                //console.log(respuesta)
                try {
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

  // Función para agregar un usuario y actualizar el estado
  const addUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
  };


  // -----------------------------------FUNCIONES PARA CLIENTES--------------------------------------------
  const fetchClientes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vehicles`, options);
      setClientes(response.data); // Suponiendo que la API retorna un array de clientes
    } catch (error) {
      console.error("Error al obtener clientes", error);
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
    } catch (error) {
      console.error("Error al actualizar cliente", error);
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

  

  const addCliente = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}/assistance`, options);
      //setAsistencias(response.data); // Suponiendo que la API retorna un array de asistencias
      return response.data;
    } catch (error) {
      
      console.error("Error al obtener asistencias", error);
    }
  };

  const fetchAsistenciasbycedula = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        };
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}/
          asistencia`, options);
          setAsistencias(response.data); // Suponiendo que la API retorna un array de asistencias
          } catch (error) {
            console.error("Error al obtener asistencias", error);
          }
  }



 
  return (
    <HistoryContext.Provider 
    value={{ 
      usuarios, 
      addUsuario, 
      fetchUsuarioByCedula,
      upDateUser,
      fetchUsuarios,
      clientes,
      addCliente,
      fetchClienteByCedula,
      upDateClient,
      fetchClientes,
      asistencias,
      fetchAsistencias,
      setAsistencias,
      fetchAsistenciasbycedula,
       }}>
      {children}
    </HistoryContext.Provider>
  );
};
