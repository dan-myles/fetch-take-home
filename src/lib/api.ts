import { Dog, StateAbbreviation } from "./types";

const API_URL = "https://frontend-take-home-service.fetch.com";

const auth_login = async (name: string, email: string) => {
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

const auth_logout = async () => {
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

const dog_breeds = async () => {
  const response = await fetch(`${API_URL}/dogs/breeds`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }

  const data: string[] = await response.json();
  return data;
};

type SortOptions = "breed" | "name" | "age";
type SortDirection = "asc" | "desc";
type Sort = `${SortOptions}:${SortDirection}`;

export type DogSearchParams = {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;

  // Pagination Options
  size?: string; // Size of Query
  from?: string; // Pagination
  sort?: Sort; // Ascending or Descending
};

export type DogSearchResult = {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
};

const dog_search = async (params: DogSearchParams) => {
  const searchParams = new URLSearchParams();

  if (params.breeds && params.breeds.length > 0) {
    params.breeds.forEach(breed => {
      searchParams.append("breeds", breed);
    });
  }
  if (params.zipCodes && params.zipCodes.length > 0) {
    searchParams.append("zipCodes", params.zipCodes.join(","));
  }
  if (params.ageMin) {
    searchParams.append("ageMin", params.ageMin.toString());
  }
  if (params.ageMax) {
    searchParams.append("ageMax", params.ageMax.toString());
  }
  if (params.size && params.size !== "") {
    searchParams.append("size", params.size);
  }
  if (params.sort) {
    searchParams.append("sort", params.sort);
  }
  if (params.from && params.from !== "") {
    searchParams.append("from", params.from);
  }

  const response = await fetch(`${API_URL}/dogs/search?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }

  const data: DogSearchResult = await response.json();
  return data;
};

type DogGetParams = {
  ids: string[];
};

const dog_get = async (params: DogGetParams) => {
  if (params.ids.length >= 100) {
    throw new Error("Too many dogs requested");
  }

  const response = await fetch(`${API_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.ids),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }

  const data: Dog[] = await response.json();
  return data;
};

type DogMatchParams = {
  ids: string[];
};

type DogMatchResult = {
  match: string;
};

const dog_match = async (params: DogMatchParams) => {
  const response = await fetch(`${API_URL}/dogs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.ids),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch breeds");
  }

  const data: DogMatchResult = await response.json();
  return data;
};

type LocationParams = {
  zipCodes: string[];
};

const locations_get = async (params: LocationParams) => {
  const response = await fetch(`${API_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.zipCodes),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const data: Location[] = await response.json();
  return data;
};

type LocationSearchParams = {
  city: string;
  states: StateAbbreviation[];
  geoBoundingBox: object;

  // Pagination Options
  size?: number;
  from?: number;
};

type LocationSearchResult = {
  results: Location[];
  total: number;
};

const locations_search = async (params: LocationSearchParams) => {
  const response = await fetch(`${API_URL}/locations/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const data: LocationSearchResult = await response.json();
  return data;
};

export const api = {
  auth: {
    login: auth_login,
    logout: auth_logout,
  },
  dogs: {
    breeds: dog_breeds,
    search: dog_search,
    get: dog_get,
    match: dog_match,
  },
  locations: {
    get: locations_get,
    search: locations_search,
  },
};
