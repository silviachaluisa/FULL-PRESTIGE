import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from '../../context/AuthProvider';
import { useContext, useState, useEffect } from 'react';
import { HistoryContext } from '../../context/HistoryContext';

export const TablaClientes = ({ clientes }) => {
  const navigate = useNavigate();
  const { seleccionado, setSeleccionado } = useContext(HistoryContext);
  const { auth } = useContext(AuthContext);
  const [filteredClientes, setFilteredClientes] = useState(clientes);
  const [month, setMonth] = useState("");

  useEffect(() => {
    if (month){
      handleFilter();
    }else{
      setFilteredClientes(clientes);
    }
  }, [month]);

  const formatDate = (isoDate) => {
    try {
      if (!isoDate) {
        return 'N/A';
      }
      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Fecha inválida');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formateando fecha: ${error.message}`);
      return 'Fecha inválida';
    }
  };

  const handleRowClick = (cliente) => {
    setSeleccionado(cliente);
    console.log("Cliente seleccionado:", cliente);
  };

  const handleFilter = () => {
    const [year, monthIndex] = month.split("-").map(Number);
    const filtered = clientes.filter((cliente) => {
      const ingresoDate = new Date(cliente.fecha_ingreso);
      return (
        ingresoDate.getFullYear() === year && ingresoDate.getMonth() === monthIndex - 1
      );
    });
    setFilteredClientes(filtered);
  };

  const encabezadoTabla = [
    'Cédula','Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
    'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
    'Técnico Responsable', 'Estado'
  ];

  if (auth?.cargo === 'Administrador') {
    encabezadoTabla.push('Opciones');
  }

  return (
    <div className="overflow-x-auto">

      <div className='flex gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <label htmlFor="month" className="font-bold">Mes:</label>
          <input 
            type="month"
            id='month'
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className='border border-black rounded-md px-2 py-1' 
          />
        </div>

       

        <button
          onClick={() => {
            setMonth("");
            setFilteredClientes(clientes);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Recargar Tabla
        </button>
      </div>

      {filteredClientes.length === 0 ? (
        <div className="text-center text-red-500 font-bold">No existen registros para los filtros seleccionados.</div>
      ) : (
        <table className="w-full text-center border-collapse border">
          <thead className="bg-black text-white">
            <tr>
              {encabezadoTabla.map((header) => (
                <th key={header} className="border border-white px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((item) => (
              <tr 
                key={`${item.propietario.cedula}-${item.n_orden}`}
                onClick={() => handleRowClick(item)}
                className={`cursor-pointer ${seleccionado && seleccionado?.propietario?.cedula === item?.propietario?.cedula ? 'bg-gray-300' : ''}`}
              >
                <td className="border border-black px-4 py-2">{item?.propietario.cedula}</td>
                <td className="border border-black px-4 py-2">{item?.propietario.nombre}</td>
                <td className="border border-black px-4 py-2">{item?.propietario.telefono}</td>
                <td className="border border-black px-4 py-2">{item?.propietario.correo}</td>
                <td className="border border-black px-4 py-2">{item?.propietario.direccion}</td>
                <td className="border border-black px-4 py-2">{item?.n_orden}</td>
                <td className="border border-black px-4 py-2">{item?.marca}</td>
                <td className="border border-black px-4 py-2">{item?.modelo}</td>
                <td className="border border-black px-4 py-2">{item?.placa}</td>
                <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso)}</td>
                <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)}</td>
                <td className="border border-black px-4 py-2">{item?.encargado?.nombre}</td>
                <td className="border border-black px-4 py-2">{item?.estado}</td>
                {auth?.cargo === 'Administrador' && (
                  <td className="border border-black px-4 py-2">
                    <div className="flex justify-around">
                      <FaPencilAlt
                        onClick={() => 
                          navigate(`/dashboard/actualizar-clientes/${item.propietario.cedula}`)}

                        className="text-black hover:text-blue-700 cursor-pointer"
                        data-tooltip-id="edit_client"
                        data-tooltip-content="Editar cliente"
                      />
                      <ReactTooltip id='edit_client' place='bottom'/>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

TablaClientes.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape({
    propietario: PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      correo: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
    }).isRequired,
    n_orden: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    placa: PropTypes.string.isRequired,
    fecha_ingreso: PropTypes.string.isRequired,
    fecha_salida: PropTypes.string,
    estado: PropTypes.string.isRequired,
  })).isRequired,
};

// ----------------------------------------------------------------------------------------------------------------------------    

// CODIGO QUE SI FUNCIONA
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from '../../context/AuthProvider';
import { useContext, useState } from 'react';
import { HistoryContext } from '../../context/HistoryContext';

export const TablaClientes = ({clientes}) => {
  const navigate = useNavigate();
  const {seleccionado, setSeleccionado} = useContext(HistoryContext);
  const { auth } = useContext(AuthContext);
  const [mesSeleccionado, setMesSeleccionado] = useState(''); // Estado para el mes seleccionado

  console.log(clientes);

  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    try {
      if (!isoDate) {
        return 'N/A'; // Si no hay fecha, retornar 'N/A'
      }

      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Fecha inválida');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formateando fecha: ${error.message}`);
      return 'Fecha inválida';
    }
  };

  // Función para manejar el click en una fila
  const handleRowClick = (cliente) => {
    setSeleccionado(cliente); //Actualizar el cliente seleccionado en el contexto
    console.log("Cliente seleccionado:", cliente);
  };

  // Función para filtrar por mes
  const filtrarPorMes = (clientes) => {
    if (!mesSeleccionado) return clientes; // Si no se selecciona mes, mostrar todos los clientes

    return clientes.filter((item) => {
      const fechaIngreso = new Date(item.fecha_ingreso);
      return fechaIngreso.getMonth() === parseInt(mesSeleccionado) - 1; // Filtrar por el mes (0-11)
    });
  };

  const encabezadoTabla = [
    'Cédula','Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
    'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
    'Técnico Responsable', 'Estado'
  ];

  if (auth?.cargo === 'Administrador') {
    encabezadoTabla.push('Opciones');
  }

  return (
    <div className="overflow-x-auto">
      {/* Filtro de mes */}
      <div className="mb-4">
        <label htmlFor="mes" className="mr-2">Seleccionar mes:</label>
        <select 
          id="mes" 
          value={mesSeleccionado} 
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border px-4 py-2"
        >
          <option value="">Todos</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse borde">
        <thead className="bg-black text-white">
          <tr>
            {encabezadoTabla.map((header) => (
              <th key={header} className="border border-white px-4 py-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtrarPorMes(clientes).map((item) => (
            <tr 
              key={`${item.propietario.cedula}-${item.n_orden}`}
              onClick={() => handleRowClick(item)}
              className={`cursor-pointer ${seleccionado && seleccionado?.propietario?.cedula === item?.propietario?.cedula ? 'bg-gray-300' : ''}`}
            >
              <td className="border border-black px-4 py-2">{item?.propietario.cedula} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.telefono} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.correo} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.direccion} </td>
              <td className="border border-black px-4 py-2">{item?.n_orden} </td>
              <td className="border border-black px-4 py-2">{item?.marca} </td>
              <td className="border border-black px-4 py-2">{item?.modelo} </td>
              <td className="border border-black px-4 py-2">{item?.placa} </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso)} </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)} </td>
              <td className="border border-black px-4 py-2">{item?.encargado?.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.estado} </td>
              {auth?.cargo === 'Administrador' && (
                <td className="border border-black px-4 py-2">
                  <div className="flex justify-around">
                    <FaPencilAlt
                      onClick={() => navigate(`/dashboard/actualizar-clientes/${item.propietario.cedula}`)}
                      className="text-black hover:text-blue-700 cursor-pointer"
                      data-tooltip-id="edit_client"
                      data-tooltip-content="Editar cliente"
                    />
                    <ReactTooltip id='edit_client' place='bottom'/>
                  </div>
                </td>
              )}
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};
  
TablaClientes.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape({
    propietario: PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      correo: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
    }).isRequired,
    n_orden: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    placa: PropTypes.string.isRequired,
    fecha_ingreso: PropTypes.string.isRequired,
    fecha_salida: PropTypes.string,
    estado: PropTypes.string.isRequired,
  })).isRequired,
};

// CODIGO MAL HECHO----------------------------------------------------------------------------------------------------------------------------
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from '../../context/AuthProvider';
import { useContext, useState } from 'react';
import { HistoryContext } from '../../context/HistoryContext';

export const TablaClientes = ({clientes}) => {
  const navigate = useNavigate();
  const {seleccionado, setSeleccionado} = useContext(HistoryContext);
  const { auth } = useContext(AuthContext);
  const [mesSeleccionado, setMesSeleccionado] = useState(''); // Estado para el mes seleccionado

  console.log(clientes);

  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    try {
      if (!isoDate) {
        return 'N/A'; // Si no hay fecha, retornar 'N/A'
      }

      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Fecha inválida');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(Error formateando fecha: ${error.message});
      return 'Fecha inválida';
    }
  };

  // Función para manejar el click en una fila
  const handleRowClick = (cliente) => {
    setSeleccionado(cliente); //Actualizar el cliente seleccionado en el contexto
    console.log("Cliente seleccionado:", cliente);
  };

  // Función para filtrar por mes
  const filtrarPorMes = (clientes) => {
    if (!mesSeleccionado) return clientes; // Si no se selecciona mes, mostrar todos los clientes

    return clientes.filter((item) => {
      const fechaIngreso = new Date(item.fecha_ingreso);
      return fechaIngreso.getMonth() === parseInt(mesSeleccionado) - 1; // Filtrar por el mes (0-11)
    });
  };

  const encabezadoTabla = [
    'Cédula','Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
    'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
    'Técnico Responsable', 'Estado'
  ];

  if (auth?.cargo === 'Administrador') {
    encabezadoTabla.push('Opciones');
  }

  return (
    <div className="overflow-x-auto">
      {/* Filtro de mes */}
      <div className="flex gap-4 mb-4">
        <div className='flex items-center gap-2'>
        <label htmlFor="mes" className="mr-2 font-bold ">Seleccionar mes:</label>
        <input 
        type="month"  
        id="mes"
        value={mesSeleccionado}
        onChange={(e) => setMesSeleccionado(e.target.value)}
        className="border px-4 py-2"
         />
        
        </div>
        <button
          onClick={() => {
            setMonth("");
            setFilteredClientes(clientes);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Todos los meses
        </button>
      </div>
      { filtrarPorMes(clientes).length === 0 ? (
        <div className="text-center text-red-500 font-bold">No existen registros para los filtros seleccionados.</div>
      ) : (
        <div>
      {/* Tabla de Historial de Clientes */}
      <table className="w-full text-center border-collapse borde">
        <thead className="bg-black text-white">
          <tr>
            {encabezadoTabla.map((header) => (
              <th key={header} className="border border-white px-4 py-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtrarPorMes(clientes).map((item) => (
            <tr 
              key={${item.propietario.cedula}-${item.n_orden}}
              onClick={() => handleRowClick(item)}
              className={cursor-pointer ${seleccionado && seleccionado?.propietario?.cedula === item?.propietario?.cedula ? 'bg-gray-300' : ''}}
            >
              <td className="border border-black px-4 py-2">{item?.propietario.cedula} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.telefono} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.correo} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.direccion} </td>
              <td className="border border-black px-4 py-2">{item?.n_orden} </td>
              <td className="border border-black px-4 py-2">{item?.marca} </td>
              <td className="border border-black px-4 py-2">{item?.modelo} </td>
              <td className="border border-black px-4 py-2">{item?.placa} </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso)} </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)} </td>
              <td className="border border-black px-4 py-2">{item?.encargado?.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.estado} </td>
              {auth?.cargo === 'Administrador' && (
                <td className="border border-black px-4 py-2">
                  <div className="flex justify-around">
                    <FaPencilAlt
                      onClick={() => navigate(/dashboard/actualizar-clientes/${item.propietario.cedula})}
                      className="text-black hover:text-blue-700 cursor-pointer"
                      data-tooltip-id="edit_client"
                      data-tooltip-content="Editar cliente"
                    />
                    <ReactTooltip id='edit_client' place='bottom'/>
                  </div>
                </td>
              )}
            </tr>
          ))} 
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
};
  
TablaClientes.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape({
    propietario: PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      correo: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
    }).isRequired,
    n_orden: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    placa: PropTypes.string.isRequired,
    fecha_ingreso: PropTypes.string.isRequired,
    fecha_salida: PropTypes.string,
    estado: PropTypes.string.isRequired,
  })).isRequired,
};