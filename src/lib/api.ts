const API_URL = "https://frontend-take-home-service.fetch.com";

const API_ENDPOINTS = {
  login: {
    url: `${API_URL}/auth/login`,
    method: "POST",
  },
  logout: {
    url: `${API_URL}/auth/logout`,
    method: "POST",
  },
};

const login = async (name: string, email: string) => {
  const response = await fetch(API_ENDPOINTS.login.url, {
    method: API_ENDPOINTS.login.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  return response.json();
};

export const API = {
  login,
};
