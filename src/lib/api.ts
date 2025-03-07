const API_URL = "https://frontend-take-home-service.fetch.com";

const login = async (name: string, email: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }
};

const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
};

const breeds = async () => {
  const response = await fetch(`${API_URL}/dogs/breeds`);
  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }

  return response.json();
};

export const api = {
  auth: {
    login,
    logout,
  },
  dogs: {
    breeds,
  },
};
