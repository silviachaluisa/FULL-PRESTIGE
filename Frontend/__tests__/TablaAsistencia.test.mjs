import { createContext } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
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

jest.mock('../src/context/historyProvider', () => ({
    ...jest.requireActual('../src/context/historyProvider'),
    HistoryContext: createContext({
        fetchAsistencias: jest.fn(),
        seleccionado: null,
        setSeleccionado: jest.fn(),
        showModal: false,
        handleModal: jest.fn(),
        asistencias: [],
        setAsistencias: jest.fn(),
    }),
}));


// Mockear el contexto
const usuarios = [
    {
        cedula: "123456789",
        nombre: "Juan Pérez",
        telefono: "12345678",
        cargo: "Técnico",
    },
    {
        cedula: "987654321",
        nombre: "María Rodríguez",
        telefono: "87654321",
        cargo: "Gerente",
    }
];

describe("TablaAsistencia", () => {
    it("should render the table", () => {
        render(
            <MemoryRouter>  
                <HistoryProvider>
                    <TablaAsistencia usuarios={usuarios} />
                </HistoryProvider>
            </MemoryRouter>
        );
    
        const table = screen.getByRole("table");
        expect(table).toBeInTheDocument();
    });
    it("should display user data in the table", () => {
        render(
            <MemoryRouter>
                <HistoryProvider>
                    <TablaAsistencia usuarios={usuarios} />
                </HistoryProvider>
            </MemoryRouter>
        );
    
        // Comprobar que los nombres de los usuarios están en la tabla
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
        expect(screen.getByText("María Rodríguez")).toBeInTheDocument();
    
        // Comprobar que las cédulas están en la tabla
        expect(screen.getByText("123456789")).toBeInTheDocument();
        expect(screen.getByText("987654321")).toBeInTheDocument();
    });
});