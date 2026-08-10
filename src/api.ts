let refreshPromise: Promise<any> | null = null;
let userMeCache: { data: any; timestamp: number } | null = null;
let lastParentReport: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 600000; // 10 minutes cache TTL

export function clearUserMeCache() {
  userMeCache = null;
  try {
    localStorage.removeItem("userMeCache");
  } catch (e) {}
}

export function clearParentReportCache() {
  lastParentReport = null;
  try {
    localStorage.removeItem("parentReportCache");
  } catch (e) {}
}

export function clearAuthSession() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  sessionStorage.clear();
  clearUserMeCache();
  clearParentReportCache();
}

function redirectToLogin() {
  clearAuthSession();
  window.dispatchEvent(new Event("force-logout"));
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("userToken");
  const reqMethod = (options.method || "GET").toUpperCase();

  // Clear cache on any non-GET request (mutations) to avoid stale data
  if (reqMethod !== "GET") {
    clearUserMeCache();
    clearParentReportCache();
  }

  // Check cache for /api/users/me GET requests
  if (url === "/api/users/me" && reqMethod === "GET") {
    const now = Date.now();
    if (userMeCache && (now - userMeCache.timestamp < CACHE_TTL)) {
      return new Response(JSON.stringify(userMeCache.data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      const stored = localStorage.getItem("userMeCache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (now - parsed.timestamp < CACHE_TTL)) {
          userMeCache = parsed;
          return new Response(JSON.stringify(parsed.data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    } catch (e) {}
  }

  // Check cache for /api/parent/report GET requests
  const isReportRequest = (url.includes("/api/parent/report") || url.includes("parent/report")) && !url.includes("/report/download") && reqMethod === "GET";
  if (isReportRequest) {
    const now = Date.now();
    if (lastParentReport && (now - lastParentReport.timestamp < CACHE_TTL)) {
      return new Response(JSON.stringify(lastParentReport.data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      const stored = localStorage.getItem("parentReportCache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (now - parsed.timestamp < CACHE_TTL)) {
          lastParentReport = parsed;
          return new Response(JSON.stringify(parsed.data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    } catch (e) {}
  }
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const lang = localStorage.getItem("i18nextLng") || "en";
  headers.set("Accept-Language", lang);

  // Prevent browser/WebView caching on API requests
  if (reqMethod === "GET") {
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  }

  // Add 30-second timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

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

  // Cache successful GET /api/users/me responses
  if (url === "/api/users/me" && reqMethod === "GET" && response.status === 200) {
    try {
      const clone = response.clone();
      const json = await clone.json();
      userMeCache = { data: json, timestamp: Date.now() };
      try {
        localStorage.setItem("userMeCache", JSON.stringify(userMeCache));
      } catch (e) {}
    } catch (e) {}
  }

  // Cache successful GET /api/parent/report responses
  if (isReportRequest && response.status === 200) {
    try {
      const clone = response.clone();
      const json = await clone.json();
      const now = Date.now();
      lastParentReport = { data: json, timestamp: now };
      try {
        localStorage.setItem("parentReportCache", JSON.stringify(lastParentReport));
      } catch (e) {}
    } catch (e) {}
  }

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshController = new AbortController();
            const refreshTimeout = setTimeout(() => refreshController.abort(), 30000);
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
          const retryTimeout = setTimeout(() => retryController.abort(), 30000);
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
