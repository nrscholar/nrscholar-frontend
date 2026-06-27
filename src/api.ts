export async function apiFetch(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("userToken");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const lang = localStorage.getItem("i18nextLng") || "en";
  headers.set("Accept-Language", lang);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const refreshResponse = await fetch("/api/users/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });
        
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          token = refreshData.data.token;
          localStorage.setItem("userToken", token!);
          localStorage.setItem("refreshToken", refreshData.data.refreshToken);
          
          headers.set("Authorization", `Bearer ${token}`);
          response = await fetch(url, { ...options, headers });
        } else {
          // Refresh failed, clear tokens
          localStorage.removeItem("userToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (e) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    } else {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }
  }

  return response;
}
