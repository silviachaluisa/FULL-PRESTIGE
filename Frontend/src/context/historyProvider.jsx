import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const HistoryContext = createContext();

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

  
  const fetchUsuariosByCedula= async(id)=>{
    const token = localStorage.getItem('token')
    if (!token )return
    try {
      const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        },
      };
    
  
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}`,options);
      console.log(response)
      setUsuarios(response.data.empleado); // Suponiendo que la API retorna un array de usuarios
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      
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

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients`, options);
      setClientes(response.data.clientes); // Suponiendo que la API retorna un array de clientes
    } catch (error) {
      console.error("Error al obtener clientes", error);
    }
  };

  const upDateClient = async (cedula, registro) => {
    const URLActualizar = `${import.meta.env.VITE_BACKEND_URL}/client/${cedula}`;
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const respuesta = await axios.put(URLActualizar, registro, options);
      console.log(respuesta);
    } catch (error) {
      console.error("Error al actualizar cliente", error);
    }
  };

  const fetchClienteByCedula = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/${id}`, options);
      console.log(response);
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.cedula === id ? response.data.cliente : cliente
        )
      );
    } catch (error) {
      console.error("Error al obtener cliente", error);
    }
  };
  const addCliente = (nuevoCliente) => {
    setClientes([...clientes, nuevoCliente]);
  };
 
  return (
    <HistoryContext.Provider 
    value={{ 
      usuarios, 
      addUsuario, 
      fetchUsuariosByCedula,
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
