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
    const [message, setMessage] = useState({})
    const [loginMessage, setLoginMessage] = useState({
        respuesta: "",
        tipo: true
    })
    const [sesiones, setSesiones] = useState([])
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
            setMessage({});
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
                setMessage({respuesta: error.response.data.error ? error.response.data.error : error.response.data.message, tipo: false});
                // Limpiar el mensaje de error después de un breve tiempo
                setTimeout(() => {
                    setMessage({});
                }, 5000);
                return { respuesta: error.response.data.error ? error.response.data.error : error.response.data.message, tipo: false}
            }
        }
    };

    const logout = async () => {
        try{
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/logout`,{}, {
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
            });
            setSesiones(response.data.sesiones);
        } catch (error) {
            console.error(error)
            setMessage({tipo: false, respuesta: 'Error al obtener las sesiones'});
            setTimeout(() => {
                setMessage({})
            }, 5000);
        }
    };

    const closeSession = async (sessionID, sessionToken) => {
        try {
            const response = await axios.post(`${process.env.VITE_BACKEND_URL}/logout-session/${sessionID}`,{}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setMessage({tipo: true, respuesta: response.data.message})
            setTimeout(() => {
                setMessage({})
            }, 5000)

            if (localStorage.getItem('token') === sessionToken) {
                localStorage.removeItem('token');
                setAuth({});
                navigate('/login');
                setLoginMessage({tipo: true, respuesta: 'Sesión cerrada correctamente'});
            }else{
                await getActiveSessions()
            }
        } catch (error) {
            console.error(error)
            setMessage({tipo: false, respuesta: 'Error al cerrar la sesión'})

            setTimeout(() => {
                setMessage({})
            }, 5000)
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
            await logout()
            setTimeout(() => {
                setMessage({})
            }, 5000)
        } catch (error) {
            console.error(error)
            setMessage({tipo: false, respuesta: 'Error al cerrar todas las sesiones'})
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
				closeAllSessions,
                sesiones,
                setSesiones
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