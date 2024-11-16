import {useContext, useEffect } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import usuario from '../../assets/imagenes/usuarios.png';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { HistoryContext } from '../../context/historyProvider';
import { FormularioUsuarios } from '../../components/Usuarios/FormularioUsuarios';


export const ActualizarUsuarios = () => {
    const navigate =useNavigate();
 
  const {id}=useParams();
  const {usuarios,fetchUsuariosByCedula}= useContext (HistoryContext)
  console.log(usuarios)

  useEffect(() => {
    const obtenerUsuario = async () => {
        await fetchUsuariosByCedula(id);
    };
    obtenerUsuario();
},[id]);

//   const { pathname } = useLocation(); //Para la ruta actualizar

 
  

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/historial-usuarios');
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
        {/* {pathname.split("-")[0].slice(1).toUpperCase()} USUARIOS  */} ACTUALIZAR USUARIOS
      </h2>
      
    {/* Imagen de usuario */}
      <div>
        <img src={usuario} alt="Usuario" style={{ width: '120px', height: '120px' }} className='mx-auto' />
      </div>
    {/* ------------------------------------------- */}


    {/* FORMULARIO */}
      
       {Object.keys(usuarios).length!=0?( <FormularioUsuarios usuarios={usuarios}/>):(
           <p>No existen registros</p>
        
       )}
    {/* --------------------------------------------- */}
        

     

      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">Empresa Dedicada al Cuidado y Mantenimiento de tu Vehículo</p>
      </footer>
    </div>
  );
};

export default ActualizarUsuarios;
