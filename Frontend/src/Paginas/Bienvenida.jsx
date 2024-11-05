import logo from '../assets/imagenes/logo.jpg'
import {Link} from 'react-router-dom'
import { useState } from 'react'



export const Bienvenida = () => {
    return (
        <div>
           
            <main className="bg-black flex items-center justify-center h-screen px-5">
                <div className="text-center p-8 rounded-lg shadow-lg bg-black">
                    <h1 className="text-4xl font-bold text-white mb-5">BIENVENIDO</h1>
                    
                   
                    <img src={logo} alt="Full Prestige" className="logo mb-5" />

                    
                    <Link to="/sistema">
                        <button className="mt-5 bg-black border border-white text-red-600 px-8 py-2 rounded-full hover:bg-gray-900 transition-colors">
                            INGRESAR AL SISTEMA
                        </button>
                    </Link>

                    

                   
                    <p className="text-lg text-white mt-6">
                        Empresa dedicada al cuidado y mantenimiento de tu vehículo
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Bienvenida;

