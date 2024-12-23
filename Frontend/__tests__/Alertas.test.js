import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import Mensaje from "../src/components/Alertas";

describe("Mensaje", () => {
    it("should render a success message", () => {
        const mensaje = "Operación exitosa";
        const tipo = true;
        render(<Mensaje mensaje={mensaje} tipo={tipo} />);
        const mensajeElemento = screen.getByText(mensaje);
        expect(mensajeElemento).toBeInTheDocument();
        expect(mensajeElemento).toHaveClass("text-green-600");
    });
});
