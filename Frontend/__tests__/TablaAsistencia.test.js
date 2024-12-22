import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { TablaAsistencia } from "../src/components/Asistencia/TablaAsistencia";
import { HistoryProvider } from "../src/context/historyProvider";
import { MemoryRouter } from "react-router-dom";

// Mockear el HistoryContext
// jest.mock('../src/context/historyProvider', () => ({
//     HistoryProvider: ({ children }) => <div>{children}</div>, // Mockear el provider
//     useHistoryContext: jest.fn().mockReturnValue({
//         fetchAsistencias: jest.fn(),
//         seleccionado: null,
//         setSeleccionado: jest.fn(),
//         showModal: false,
//         handleModal: jest.fn(),
//         asistencias: [],
//         setAsistencias: jest.fn(),
//     }),
// }));

// jest.mock('../src/context/historyProvider', () => ({
//     ...jest.requireActual('../src/context/historyProvider'),
//     HistoryContext: createContext({
//         fetchAsistencias: jest.fn(),
//         seleccionado: null,
//         setSeleccionado: jest.fn(),
//         showModal: false,
//         handleModal: jest.fn(),
//         asistencias: [],
//         setAsistencias: jest.fn(),
//     }),
// }));


// Mockear el contexto
const usuarios = [
    {
        cedula: "1234567890",
        nombre: "Juan Pérez",
        telefono: "1234567890",
        cargo: "Técnico",
        asistencia: {
            fecha: "2021-10-01",
            hora_ingreso: "08:00",
            hora_salida: "17:00"
        }
    },
    {
        cedula: "1787654321",
        nombre: "María Rodríguez",
        telefono: "8765432167",
        cargo: "Gerente",
        asistencia: {
            fecha: "2021-10-01",
            hora_ingreso: "08:00",
            hora_salida: "17:00"
        }
    }
];

describe("TablaAsistencia", () => {
    beforeEach(() => {
        // Mockear localStorage
        jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "token") {
                return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mjk5ZTkzNDdiM2Y0MWU2MjgyYWJkZiIsImNhcmdvIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTczNDgyNzYzNSwiZXhwIjoxNzM0OTE0MDM1fQ.FgYk9WC5tNfzd89_wiycYoJ6gYNYdDYEj2NSgjJmNck"; // Retorna un token ficticio
            }
            return null;
        });
    });

    afterEach(() => {
        // Restaurar mocks
        jest.restoreAllMocks();
    });
    it("should render the table", () => {
        render(
            <>
                <MemoryRouter> 
                    <HistoryProvider>
                        <TablaAsistencia usuarios={usuarios} />
                    </HistoryProvider>
                </MemoryRouter>
            </>
        );
    
        const table = screen.getByRole("table");
        expect(table).toBeInTheDocument();
    });
    
    it("should display user data in the table", () => {
        render(
            <>
                <MemoryRouter>
                    <HistoryProvider>
                        <TablaAsistencia usuarios={usuarios} />
                    </HistoryProvider>
                </MemoryRouter>
            </>
        );
    
        // Comprobar que los nombres de los usuarios están en la tabla
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
        expect(screen.getByText("María Rodríguez")).toBeInTheDocument();
    
        // Comprobar que las cédulas están en la tabla
        expect(screen.getByText("123456789")).toBeInTheDocument();
        expect(screen.getByText("987654321")).toBeInTheDocument();
    });
});