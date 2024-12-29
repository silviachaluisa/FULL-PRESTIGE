import { render, screen, fireEvent } from "@testing-library/react";
import { TablaMantenimiento } from "../components/TablaMantenimiento"; // Ajusta la ruta según tu proyecto
import { HistoryContext } from "../../context/HistoryContext";
import AuthContext from "../../context/AuthProvider";

const mockMantenimientos = [
  {
    _id: "1",
    vehiculo: {
      propietario: {
        cedula: "1234567890",
        nombre: "Juan Pérez",
      },
      marca: "Toyota",
      modelo: "Corolla",
      placa: "ABC123",
      fecha_ingreso: "2023-12-20T00:00:00Z",
      fecha_salida: "2023-12-22T00:00:00Z",
    },
    descripcion: "Cambio de aceite",
    encargado: {
      nombre: "Carlos López",
    },
    estado: "Completado",
    costo: "50",
  },
  {
    _id: "2",
    vehiculo: {
      propietario: {
        cedula: "0987654321",
        nombre: "María Gómez",
      },
      marca: "Honda",
      modelo: "Civic",
      placa: "XYZ789",
      fecha_ingreso: "2023-12-21T00:00:00Z",
      fecha_salida: "2023-12-23T00:00:00Z",
    },
    descripcion: "Revisión general",
    encargado: {
      nombre: "Ana Torres",
    },
    estado: "Pendiente",
    costo: "100",
  },
];

describe("TablaMantenimiento", () => {
  const mockHistoryContext = {
    seleccionado: null,
    setSeleccionado: jest.fn(),
    showModal: false,
    handleModal: jest.fn(),
    setTipoModal: jest.fn(),
  };

  const mockAuthContext = {
    auth: { cargo: "Administrador" },
  };

  it("debería renderizar correctamente los encabezados", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HistoryContext.Provider value={mockHistoryContext}>
          <TablaMantenimiento mantenimientos={mockMantenimientos} />
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );

    const headers = [
      "Cédula",
      "Nombre/Apellido",
      "Marca",
      "Modelo",
      "Placa",
      "Fecha Ingreso",
      "Fecha Salida",
      "Descripción del trabajo",
      "Técnico Responsable",
      "Estado",
      "Costo",
      "Opciones",
    ];

    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("debería renderizar los datos correctamente", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HistoryContext.Provider value={mockHistoryContext}>
          <TablaMantenimiento mantenimientos={mockMantenimientos} />
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("50$")).toBeInTheDocument();
  });

  it("debería llamar a setSeleccionado y abrir el modal al hacer clic en una fila", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HistoryContext.Provider value={mockHistoryContext}>
          <TablaMantenimiento mantenimientos={mockMantenimientos} />
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );

    const fila = screen.getByText("Juan Pérez").closest("tr");
    fireEvent.click(fila);

    expect(mockHistoryContext.setSeleccionado).toHaveBeenCalledWith(mockMantenimientos[0]);
  });

  it("debería mostrar las opciones de administrador", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HistoryContext.Provider value={mockHistoryContext}>
          <TablaMantenimiento mantenimientos={mockMantenimientos} />
        </HistoryContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId("edit_client")).toBeInTheDocument();
  });
});
