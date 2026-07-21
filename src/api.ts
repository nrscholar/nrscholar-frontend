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

  // Prevent browser/WebView caching on API requests
  const reqMethod = (options.method || "GET").toUpperCase();
  if (reqMethod === "GET") {
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  }

  // Add 10-second timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
  } catch (e) {
    clearTimeout(timeoutId);
    console.error("Network error", e);
    // Return a fake response to avoid crashing UI components
    return new Response(JSON.stringify({ success: false, message: "Network Error" }), { status: 503, headers: { "Content-Type": "application/json" }});
  }

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshController = new AbortController();
            const refreshTimeout = setTimeout(() => refreshController.abort(), 10000);
            try {
              const res = await fetch("/api/users/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
                signal: refreshController.signal
              });
              clearTimeout(refreshTimeout);
              if (!res.ok) return { success: false };
              return await res.json();
            } catch (err) {
              clearTimeout(refreshTimeout);
              console.error("Refresh token request failed", err);
              return { success: false };
            } finally {
              refreshPromise = null;
            }
          })();
        }
        
        const refreshData = await refreshPromise;
        if (refreshData && refreshData.success) {
          token = refreshData.data.token;
          localStorage.setItem("userToken", token!);
          localStorage.setItem("refreshToken", refreshData.data.refreshToken);
          
          headers.set("Authorization", `Bearer ${token}`);
          
          // Re-fetch with timeout
          const retryController = new AbortController();
          const retryTimeout = setTimeout(() => retryController.abort(), 10000);
          try {
            response = await fetch(url, { ...options, headers, signal: retryController.signal });
            clearTimeout(retryTimeout);
          } catch (e) {
            clearTimeout(retryTimeout);
            return new Response(JSON.stringify({ success: false, message: "Network Error on Retry" }), { status: 503, headers: { "Content-Type": "application/json" }});
          }
        } else {
          redirectToLogin();
        }
      } catch (e) {
        redirectToLogin();
      }
    } else {
      redirectToLogin();
    }
  } else if (response.status === 404) {
    try {
      const clone = response.clone();
      const body = await clone.json();
      if (body.detail === "User not found" || body.message === "User not found") {
        redirectToLogin();
      }
    } catch (err) {
      // Ignore JSON parsing errors for generic 404s
    }
  }

  return response;
}
