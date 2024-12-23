import '@testing-library/jest-dom'; // Extiende los matchers de Jest

// jest.setup.js
globalThis.import = {
    meta: {
        env: {
            VITE_BACKEND_URL: 'http://localhost:3000/api/v1', // Ajusta según tus necesidades
        },
    },
};
