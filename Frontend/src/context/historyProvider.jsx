import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const HistoryContext = createContext();

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);

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
                const respuesta = await axios.put(URLActualizar, registro, options);
                console.log(respuesta)
                fetchUsuarios()
              
                
  }

  
  const fetchUsuariosByCedula= async(id)=>{
    const token = localStorage.getItem('token')
    if (!token )return
    try {
      const options={
        headers:{
          'Content-Type': 'application/json',
          Authorization:`Bearer ${token}`,
        }
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee/${id}`,options);
      setUsuarios(response.data.empleado); // Suponiendo que la API retorna un array de usuarios
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }

  }



  // Función para agregar un usuario y actualizar el estado
  const addUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
  };

 
  return (
    <HistoryContext.Provider value={{ usuarios, addUsuario, fetchUsuariosByCedula,upDateUser,fetchUsuarios }}>
      {children}
    </HistoryContext.Provider>
  );
};
