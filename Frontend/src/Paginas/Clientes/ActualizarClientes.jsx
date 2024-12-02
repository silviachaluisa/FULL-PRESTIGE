import {useContext, useEffect } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
//import usuario from '../../assets/imagenes/usuarios.png';
import { useNavigate, useParams } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
import { HistoryContext } from '../../context/HistoryContext';
import { FormularioClientes } from '../../components/Clientes/FormularioClientes';

export const ActualizarClientes = () => {
  const navigate = useNavigate();

  const {id}=useParams();
  const {clientes,fetchClienteByCedula}= useContext (HistoryContext)
  console.log(clientes)
  const ClienteSeleccionado=clientes[0];

  //const { pathname } = useLocation(); //Para la ruta actualizar

  useEffect(() => {
    const obtenerCliente = async () => {
        await fetchClienteByCedula(id);
    };
    obtenerCliente();
},[id]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/dashboard/historial-clientes');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Contenedor de la cabecera */}
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        
        <button 
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>
      
      {/* //Para dirigir a la pagina de actualizar usuario */}
      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
       ACTUALIZAR CLIENTES {/* {pathname.split("-")[0].slice(1).toUpperCase()} USUARIOS  */}
      </h2>
      {/* <div>
        <img src={cliente} alt="Cliente" style={{ width: '120px', height: '120px' }} className='mx-auto' />
      </div> */}
      
        {/* FORMULARIO .................................................................................................................*/}
        {Array.isArray(clientes) && clientes.length!=0?( <FormularioClientes clientes={ClienteSeleccionado}/>):(
           <p>No existen registros</p>
        
       )}
        {/* ........................................................................................................................ */}
      
      
      {/* </div> */} 
      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">2024 Full Prestige. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
export default ActualizarClientes;
