import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const HistoryContext = createContext();

// Crear el proveedor de contexto
export const HistoryProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);

  // Función para obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    const token = localStorage.getItem ('token')
    if (!token )return
    try {
      const options={
        Headers:{
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

  // Función para agregar un usuario y actualizar el estado
  const addUsuario = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
  };

  // Llamar a fetchUsuarios una vez cuando el componente carga
  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <HistoryContext.Provider value={{ usuarios, addUsuario }}>
      {children}
    </HistoryContext.Provider>
  );
};
