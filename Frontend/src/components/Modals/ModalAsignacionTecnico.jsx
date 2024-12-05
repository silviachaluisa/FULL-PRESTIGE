import { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import { HistoryContext } from '../../context/HistoryContext'

const ModalAsignacionTecnico = ({infoVehiculo, handleShow}) => {
    const {
        fetchUsuarios,
        fetchMantenimientosByPlaca,
        registerMaintance,
        successMessage,
        errorMessage,
        setErrorMessage,
    } = useContext(HistoryContext);
    const [ tecnicos, setTecnicos ] = useState([]);
    const [ cargando, setCargando ] = useState(false);
    const [ infoMantenimiento, setInfoMantenimiento ] = useState({
        placa: infoVehiculo.placa,
        encargado: "",
        costo: 0,
        descripcion: "",
    });

    const handleSubmit = async () => {
        if (infoMantenimiento.encargado === "Seleccionar Técnico") {
            setErrorMessage("Debes seleccionar un técnico");
            setInterval(() => {
                setErrorMessage("");
            }, 5000);
            return;
        }

        console.log("Mantenimiento ->", infoMantenimiento);
        await registerMaintance(infoMantenimiento);
    };

    const handleChange = (e) => {
        setInfoMantenimiento({
            ...infoMantenimiento,
            [e.target.name]: e.target.value}
        );
    }

    useEffect(() => {
        const filtrarTecnicos = async () => {
            const usuarios = await fetchUsuarios();
            const ltecnicos = usuarios.filter((usuario) => usuario.cargo === "Técnico" && usuario.estado === "Activo");
            setTecnicos(ltecnicos);
        };
        
        const obtenerMantenimiento = async () => {
            const mantenimientos = await fetchMantenimientosByPlaca(infoVehiculo.placa);
            if (mantenimientos && mantenimientos.length > 0) {
                const mantenimiento = mantenimientos.at(-1);
                setInfoMantenimiento({
                    ... infoMantenimiento,
                    encargado: mantenimiento.encargado.cedula,
                    costo: mantenimiento.costo,
                    descripcion: mantenimiento.descripcion,
                })
            }
        };
        
        setCargando(true);
        filtrarTecnicos();
        obtenerMantenimiento();
        setCargando(false);
    }, [])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Asignar Mantenimiento</h2>

                {errorMessage && (
                <div className="text-red-600 font-semibold mb-4">{errorMessage}</div>
                )}
                {successMessage && (
                <div className="text-green-600 font-semibold mb-4">{successMessage}</div>
                )}

                {/* Selección del Técnico */}
                <div className="mb-4">
                <label htmlFor="tecnicos" className="block text-gray-700 font-semibold mb-2">
                    Técnico:
                </label>
                <select
                    id="tecnicos"
                    name="tecnicos"
                    autoComplete="tecnicos"
                    className="w-full border rounded-lg p-2"
                    value={infoMantenimiento.encargado}
                    onChange={handleChange}
                >
                    <option>Seleccionar Técnico</option>
                    {cargando ? (
                    <option>Cargando...</option>
                    ) : (
                    tecnicos.map((tecnico) => (
                        <option key={tecnico.cedula} value={tecnico.cedula}>
                        {tecnico.nombre}
                        </option>
                    ))
                    )}
                </select>
                </div>

                {/* Campo de Costo */}
                <div className="mb-4">
                <label htmlFor="costo" className="block text-gray-700 font-semibold mb-2">
                    Costo:
                </label>
                <input
                    type="number"
                    id="costo"
                    name="costo"
                    value={infoMantenimiento.costo}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="Ingrese el costo del mantenimiento"
                    required
                />
                </div>

                {/* Campo de Descripción */}
                <div className="mb-4">
                <label htmlFor="descripcion" className="block text-gray-700 font-semibold mb-2">
                    Descripción:
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={cargando ? "cargando ..." : infoMantenimiento.descripcion}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="Ingrese la descripción del mantenimiento"
                    rows={3}
                    required
                />
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={handleShow}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800"
                >
                    Cancelar
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
                    disabled={cargando}
                    onClick={handleSubmit}
                >
                    Guardar
                </button>
                </div>
            </div>
        </div>
    )
}

ModalAsignacionTecnico.propTypes = {
    infoVehiculo: PropTypes.object,
    handleShow: PropTypes.func
}

export default ModalAsignacionTecnico
