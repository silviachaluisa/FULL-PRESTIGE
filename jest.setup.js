import '@testing-library/jest-dom'; 

// jest.setup.js
globalThis.import = {
    meta: {
        env: {
            VITE_BACKEND_URL: 'http://localhost:3000/api/v1', 
        },
    },
};
