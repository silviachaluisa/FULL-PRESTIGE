import LogCar from '../../assets/img/LogCar.png'
import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Mensaje from '../../components/Mensaje';
import axios from 'axios';

export const Confirmar = () => {
    const { token } = useParams();
    const [mensaje, setMensaje] = useState({});

    const verifyToken = async()=>{
        // Manejo de errores en el envío de datos
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/verify-token/${token}`
            const respuesta = await axios.get(url)
            console.log(respuesta);
            setMensaje({respuesta:response.data.message,tipo:true})
        } catch (error) {
            setMensaje({respuesta: error.response.data.message, tipo: false})
        }
    }
    useEffect(() => {
        verifyToken()
    }, [])
    return (
        
        <div className="flex flex-col items-center justify-center">
            <div className='mb-4'>
            {mensaje && (<Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} 
                    />
                    )}
            </div>         
            <img class="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src={logoCar} alt="image description"/>

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Ya puedes iniciar sesión</p>
                <Link to="/login" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Login</Link>
            </div>

        </div>
    )
}
