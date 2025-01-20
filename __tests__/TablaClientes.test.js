import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { TablaClientes } from "../src/components/Clientes/TablaClientes";
import { HistoryProvider } from "../src/context/historyProvider";
import { AuthProvider } from "../src/context/AuthProvider";
import AuthContext from "../src/context/AuthProvider"; // Importa el contexto original
import { MemoryRouter } from "react-router-dom";
import React from "react";

// Datos de prueba
const clientes = [
  {
    propietario: {
      cedula: "1724432251",
      nombre: "Juan Pérez",
      telefono: "0978365421",
      correo: "juan@correo.com",
      direccion: "Calle 123 # 45-67",
    },
    n_orden: "001",
    marca: "Toyota",
    modelo: "Corolla",
    placa: "ABC123",
    fecha_ingreso: "2023-10-01",
    fecha_salida: "2023-10-05",
    estado: "Activo",
  },
  {
    propietario: {
      cedula: "1787654321",
      nombre: "María Rodríguez",
      telefono: "0998453623",
      correo: "maria@correo.com",
      direccion: "Carrera 45 # 67-89",
    },
    n_orden: "002",
    marca: "Honda",
    modelo: "Civic",
    placa: "XYZ456",
    fecha_ingreso: "2023-11-01",
    fecha_salida: "2023-11-07",
    estado: "Finalizado",
  },
];

describe("TablaClientes", () => {
  beforeEach(() => {
    // Mockear localStorage
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Mjk5ZTkzNDdiM2Y0MWU2MjgyYWJkZiIsImNhcmdvIjoiQWRtaW5pc3RyYWRvciIsImlhdCI6MTczNDgyNzYzNSwiZXhwIjoxNzM0OTE0MDM1fQ.FgYk9WC5tNfzd89_wiycYoJ6gYNYdDYEj2NSgjJmNck"; // Retorna un token ficticio
      }
      return null;
    });

    // Mockear el componente AuthContext
    jest.mock("../src/context/AuthProvider", () => ({
      AuthProvider: ({ children }) => children,
      useAuth: () => ({ auth: { cargo: "Técnico" } }),
    }));
  });

  afterEach(() => {
    // Restaurar mocks
    jest.restoreAllMocks();
  });

  it("should render the table", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("should display user data in the table", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Comprobar que los nombres de los clientes están en la tabla
    expect(screen.getByText((content, element) => content.includes("Juan Pérez"))).toBeInTheDocument();
    expect(screen.getByText("María Rodríguez")).toBeInTheDocument();

    // Comprobar que las cédulas están en la tabla
    expect(screen.getByText("1724432251")).toBeInTheDocument();
    expect(screen.getByText("1787654321")).toBeInTheDocument();

    // Comprobar que la fecha de ingreso está en el formato correcto
    expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    expect(screen.getByText("2023-11-01")).toBeInTheDocument();
  });

  it("should filter clients by selected month", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  
    // Seleccionar el mes de octubre
    const inputMes = screen.getByTestId("mes");
    fireEvent.change(inputMes, { target: { value: "2023-10" } });
  
    // Debug del DOM
    screen.debug();
  
    // Verificar la presencia del cliente correspondiente
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.queryByText((content, element) => content.includes("María Rodríguez"))).not.toBeInTheDocument();
  });
  

  it("should show 'No existen registros' when no clients match the selected month", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Seleccionar un mes que no tenga registros
    fireEvent.change(screen.getByTestId("mes"), { target: { value: "2023-09" } });

    // Verificar el mensaje de no registros
    expect(screen.getByText("No existen registros para el mes seleccionado.")).toBeInTheDocument();
  });

  it("should call handleRowClick when a row is clicked", () => {
    const handleRowClickMock = jest.fn();
    render(
      <MemoryRouter>
        <AuthProvider value={{ auth: { cargo: "Administrador" } }}>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Simular el clic en la fila
    fireEvent.click(screen.getByText("Juan Pérez"));

    // Verificar si la fila fue clickeada (cambiada de color)
    expect(screen.getByText("Juan Pérez").parentElement).toHaveClass("bg-gray-300");
  });

  it("should display edit icon for administrators", () => {
    const mockAuth = { cargo: "Administrador" }; // Mock del valor de auth

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ auth: mockAuth }}>
          <HistoryProvider>
            <TablaClientes clientes={clientes} />
          </HistoryProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Verificar que el ícono de editar está presente
    const elements = screen.getAllByTestId("edit_client");
    expect(elements).toHaveLength(2);
  });
});