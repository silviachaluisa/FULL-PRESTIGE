// src/App.jsx
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Bienvenida } from './Paginas/Bienvenida'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Bienvenida />} /> {/* Ruta principal */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
