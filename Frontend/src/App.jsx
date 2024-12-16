import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './Layouts/verifyAuth.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { PrivateRoute } from './routes/PrivateRoute.jsx';
import Bienvenida from './Paginas/Bienvenida';
import Login from './Paginas/Login';
import NotFoundPage from './Paginas/NotFoundPage.jsx';
import Dashboard from './Paginas/Dashboard.jsx';
import Asistencia from './Paginas/Asistencias/HistorialAsistencia.jsx';
import ClientesVehiculos from './Paginas/Clientes/HistorialClientes.jsx';
import RegistrarClientes from './Paginas/Clientes/RegistrarClientes.jsx';
import Pagos from './Paginas/Pagos/HistorialPagos.jsx';
import Usuarios from './Paginas/Usuarios/HistorialUsuarios.jsx';
import RegistrarUsuarios from './Paginas/Usuarios/RegistrarUsuarios.jsx';
import VisualizarPerfil from './Paginas/Perfil.jsx';
import ActualizarUsuarios from './Paginas/Usuarios/ActualizarUsuarios.jsx';
import { HistoryProvider } from './context/historyProvider.jsx';
import ActualizarClientes from './Paginas/Clientes/ActualizarClientes.jsx';
import HistorialMantenimiento from './Paginas/Tecnicos/HistorialMantenimiento.jsx';
import Reestablecer from './Paginas/Contraseñas/Reestablecer.jsx';
import RecuperarContraseña from './Paginas/Contraseñas/OlvidasteContraseña.jsx';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <HistoryProvider>
                    <Routes>
                        {/* Ruta pública principal */}
                        <Route path="/" element={<Bienvenida />} />

                        {/* Ruta de autenticación */}
                        <Route path="/login" element={<Login />} />
                        {/* Ruta para recuperación de contraseña */}
                        <Route path="/recuperar-contrasena/" element={<Reestablecer />} />
                        {/* Ruta para olvido de contraseña */}
                        <Route path="/olvidaste-contrasena/" element={<RecuperarContraseña />} />


                        {/* <Route path='forgot/:id' element={<Forgot/>}/>
                        <Route path='confirmar/:token' element={<Confirmar/>}/>
                        <Route path='recuperar-password/:token' element={<Restablecer/>}/>
                        */}

                        {/* Rutas privadas dentro de /dashboard */}
                        <Route
                            path="/dashboard/*"
                            element={
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
                                        <Route path="actualizar-clientes/:id" element={<ActualizarClientes />} />
                                        <Route path="historial-mantenimiento" element={<HistorialMantenimiento />} />
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Routes>
                                </PrivateRoute>
                            }
                        />

                        {/* Página no encontrada */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </HistoryProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
