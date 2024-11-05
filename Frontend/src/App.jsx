// src/App.jsx
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Bienvenida } from './Paginas/Bienvenida'
import { Login } from './Paginas/Login'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
