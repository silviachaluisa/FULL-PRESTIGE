import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'

// Creación del grupo de whatsapp
const AuthContext = createContext()

// El mensaje a enviar
const AuthProvider = ({ children }) => {
    //Cargar la info del perfil del usuario - login
    const [auth, setAuth] = useState({})
    const [data, setData] = useState("Info del context")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    // -------------------------------- Funciones de control en mensajes de validación --------------------------------
    async function mostrarErrores(errors) {
        // Asegura que los errores se muestren de manera secuencial
        for (const error of errors) {
            // Establece el mensaje de error
            setMessage({respuesta: error.msg,tipo:false});
            // Mostrar el mensaje de error en la consola
            console.error("Error al registrar pago", error.msg);

            // Esperar 5 segundos antes de pasar al siguiente error
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Limpiar el mensaje de error antes de mostrar el siguiente
            setMessage("");
        }
    }
    
    const perfil = async(token) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/profile`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta= await axios.get(url,options)
            console.log(respuesta.data)
            setAuth(respuesta.data.empleado)
        } catch (error) {
            console.log(error);
        }
    }

    const actualizarPerfil = async (form) => {
        console.log(form);
        const token = localStorage.getItem("token")
        try {
            const url= `${import.meta.env.VITE_BACKEND_URL}/profile`

            const respuesta=await axios.put (url, form ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            // Establecer mensaje de éxito
            setMessage({respuesta: respuesta.data.message,tipo:true})
            setTimeout(() => {
                setMessage(""); // Limpiar el mensaje después de un breve tiempo
                perfil(token); /*Sirve para que cuando se actualice el perfil, se cambie a la nueva actualizacion*/
                navigate('/dashboard')
            }, 5000);
        } catch (error) {
            console.log(error)
            if (error.response.data?.errors && error.response.data.errors.length > 0) {
                // Mostrar errores de validación uno por uno
                await mostrarErrores(error.response.data.errors);
            } else {
                setMessage(error.response.data.message);
                // Limpiar el mensaje de error después de un breve tiempo
                setTimeout(() => {
                    setMessage("");
                }, 5000);
            }
            return {respuesta: error.data,tipo:false}
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token)
        {
            perfil(token)
        }
    }, [])
    
    return (
        <AuthContext.Provider value={
            {
                auth,
                setAuth,
                data,
                setData,
                actualizarPerfil,
                message,
                setMessage,
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};