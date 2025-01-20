import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { TablaAsistencia } from "../src/components/Asistencia/TablaAsistencia";
import { HistoryProvider } from "../src/context/historyProvider";
import { MemoryRouter } from "react-router-dom";

// Mockear el contexto
const usuarios = [
    {
        cedula: "1724432251",
        nombre: "Juan Pérez",
        telefono: "0978365421",
        cargo: "Técnico",
        direccion: "Calle 123 # 45-67",
        asistencias: [{
            fecha: "2021-10-01",
            hora_ingreso: "08:00",
            hora_salida: "17:00",
            estado: "Ausente"
        }]
    },
    {
        cedula: "1787654321",
        nombre: "María Rodríguez",
        telefono: "0998453623",
        cargo: "Gerente",
        direccion: "Carrera 45 # 67-89",
        asistencias: [{
            fecha: "2021-10-01",
            hora_ingreso: "08:00",
            hora_salida: "17:00",
            estado: "Justificado"
        }]
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
        expect(screen.getByText("1724432251")).toBeInTheDocument();
        expect(screen.getByText("1787654321")).toBeInTheDocument();
    });
});