import { Outlet, Navigate } from 'react-router-dom'

const Auth = () => {
    const token = localStorage.getItem("token")
    return (
        <>
          {token ? <Navigate to="/dashboard" />: <Outlet/>}
        </>
    )
}

export default Auth