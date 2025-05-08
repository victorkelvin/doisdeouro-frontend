// Configuração para usar a URL pública no navegador do cliente
// e a URL interna para comunicação entre serviços no Railway
let BASE_URL;

// Adiciona logs para debug
console.log("Variáveis de ambiente disponíveis:");
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Verifica se estamos rodando no ambiente do cliente (navegador) ou servidor
if (typeof window !== 'undefined') {
  // No cliente (navegador), usamos a URL pública
  // REACT_APP_ é o prefixo padrão para Create React App
  BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  console.log("Rodando no navegador, BASE_URL definida como:", BASE_URL);
} else {
  // No servidor ou em ambiente de build, podemos usar a URL interna
  BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  console.log("Rodando no servidor, BASE_URL definida como:", BASE_URL);
}

const API_URL = `${BASE_URL}/api/`;
console.log("API_URL final:", API_URL);

const getToken = () => {
    return localStorage.getItem('token');
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;

    // Add a buffer of 30 seconds to prevent edge cases
    return new Date().getTime() > (parseInt(expiry) - 30000);
};

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_URL}token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access);

        // Update expiry time (15 minutes from now)
        const newExpiryTime = new Date().getTime() + 15 * 60 * 1000;
        localStorage.setItem('tokenExpiry', newExpiryTime);

        return data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
        return null;
    }
};

const logout = () => {
    window.localStorage.clear();
    window.location.href = '/login';
};

const handleResponse = async (response, retryCallback) => {

    if (!response.ok) {
        try {
            const errorData = await response.json();

            // If token is invalid and we have a refresh token, try to refresh and retry the request
            if (errorData.code === 'token_not_valid' && getRefreshToken()) {
                const newToken = await refreshAccessToken();
                if (newToken && retryCallback) {
                    return retryCallback(newToken);
                }
            }

            // If we get here, either refresh failed or another error occurred
            if (errorData.code === 'token_not_valid') {
                window.alert('Sessão expirada!');
                logout();
            }

            console.error('Error:', errorData);
            return errorData;
        } catch (error) {
            console.error('Error processing response:', error);
            return { error: 'Unable to process response' };
        }
    }
    return response.json();
};

const apiRequest = async (endpoint, method, body = null) => {
    // Check if token is expired before making the request
    if (isTokenExpired() && getRefreshToken()) {
        await refreshAccessToken();
    }

    const makeRequest = async (token) => {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token || getToken()}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(`${API_URL}${endpoint}`, options);
        return handleResponse(response, newToken => makeRequest(newToken));
    };

    return makeRequest( null );
};


const apiFormDataRequest = async (endpoint, method, formData) => {
    // Check if token is expired before making the request
    if (isTokenExpired() && getRefreshToken()) {
        await refreshAccessToken();
    }

    const makeRequest = async (token) => {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token || getToken()}`,
            },
            body: formData,
        };

        const response = await fetch(`${API_URL}${endpoint}`, options);
        return handleResponse(response, newToken => makeRequest(newToken));
    };

    return makeRequest();
};

const apiBlobHandler = async (endpoint, body) => {
    // Check if token is expired before making the request
    if (isTokenExpired() && getRefreshToken()) {
        await refreshAccessToken();
    }

    try {
        const makeRequest = async () => {
            const options = {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${ getToken()}`,
                  'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
            };
    
            const response = await fetch(`${API_URL}${endpoint}`, options);
            return response.blob(); // Return the blob directly
        };
    
        return makeRequest();
        
    } catch (error) {
        console.error('Error fetching blob:', error);
    }

}

export { apiRequest, apiFormDataRequest, logout, apiBlobHandler };