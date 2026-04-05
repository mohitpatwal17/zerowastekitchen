const BASE_URL = "http://localhost:8000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Specific API methods
export const api = {
  items: {
    getAll: () => apiFetch("/items"),
    create: (data: any) => apiFetch("/items", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) => apiFetch(`/items/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => apiFetch(`/items/${id}`, { method: "DELETE" }),
  },
  waste: {
    getLogs: () => apiFetch("/waste"),
    log: (data: any) => apiFetch("/waste/log", { method: "POST", body: JSON.stringify(data) }),
  },
  shopping: {
    get: () => apiFetch("/shopping"),
    add: (data: any) => apiFetch("/shopping/add", { method: "POST", body: JSON.stringify(data) }),
    generateSmart: () => apiFetch("/shopping/generate_smart", { method: "POST" }),
    updateItem: (id: number, data: any) => apiFetch(`/shopping/item/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },
  analytics: {
    getImpact: () => apiFetch("/analytics/impact"),
  },
  insights: {
    getBehavioral: () => apiFetch("/insights/behavioral"),
  },
  planner: {
    getSuggestions: () => apiFetch("/planner/suggestions"),
    consult: (data: any) => apiFetch("/planner/consult", { method: "POST", body: JSON.stringify(data) }),
    portionCheck: (data: any) => apiFetch("/planner/portion-check", { method: "POST", body: JSON.stringify(data) }),
  }
};
