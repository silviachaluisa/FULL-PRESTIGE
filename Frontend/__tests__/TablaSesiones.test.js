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
                _id: '123',
                dispositivo: 'Chrome en Windows',
                fecha: '2024-12-27T02:00:00Z',
                token: 'mockToken',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar que la sesión se renderiza correctamente
        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('Chrome en Windows')).toBeInTheDocument();
        expect(screen.getByText('2024-12-27')).toBeInTheDocument();
        expect(screen.getByText('02:00')).toBeInTheDocument();

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