// src/App.jsx
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Bienvenida } from './Paginas/Bienvenida'
import { Login } from './Paginas/Login'
import {Administrador} from './Paginas/Administrador/ModuloAdministrador.jsx'
import {Asistencia} from './Paginas/Administrador/ControlAsistencia.jsx'
import{RegistrarAsistencia} from './Paginas/Administrador/RegistrarAsitencia.jsx'


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
                <Route path="/login" element={<Login />} />
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/control-asistencia" element={<Asistencia />} />
                <Route path="/registrar-asistencia" element={<RegistrarAsistencia />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
