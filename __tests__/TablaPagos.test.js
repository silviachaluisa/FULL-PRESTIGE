import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TablaPago } from "../src/components/Pagos/TablaPago";
import { HistoryContext } from "../src/context/HistoryContext";

// Mock para el componente ModalPago
jest.mock("../src/components/Modals/ModalPago", () => ({
  ModalPago: ({ handleShow, usuario }) => (
    <div data-testid="modal-pago">
      Modal abierto para: {usuario?.nombre || "N/A"}
      <button onClick={handleShow}>Cerrar</button>
    </div>
  ),
}));

describe("Componente TablaPago", () => {
  const mockFetchPagos = jest.fn();
  const mockHandleModal = jest.fn();
  const mockSetSeleccionado = jest.fn();
  const mockSetPagos = jest.fn();

  const contextValue = {
    fetchPagos: mockFetchPagos,
    seleccionado: null,
    setSeleccionado: mockSetSeleccionado,
    showModal: false,
    handleModal: mockHandleModal,
    pagos: [],
    setPagos: mockSetPagos,
  };

  const mockUsuarios = [
    {
      cedula: '1234567890',
      nombre: 'Juan Perez',
      pago: { fecha: '2023-01-01', adelanto: 50 },
     
    }
  ];
  
  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente los encabezados de la tabla", () => {
    render(
      <HistoryContext.Provider value={contextValue}>
        <TablaPago usuarios={mockUsuarios} />
      </HistoryContext.Provider>
    );
  
    const headers = ["Cédula", "Nombre y Apellido", "Fecha", "Adelantos", "Permisos", "Multas", "Atrasos", "Subtotal"];
    const headerElements = screen.getAllByRole('columnheader');// Selecciona todos los <th>
  
    headers.forEach((header, index) => {
      expect(headerElements[index]).toHaveTextContent(header);
    });
  });
  

  it("debe llamar a fetchPagos cuando se monta el componente", async () => {
    mockFetchPagos.mockResolvedValueOnce([]); // Mock de una respuesta vacía

    render(
      <HistoryContext.Provider value={contextValue}>
        <TablaPago usuarios={mockUsuarios} />
      </HistoryContext.Provider>
    );

    await waitFor(() => {
      expect(mockFetchPagos).toHaveBeenCalledTimes(mockUsuarios.length);
    });
  });

  it("debe manejar el clic en una fila", () => {
    render(
      <HistoryContext.Provider
        value={{
          ...contextValue,
          pagos: [
            {
              cedula: "1234567890",
              nombre: "Juan Perez",
              pago: { fecha: "2023-01-01", adelanto: 50 },
            },
          ],
        }}
      >
        <TablaPago usuarios={mockUsuarios} />
      </HistoryContext.Provider>
    );

    const row = screen.getByText("Juan Perez").closest("tr");
    fireEvent.click(row);

    expect(mockSetSeleccionado).toHaveBeenCalledWith({
      cedula: "1234567890",
      nombre: "Juan Perez",
      pago: { fecha: "2023-01-01", adelanto: 50 },
    });
  });

  it("debe mostrar el modal cuando showModal es true", () => {
    render(
      <HistoryContext.Provider
        value={{
          ...contextValue,
          showModal: true,
          seleccionado: { nombre: "Juan Perez" },
        }}
      >
        <TablaPago usuarios={mockUsuarios} />
      </HistoryContext.Provider>
    );

    expect(screen.getByTestId("modal-pago")).toBeInTheDocument();
    expect(screen.getByText("Modal abierto para: Juan Perez")).toBeInTheDocument();
  });
});
