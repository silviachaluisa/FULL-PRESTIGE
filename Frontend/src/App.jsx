import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx';
import  Bienvenida  from './Paginas/Bienvenida'
import  Login  from './Paginas/Login'
import Dashboard from './Paginas/Dashboard.jsx'
import Asistencia from './Paginas/Asistencias/HistorialAsistencia.jsx'
import RegistrarAsistencia from './Paginas/Asistencias/RegistrarAsitencia.jsx'
import ClientesVehiculos  from './Paginas/Clientes/HistorialClientes.jsx'
import RegistrarClientes from './Paginas/Clientes/RegistrarClientes.jsx'
import Pagos from './Paginas/Pagos/HistorialPagos.jsx'
import RegistrarPagos from './Paginas/Pagos/RegistrarPagos.jsx';
import Usuarios from './Paginas/Usuarios/HistorialUsuarios.jsx';
import RegistrarUsuarios from './Paginas/Usuarios/RegistrarUsuarios.jsx';
import VisualizarPerfil from './Paginas/Perfil.jsx';
import ActualizarUsuarios from './Paginas/Usuarios/ActualizarUsuarios.jsx';
import { HistoryProvider } from './context/historyProvider.jsx';
import RecuperarContrasena from './Paginas/RecuperarContraseña.jsx';
import ActualizarClientes from './Paginas/Clientes/ActualizarClientes.jsx';


function App() {
    return (
        <BrowserRouter>
        <AuthProvider>
            <HistoryProvider>
        <Routes>
            {/* RUTAS PRIVADAS */}
               <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/historial-asistencia" element={<Asistencia />} />
                <Route path="/registrar-asistencia" element={<RegistrarAsistencia />} />
                <Route path="/historial-clientes" element={<ClientesVehiculos />} />
                <Route path="/registrar-clientes" element={<RegistrarClientes />} />
                <Route path="/historial-pagos" element={<Pagos />} />
                <Route path="/registrar-pagos" element={<RegistrarPagos />} />
                <Route path="/historial-usuarios" element={<Usuarios />} />
                <Route path="/registrar-usuarios" element={<RegistrarUsuarios />} />
                <Route path="/perfil" element={<VisualizarPerfil />} />
                <Route path="/actualizar-usuarios/:id" element={<ActualizarUsuarios />} />
            {/* RUTAS PUBLICAS */}
                <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
                <Route path="/login" element={<Login />} />  
                <Route path="/actualizar-clientes/:id" element={<ActualizarClientes />} />
            </Routes>
            </HistoryProvider>
        </AuthProvider>
        
    
       
      
           
        </BrowserRouter>

    );
}

export default App;
