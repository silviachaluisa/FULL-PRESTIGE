import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import Login from "../src/Paginas/Login";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthProvider";

describe("Mensaje", () => {
    it("should render a success message", () => {
        render(
            <>
                <MemoryRouter>
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                </MemoryRouter>
            </>
        );
        expect(screen.getByText("Inicio de sesión exitoso")).toBeInTheDocument();
    });
});
