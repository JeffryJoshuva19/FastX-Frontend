const BASE_URL = "http://localhost:5227/api"; // backend base URL

export const apiFetch = async (url, options = {}) => {
  const token = sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error("❌ API error:", response.status, data);
      throw new Error(
        typeof data === "string" && data.trim() !== "" ? data : "API request failed"
      );
    }

    return data;
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
    throw err;
  }
};
