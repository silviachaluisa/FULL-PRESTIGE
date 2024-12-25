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
    const [loginMessage, setLoginMessage] = useState({
        respuesta: "",
        tipo: true
    })
    const navigate = useNavigate()

    // -------------------------------- Funciones de control en mensajes de validación --------------------------------
    async function mostrarErrores(errors) {
        // Asegura que los errores se muestren de manera secuencial
        for (const error of errors) {
            // Establece el mensaje de error
            setMessage({respuesta: error.msg,tipo:false});
            // Mostrar el mensaje de error en la consola
            console.error("Error:", error.msg);

            // Esperar 5 segundos antes de pasar al siguiente error
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Limpiar el mensaje de error antes de mostrar el siguiente
            setMessage("");
        }
    }
    
    const perfil = async(token) => {
        try {
            const url = `${process.env.VITE_BACKEND_URL}/profile`
            const options={
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta= await axios.get(url,options)
            setAuth(respuesta.data.empleado)
        } catch (error) {
            console.log(error);
            if (localStorage.getItem("token")){
                localStorage.removeItem("token");
            }
            navigate('/login');
            setLoginMessage({respuesta: error.response.data.error ? error.response.data.error : error.response.data.message, tipo: false});
        }
    }

    const actualizarPerfil = async (form) => {
        const token = localStorage.getItem("token")
        try {
            const url= `${process.env.VITE_BACKEND_URL}/profile`

            const respuesta=await axios.put (url, form ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            // Actualizar la información del usuario en el contexto
            perfil(token);
            // Establecer mensaje de éxito
            return {respuesta: respuesta.data.message,tipo:true}
        } catch (error) {
            console.log(error)
            if (error.response.data?.errors && error.response.data.errors.length > 0) {
                // Mostrar errores de validación uno por uno
                await mostrarErrores(error.response.data.errors);
                return {respuesta: error.response.data.errors[0].msg,tipo:false}
            } else {
                setMessage(error.response.data.error ? error.response.data.error : error.response.data.message);
                // Limpiar el mensaje de error después de un breve tiempo
                setTimeout(() => {
                    setMessage("");
                }, 5000);
                return { respuesta: error.response.data.error ? error.response.data.error : error.response.data.message, tipo: false}
            }
        }
    };

    const logout = () => {
        try{
            const response = axios.post(`${process.env.VITE_BACKEND_URL}/logout`,{}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            localStorage.removeItem('token')
            setAuth({})
            navigate('/login')
        } catch(error){
			console.log(error);
        }

    };

    const getActiveSessions = async () => {
        try {
            const response = await axios.get(`${process.env.VITE_BACKEND_URL}/sessions`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(response.data)
            return response.data.sesiones;
        } catch (error) {
            console.error(error)
            return []
        }
    };

    const closeSession = async (sessionToken) => {
        try {
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/logout-session/${sessionToken}`,{}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            return {message: response.data, success: true};
        } catch (error) {
            console.error(error)
            return { message: 'Error al cerrar la sesión', success: false}
        }
    };

    const closeAllSessions = async () => {
        try {
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/logout-all`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            return {message: response.data, success: true};
        } catch (error) {
            console.error(error)
            return { message: 'Error al cerrar todas las sesiones', success: false}
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
                loginMessage,
                setLoginMessage,
				logout,
				getActiveSessions,
				closeSession,
				closeAllSessions
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