import { render, screen, fireEvent } from "@testing-library/react";
import { TablaUsuarios } from "./TablaUsuarios";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { HistoryContext } from "../../context/HistoryContext";

describe("TablaUsuarios", () => {
  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  const usuarios = [
    {
      cedula: "1234567890",
      nombre: "Juan Pérez",
      telefono: "0987654321",
      correo: "juan@example.com",
      direccion: "Av. Siempre Viva 123",
      cargo: "Técnico",
      estado: "Activo",
    },
    {
      cedula: "0987654321",
      nombre: "María López",
      telefono: "0987654321",
      correo: "maria@example.com",
      direccion: "Calle Falsa 456",
      cargo: "Administrador",
      estado: "Inactivo",
    },
  ];

  const mockSetSeleccionado = jest.fn();

  const renderComponent = (auth) => {
    render(
      <AuthContext.Provider value={{ auth }}>
        <HistoryContext.Provider value={{
          seleccionado: null,
          setSeleccionado: mockSetSeleccionado,
        }}>
          <MemoryRouter>
            <TablaUsuarios usuarios={usuarios} />
          </MemoryRouter>
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("debería renderizar los encabezados correctamente", () => {
    renderComponent({ cargo: "Administrador" });

    const headers = [
      "Cédula",
      "Nombre y Apellido",
      "Telefono",
      "Email",
      "Dirección",
      "Cargo",
      "Estado",
      "Opciones",
    ];

    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("debería mostrar la columna 'Opciones' solo para administradores", () => {
    renderComponent({ cargo: "Administrador" });
    expect(screen.getByText("Opciones")).toBeInTheDocument();

    renderComponent({ cargo: "Técnico" });
    expect(screen.queryByText("Opciones")).not.toBeInTheDocument();
  });

  it("debería manejar el clic en una fila y actualizar el contexto", () => {
    renderComponent({ cargo: "Administrador" });

    const row = screen.getByText("Juan Pérez").closest("tr");
    fireEvent.click(row);

    expect(mockSetSeleccionado).toHaveBeenCalledWith(usuarios[0]);
  });

  it("debería navegar a la página de edición al hacer clic en el ícono de lápiz", () => {
    renderComponent({ cargo: "Administrador" });

    const pencilIcon = screen.getAllByRole("button")[0];
    fireEvent.click(pencilIcon);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/dashboard/actualizar-usuarios/${usuarios[0].cedula}`
    );
  });
});
