import { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import { HistoryContext } from '../../context/HistoryContext'

const ModalMantenimiento = ({info, handleShow}) => {
    const {
        fetchUsuarios,
        registerMaintance,
        successMessage,
        errorMessage,
        setErrorMessage,
        tipoModal,
        upDateMaintance,
        requestUpdateMaintenance
    } = useContext(HistoryContext);
    const [ tecnicos, setTecnicos ] = useState([]);
    const [ cargando, setCargando ] = useState(false);
    const [ justificacion, setJustificacion ] = useState(""); // Variable para la justificacion
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
    const [ infoMantenimiento, setInfoMantenimiento ] = useState({
        placa: info?.vehiculo?.placa || "",
        encargado: info?.encargado?.cedula || "Seleccionar Técnico",
        costo: info?.costo || 0,
        descripcion: info?.descripcion || "",
        estado: info?.estado || "Pendiente",
    });

    const handleChange = (e) => {
        setInfoMantenimiento({
            ...infoMantenimiento,
            [e.target.name]: e.target.value}
        );
    }

    const handleConfirmSave = () => {
        setShowConfirmModal(false); //Cierra el modal de confirmación
        handleSubmit(); //Ejecuta la logica de guardar
    };

    const validateEntries = () => {
        if (tipoModal === "actualizar") {
            if (!justificacion) {
                setErrorMessage("Debes escribir una justificación para la actualización");
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }

            if (infoMantenimiento.encargado === "") {
                setErrorMessage("Debes seleccionar un técnico");
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }
        }

        if (infoMantenimiento.costo === 0) {
            setErrorMessage("Debes ingresar un costo para el mantenimiento");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        if (infoMantenimiento.descripcion === "") {
            setErrorMessage("Debes ingresar una descripción para el mantenimiento");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        if (infoMantenimiento.estado === "") {
            setErrorMessage("Debes seleccionar un estado para el mantenimiento");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        if (infoMantenimiento.estado === "Finalizado" && tipoModal !== "actualizar") {
            setShowConfirmModal(true);
            return;
        } else {
            handleSubmit();
        }
    }

    const handleSubmit = async () => {
        if (tipoModal === "actualizar") {
            if (!justificacion) {
                setErrorMessage("Debes escribir una justificación para la actualización");
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }

            if (infoMantenimiento.encargado === "") {
                setErrorMessage("Debes seleccionar un técnico");
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }

            setCargando(true);
            try {
                // Actualizar mantenimiento
                await upDateMaintance(info?._id, {
                    cedula_encargado: infoMantenimiento.encargado,
                    costo: infoMantenimiento.costo,
                    descripcion: infoMantenimiento.descripcion,
                    estado: infoMantenimiento.estado,
                });
                console.log("Mantenimiento actualizado:", infoMantenimiento.id);
            } catch (error) {
                console.error("Error al actualizar:", error);
            } finally {
                setCargando(false);
            }
        } else if (tipoModal === "soli-actualizacion"){
            setCargando(true);
            try {
                // Solicitar actualización de mantenimiento
                await requestUpdateMaintenance(info?._id, {
                    nueva_descripcion: infoMantenimiento.descripcion,
                    nuevo_costo: infoMantenimiento.costo,
                    nuevo_estado: infoMantenimiento.estado,
                });
                console.log("Solicitud de actualización enviada");
            } catch (error) {
                console.error("Error al solicitar actualización:", error);
            } finally {
                setCargando(false);
            }
        }else {
            if (infoMantenimiento.encargado === "") {
                setErrorMessage("Debes seleccionar un técnico");
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }
    
            setCargando(true);
            try {
                // Registrar nuevo mantenimiento
                await registerMaintance(info?._id,{
                    placa: info?.vehiculo?.placa,
                    cedula_encargado: infoMantenimiento.encargado,
                    costo: infoMantenimiento.costo,
                    descripcion: infoMantenimiento.descripcion,
                    estado: infoMantenimiento.estado,
                });
                console.log("Nuevo mantenimiento registrado");
            } catch (error) {
                console.error("Error al registrar:", error);
            } finally {
                setCargando(false);
            }
        }
    }; 
    
    useEffect(() => {
        const filtrarTecnicos = async () => {
            const usuarios = await fetchUsuarios();
            const ltecnicos = usuarios.filter(
                (usuario) => usuario.cargo === "Técnico" && usuario.estado === "Activo"
            );
            setTecnicos(ltecnicos);
        };
        if (tipoModal === "actualizar") {
            setCargando(true);
            Promise.all([filtrarTecnicos()])
                .catch(() => setErrorMessage("Error al cargar datos iniciales"))
                .finally(() => {
                    setCargando(false);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 5000);
                });
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    { tipoModal === "actualizar" ? "Actualizar" : tipoModal === "soli-actualizacion"? "Solicitar actualizacion de": "Registrar"} un mantenimiento
                </h2>

                {errorMessage && (
                <div className="text-red-600 font-semibold mb-4">{errorMessage}</div>
                )}
                {successMessage && (
                <div className="text-green-600 font-semibold mb-4">{successMessage}</div>
                )}

                {/* Selección del Técnico */}
                {
                    tipoModal === "actualizar" && (
                        <div className="mb-4">
                        <label htmlFor="tecnicos" className="block text-gray-700 font-semibold mb-2">
                            Técnico:
                        </label>
                        <select
                            id="encargado"
                            name="encargado"
                            autoComplete="encargado"
                            className="w-full border rounded-lg p-2"
                            value={infoMantenimiento.encargado}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar Técnico</option>
                            {cargando ? (
                            <option value="">Cargando...</option>
                            ) : (
                            tecnicos.map((tecnico) => (
                                <option key={tecnico.cedula} value={tecnico.cedula}>
                                {tecnico.nombre}
                                </option>
                            ))
                            )}
                        </select>
                        </div>
                    )
                }

                {/* Campo de Costo */}
                <div className="mb-4">
                <label htmlFor="costo" className="block text-gray-700 font-semibold mb-2">
                    Costo:
                </label>
                <input
                    type="number"
                    id="costo"
                    name="costo"
                    value={cargando ? "0" : infoMantenimiento.costo}
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

                {/* Estado del mantenimiento */}
                <div className="mb-4">
                <label htmlFor="estado" className="block text-gray-700 font-semibold mb-2">
                    Estado:
                </label>
                <select
                    id="estado"
                    name="estado"
                    autoComplete="estado"
                    className="w-full border rounded-lg p-2"
                    value={infoMantenimiento.estado}
                    onChange={handleChange}
                >
                    {
                        (tipoModal === "actualizar" || tipoModal ==="soli-actualizacion") && (
                            <>
                                <option value="Pendiente">Pendiente</option> 
                            </>
                        )
                    }
                    <option value="En Proceso">En Proceso</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
                </div>

                {/* Campo Justificación solo para Actualizar */}
                {tipoModal === "actualizar" && (
                    <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">Motivo de actualización:</label>
                    <textarea
                        value={justificacion}
                        onChange={(e) => setJustificacion(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Escribe una justificación para la actualización."
                        required
                    />
                    </div>
                )}

                {/* Botones */}
                <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={handleShow}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800"
                >
                    Cancelar
                </button>
                {
                    tipoModal === "actualizar" && (
                        <button
                            className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-800"
                            disabled={cargando}
                            onClick={validateEntries}
                        >
                            Actualizar
                        </button>
                    )
                }
                {
                    tipoModal === "registrar" && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
                            style={{
                                cursor: cargando ? "not-allowed" : "pointer",
                            }}
                            disabled={cargando}
                            onClick={validateEntries}
                        >
                            Guardar
                        </button>
                    )
                }
                {
                    tipoModal === "soli-actualizacion" && (
                        <button
                            className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-800"
                            disabled={cargando}
                            onClick={handleSubmit}
                        >
                            Solicitar actualización
                        </button>
                    )
                }
                </div>
            </div>
            {/* Modal de confirmación */}
            {(showConfirmModal && tipoModal !== "actualizar") && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Confirmar Acción</h2>
                        <p>¿Estás segur@ que deseas finalizar el mantenimiento?</p>
                        <p><strong>
                            No podras realizar cambios una vez finalizado
                        </strong></p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                            onClick={() => setShowConfirmModal(false)} // Cerrar el sub-modal
                            className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg hover:bg-gray-600"
                            >
                                No
                            </button>
                            <button
                            onClick={handleConfirmSave} // Confirmar y ejecutar guardar
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800"
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}  
        </div>
    )
}

ModalMantenimiento.propTypes = {
    info: PropTypes.object.isRequired,
    handleShow: PropTypes.func
}

export default ModalMantenimiento
