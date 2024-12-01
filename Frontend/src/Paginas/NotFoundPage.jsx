import React from 'react'
import { Link } from 'react-router-dom'
import { FaInfoCircle } from 'react-icons/fa'

const NotFoundPage = () => {
  return (
    <div
        className="bg-white flex-grow flex flex-col items-center justify-center h-screen"
        style={{
            background: '#bdc3c7',  /* Fallback for old browsers */
            background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)',  /* Chrome 10-25, Safari 5.1-6 */
            background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }}
    >
        <div className="flex justify-center">
            <FaInfoCircle className="w-32 h-32 m-3 bg-red-300 rounded-full p-2 text-6xl text-black"/>
        </div>

        <h1 className="text-4xl font-bold text-center mt-10">404</h1>
        <p className="text-2xl font-semibold text-center">Página no encontrada</p>

        <div className="flex justify-center mt-10">
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">Volver al inicio</Link>
        </div>
    </div>
  )
}

export default NotFoundPage