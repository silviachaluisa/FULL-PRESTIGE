import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import  TablaSesiones  from '../src/components/Sesiones/TablaSesiones'; // Importar el componente a probar
import AuthContext from '../src/context/AuthProvider';  // Importar el contexto de autenticación
import '@testing-library/jest-dom'; 
import { MemoryRouter } from 'react-router-dom';

describe('TablaSesiones Component', () => {
    const mockCloseSession = jest.fn();

    // Mock del contexto
    const renderWithContext = (ui, { providerValue }) => {
        return render(
            <AuthContext.Provider value={providerValue}>
                <MemoryRouter>{ui}</MemoryRouter>
            </AuthContext.Provider>
        );
    };

    test('debería mostrar "No existen sesiones activas" cuando no hay sesiones', () => {
        renderWithContext(<TablaSesiones sesiones={[]} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        expect(screen.getByText('No existen sesiones activas.')).toBeInTheDocument();
    });

    test('debería renderizar las sesiones y permitir cerrar una sesión', () => {
        const sesionesMock = [
            {
                _id: '676e0e02feea69cac6e79d4e',
                dispositivo: 'Android 6.0 - Mobile Chrome 131.0.0.0',
                createdAt: '2024-12-27T02:16:34.659+00:00',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mjk5ZTkzNDdiM2Y0MWU2MjgyYWJkZiIsImNhcmdvIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTczNTI2NTc5NCwiZXhwIjoxNzM1MzUyMTk0fQ.qi69INHirWR1EkzVeTRd-q1RG9lMQn41wKC7X-FVdDU',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar que la sesión se renderiza correctamente
        expect(screen.getByText('676e0e02feea69cac6e79d4e')).toBeInTheDocument();
        expect(screen.getByText('Android 6.0 - Mobile Chrome 131.0.0.0')).toBeInTheDocument();
        expect(screen.getByText('2024-12-27T02:16:34.659+00:00')).toBeInTheDocument();
        expect(screen.getByText('02:16')).toBeInTheDocument();

        // Simular clic en el botón para cerrar sesión
        const deleteButton = screen.getByRole('button', { name: /Cerrar sesión/i });
        fireEvent.click(deleteButton);

        // Verificar que se llama la función de cerrar sesión
        expect(mockCloseSession).toHaveBeenCalledWith('123', 'mockToken');
    });

    test('debería formatear correctamente la fecha y hora', () => {
        const sesionesMock = [
            {
                _id: '456',
                dispositivo: 'Firefox en Linux',
                fecha: '2024-12-27T00:45:00Z',
                token: 'mockToken2',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar formato de fecha
        expect(screen.getByText('2024-12-27')).toBeInTheDocument();

        // Verificar formato de hora
        expect(screen.getByText('00:45')).toBeInTheDocument();
    });
});