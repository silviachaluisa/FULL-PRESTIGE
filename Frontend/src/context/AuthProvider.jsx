import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
// Creación del grupo de whatsapp
const AuthContext = createContext()
// El mensaje a enviar
const AuthProvider = ({ children }) => {
    //Cargar la info del perfil del usuario - login
    const [auth, setAuth] = useState({})
    const [data, setData] = useState("Info del context")
    
    
    const perfil = async(token) => {
        try {
            const user = jwtDecode(token) // Decodificar el token 
            const url = `${import.meta.env.VITE_BACKEND_URL}/profile`
            console.log(user)
            // const url = `${import.meta.env.VITE_BACKEND_URL}/ministerio/perfil`
            console.log(url)
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

            const respuesta=await axios.put (url,form,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    }
                    })
                    perfil(token) /*Sirve para que cuando se actualice el perfil, se cambie a la nueva actualizacion*/
                    return {respuesta: respuesta.data.message,tipo:true}

        } catch (error) {
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
                actualizarPerfil
                     
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
