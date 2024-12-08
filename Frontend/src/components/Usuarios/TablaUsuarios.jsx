import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from "../../context/AuthProvider";
import { useContext } from "react";

export const TablaUsuarios = ({usuarios}) => {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);

    const encabezadoTabla = [
        'Cédula','Nombre y Apellido','Telefono', 'Email', 'Dirección', 
        'Cargo','Estado'
    ]

    if (auth?.cargo === "Administrador"){
        encabezadoTabla.push('Opciones')
    }

    return (
        <div className="overflow-x-auto ">
            {/* Tabla de Historial */}
            <table className="w-full text-center border-collapse border border-black ">
            <thead className="bg-black text-white font-mono  ">
                <tr>
                {encabezadoTabla.map((header) => (
                    <th key={header} className="border border-white px-4 py-2">{header}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {usuarios.map((item, index) => (
                    <tr key={index}>
                    <td className="border border-black px-4 py-2">{item.cedula}</td>
                    <td className="border border-black px-4 py-2">{item.nombre}</td>
                    <td className="border border-black px-4 py-2">{item.telefono}</td>
                    <td className="border border-black px-4 py-2">{item.correo}</td>
                    <td className="border border-black px-4 py-2">{item.direccion}</td>
                    <td className="border border-black px-4 py-2">{item.cargo}</td>
                    <td className="border border-black px-4 py-2">{item.estado}</td>
                    {
                        auth?.cargo === "Administrador" && (
                            <td className="border border-black px-4 py-2">
                                <div className="flex justify-center gap-4">
                                    <FaPencilAlt
                                        className="text-black hover:text-blue-700 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/actualizar-usuarios/${item.cedula}`)}
                                    />
                                </div>
                            </td>
                        )
                    }
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

TablaUsuarios.propTypes = {
    usuarios: PropTypes.arrayOf(PropTypes.shape({
        cedula: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        cargo: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired,
        
    })).isRequired,
}
    