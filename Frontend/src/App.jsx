// src/App.jsx

import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx';
import  Bienvenida  from './Paginas/Bienvenida'
import  Login  from './Paginas/Login'
import Dashboard from './Paginas/Dashboard.jsx'
import Asistencia from './Paginas/Administrador/HistorialAsistencia.jsx'
import RegistrarAsistencia from './Paginas/Administrador/RegistrarAsitencia.jsx'
import ClientesVehiculos  from './Paginas/Administrador/HistorialClientes.jsx'
import RegistrarClientes from './Paginas/Administrador/RegistrarClientes.jsx'
import Pagos from './Paginas/Administrador/HistorialPagos.jsx'
import RegistrarPagos from './Paginas/Administrador/RegistrarPagos.jsx';



function App() {
    return (
        <BrowserRouter>
    
        <AuthProvider> 
        <Routes>
                <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/historial-asistencia" element={<Asistencia />} />
                <Route path="/registrar-asistencia" element={<RegistrarAsistencia />} />
                <Route path="/historial-clientes" element={<ClientesVehiculos />} />
                <Route path="/registrar-clientes" element={<RegistrarClientes />} />
                <Route path="/historial-pagos" element={<Pagos />} />
                <Route path="/registrar-pagos" element={<RegistrarPagos />} />
            </Routes>
        </AuthProvider>
           
        </BrowserRouter>

    );
}

export default App;
