const API_BASE = "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("gymgenie_token");
  

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
