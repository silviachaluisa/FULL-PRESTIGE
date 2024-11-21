import { useState } from 'react';
import axios from 'axios';
import { HistoryContext } from './HistoryContext';

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState ([]);

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
    }
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
      
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado
        return response.data[0];
      } else {
        // Si no se encuentra el cliente, retornar null
        return null;
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);
      return null; // En caso de error, retornar null
    }
  };

  // const fetchUsuariosByCedula= async(id)=>{
  //   const token = localStorage.getItem('token')
  //   if (!token )return
  //   try {
  //     const options={
  //       headers:{
  //         'Content-Type': 'application/json',
  //         Authorization:`Bearer ${token}`,
  //       },
  //     };
    
  
  //     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}`,options);
  //     console.log(response)
  //     setUsuarios(response.data.empleado); // Suponiendo que la API retorna un array de usuarios
  //   } catch (error) {
  //     console.error("Error al obtener usuarios", error);
      
  //   }

  // };


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
      
      if (response.data && response.data.length > 0) {
        // Retorna el primer cliente encontrado
        return response.data[0];
      } else {
        // Si no se encuentra el cliente, retornar null
        return null;
      }
    } catch (error) {
      console.error("Error al obtener cliente", error);
      return null; // En caso de error, retornar null
    }
  };

  // -------------------------------------------------------------------------------
  

  const addCliente = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
  };
 
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
       }}>
      {children}
    </HistoryContext.Provider>
  );
};
