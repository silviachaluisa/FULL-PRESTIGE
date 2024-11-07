// src/App.jsx
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx';
import { Bienvenida } from './Paginas/Bienvenida'
import { Login } from './Paginas/Login'
import {Dashboard} from './Paginas/Administrador/Dashboard.jsx'
import {Asistencia} from './Paginas/Administrador/ControlAsistencia.jsx'
import{RegistrarAsistencia} from './Paginas/Administrador/RegistrarAsitencia.jsx'
import {ClientesVehiculos } from './Paginas/Administrador/TablaClientes.jsx'
import {RegistrarClientes} from './Paginas/Administrador/RegistrarClientes.jsx'



function App() {
    return (
        <BrowserRouter>
        
        <AuthProvider>
        <Routes>
                <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/control-asistencia" element={<Asistencia />} />
                <Route path="/registrar-asistencia" element={<RegistrarAsistencia />} />
                <Route path="/historial-clientes" element={<ClientesVehiculos />} />
                <Route path="/registrar-clientes" element={<RegistrarClientes />} />
            </Routes>
        </AuthProvider>
           
        </BrowserRouter>

    );
}

export default App;
