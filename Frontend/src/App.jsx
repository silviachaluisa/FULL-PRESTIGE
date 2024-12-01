import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Auth from './Layouts/verifyAuth.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { PrivateRoute } from './routes/PrivateRoute.jsx';
import Bienvenida  from './Paginas/Bienvenida'
import Login  from './Paginas/Login'
import NotFoundPage from './Paginas/NotFoundPage.jsx'
import Dashboard from './Paginas/Dashboard.jsx'
import Asistencia from './Paginas/Asistencias/HistorialAsistencia.jsx'

import ClientesVehiculos  from './Paginas/Clientes/HistorialClientes.jsx'
import RegistrarClientes from './Paginas/Clientes/RegistrarClientes.jsx'
import Pagos from './Paginas/Pagos/HistorialPagos.jsx'

import Usuarios from './Paginas/Usuarios/HistorialUsuarios.jsx';
import RegistrarUsuarios from './Paginas/Usuarios/RegistrarUsuarios.jsx';
import VisualizarPerfil from './Paginas/Perfil.jsx';
import ActualizarUsuarios from './Paginas/Usuarios/ActualizarUsuarios.jsx';
import { HistoryProvider } from './context/historyProvider.jsx';
import RecuperarContrasena from './Paginas/RecuperarContraseña.jsx';
import ActualizarClientes from './Paginas/Clientes/ActualizarClientes.jsx';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <HistoryProvider>
                    <Routes>
                        <Route path='/' element={<Auth/>}>
                            <Route index element={<Bienvenida />} /> {/* Ruta principal */}
                            <Route path="/login" element={<Login />} />  {/* Ruta de inicio de sesión */}
                        </Route>
                        {/* RUTAS PRIVADAS */}
                        <Route path="/dashboard/*" element={
                            <PrivateRoute>
                                <Routes>
                                    <Route index element={<Dashboard />} />
                                    <Route path="historial-asistencia" element={<Asistencia />} />
                                    <Route path="historial-clientes" element={<ClientesVehiculos />} />
                                    <Route path="registrar-clientes" element={<RegistrarClientes />} />
                                    <Route path="historial-pagos" element={<Pagos />} />
                                    <Route path="historial-usuarios" element={<Usuarios />} />
                                    <Route path="registrar-usuarios" element={<RegistrarUsuarios />} />
                                    <Route path="perfil" element={<VisualizarPerfil />} />
                                    <Route path="actualizar-usuarios/:id" element={<ActualizarUsuarios />} />
                                    <Route path='*' element={<NotFoundPage/>}/> 
                                </Routes>
                            </PrivateRoute>
                        } />
                        {/* RUTAS PUBLICAS */}
                        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
                        <Route path="/actualizar-clientes/:id" element={<ActualizarClientes />} />
                        <Route path='*' element={<NotFoundPage/>}/>
                    </Routes>
                </HistoryProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
