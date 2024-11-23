import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types'

export const TablaAsistencia = ({usuarios}) => {
    const navigate = useNavigate()
        return (
            <div className="overflow-x-auto ">
                {/* Tabla de Historial */}
                <table className="w-full text-center border-collapse border border-black ">
                <thead className="bg-black text-white font-mono  ">
                    <tr>
                    {[
                        'Cédula','Nombre y Apellido','Telefono', 'Cargo', 'Fecha', 
                        'Hora de Ingreso','Hora de Salida','Estado'
                    ].map((header) => (
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
                        <td className="border border-black px-4 py-2">{item.cargo}</td>
                        <td className="border border-black px-4 py-2">{item.fecha || 'N/A'}</td>
                        <td className="border border-black px-4 py-2">{item.horaIngreso || 'N/A'}</td>
                        <td className="border border-black px-4 py-2">{item.horaSalida || 'N/A'}</td>
                        <td className="border border-black px-4 py-2">{item.estado}</td>
                       
                        
                        </tr>
                    ))}
                </tbody>
               </table>
            </div>
        )
    }
    
    TablaAsistencia.propTypes = {
        usuarios: PropTypes.arrayOf(PropTypes.shape({
            cedula: PropTypes.string.isRequired,
            nombre: PropTypes.string.isRequired,
            telefono: PropTypes.string.isRequired,
            correo: PropTypes.string.isRequired,
            direccion: PropTypes.string.isRequired,
            cargo: PropTypes.string.isRequired,
            estado: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })).isRequired,
    }
    