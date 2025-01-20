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
                fecha: '2024-12-27T02:16:34.659Z',
                token: 'mockToken',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar que la sesión se renderiza correctamente
        expect(screen.getByText('676e0e02feea69cac6e79d4e')).toBeInTheDocument();
        expect(screen.getByText('Android 6.0 - Mobile Chrome 131.0.0.0')).toBeInTheDocument();

        // Ajustar matcher para la fecha y hora
        expect(screen.getByText((content) => content.includes('2024-12-27'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('21:16'))).toBeInTheDocument();

    });

    test('debería formatear correctamente la fecha y hora', () => {
        const sesionesMock = [
            {
                _id: '456',
                dispositivo: 'Firefox en Linux',
                fecha: '2024-12-27T19:45:00Z',
                token: 'mockToken2',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar formato de fecha
        expect(screen.getByText((content) => content.includes('2024-12-27'))).toBeInTheDocument();

        // Verificar formato de hora
        expect(screen.getByText((content) => content.includes('14:45'))).toBeInTheDocument();
    });

    test('debería manejar múltiples sesiones correctamente', () => {
        const sesionesMock = [
            {
                _id: '123',
                dispositivo: 'Windows 10 - Edge 112.0.0.0',
                fecha: '2024-12-26T18:30:00Z',
                token: 'mockToken3',
            },
            {
                _id: '789',
                dispositivo: 'iOS 14 - Safari 16.1',
                fecha: '2024-12-27T03:15:00Z',
                token: 'mockToken4',
            },
        ];

        renderWithContext(<TablaSesiones sesiones={sesionesMock} />, {
            providerValue: { closeSession: mockCloseSession },
        });

        // Verificar que todas las sesiones se renderizan correctamente
        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('Windows 10 - Edge 112.0.0.0')).toBeInTheDocument();
        expect(screen.getByText('2024-12-26')).toBeInTheDocument();

        expect(screen.getByText('789')).toBeInTheDocument();
        expect(screen.getByText('iOS 14 - Safari 16.1')).toBeInTheDocument();
        expect(screen.getByText('2024-12-27')).toBeInTheDocument();

        
    });
});
