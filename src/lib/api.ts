const API_URL = "https://frontend-take-home-service.fetch.com";

const API_ENDPOINTS = {
  login: `${API_URL}/auth/login`,
};

const login = async (email: string, password: string) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

const fetchDogs = async () => {
  const response = await fetch(`${API_URL}/dogs`);
  return response.json();
};

export const API = {
  fetchDogs,
};
