let refreshPromise: Promise<any> | null = null;

function redirectToLogin() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("force-logout"));
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("userToken");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const lang = localStorage.getItem("i18nextLng") || "en";
  headers.set("Accept-Language", lang);

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (e) {
    console.error("Network error", e);
    // Return a fake response to avoid crashing UI components
    return new Response(JSON.stringify({ success: false, message: "Network Error" }), { status: 503, headers: { "Content-Type": "application/json" }});
  }

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = fetch("/api/users/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          }).then(res => res.json()).finally(() => { refreshPromise = null; });
        }
        
        const refreshData = await refreshPromise;
        if (refreshData && refreshData.success) {
          token = refreshData.data.token;
          localStorage.setItem("userToken", token!);
          localStorage.setItem("refreshToken", refreshData.data.refreshToken);
          
          headers.set("Authorization", `Bearer ${token}`);
          response = await fetch(url, { ...options, headers });
        } else {
          redirectToLogin();
        }
      } catch (e) {
        redirectToLogin();
      }
    } else {
      redirectToLogin();
    }
  }

  return response;
}
