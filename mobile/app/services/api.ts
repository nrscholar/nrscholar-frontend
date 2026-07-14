// services/api.ts
// Central API service — wraps fetch with base URL, auth headers, and error handling.
// All screens import from here instead of calling fetch directly.

import * as SecureStore from "expo-secure-store";

// ── Config ────────────────────────────────────────────────────────────────────
// On physical Android/iOS devices, 'localhost' refers to the device itself.
// We use your machine's local IP address (extracted from Expo logs) to connect to the backend.
import { Platform } from "react-native";

export const BASE_URL = "https://nrscholar-backend.onrender.com";

const TOKEN_KEY = "nrscholar_token";

// ── Token helpers ─────────────────────────────────────────────────────────────

export const saveToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
  auth?: boolean; // Attach Bearer token if true
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export async function apiRequest<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, auth = false } = options;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true", // Required to skip the localtunnel warning HTML screen on first request
    };

    if (auth) {
      const token = await getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`[API CALL] ${method} ${BASE_URL}${path}`);
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json: ApiResponse<T> = await response.json();
    return json;
  } catch (error: any) {
    console.error(`[API ERROR] ${path}:`, error.message);
    return {
      success: false,
      message: "Network error or server is down.",
    };
  }
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export interface AuthData {
  token: string;
  user: {
    id: string;
    fullName: string;
    mobile: string;
    childName: string | null;
    childAge: number | null;
    childClass: string | null;
    role: string;
    totalStars: number;
    streakDays: number;
  };
}

export const authApi = {
  login: (mobile: string, password: string) =>
    apiRequest<AuthData>("/api/users/login", {
      method: "POST",
      body: { mobile, password },
    }),

  signup: (data: {
    fullName: string;
    mobile: string;
    password: string;
    childName?: string;
    childAge?: number;
    childClass?: string;
  }) =>
    apiRequest<AuthData>("/api/users/signup", {
      method: "POST",
      body: data,
    }),

  getMe: () =>
    apiRequest("/api/users/me", { auth: true }),

  updateProfile: (data: { fullName?: string, childName?: string, childAge?: number, childClass?: string }) =>
    apiRequest("/api/users/profile", { method: "PUT", auth: true, body: data }),

  updateStats: (data: { coins?: number; fuel?: number; level?: number }) =>
    apiRequest("/api/users/stats", { method: "PUT", auth: true, body: data }),
};

// ── Dashboard API ─────────────────────────────────────────────────────────────

export interface DashboardData {
  greeting: {
    name: string;
    streakMessage: string;
  };
  progress: {
    completedPercent: number;
    activitiesCompleted: number;
    activitiesTotal: number;
    subjects: string[];
    message: string;
  };
  rewards: {
    totalStars: number;
    streakDays: number;
    nextBadge: string;
  };
  challenge: {
    title: string;
    description: string;
    xpReward: number;
    bonusStars: number;
    type: string;
  } | null;
}

export interface SubjectData {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ChapterData {
  _id: string;
  name: string;
  order: number;
}

export interface QuestionData {
  _id: string;
  sceneType?: string;
  title?: string;
  teacherNarration?: string;
  interaction?: {
    type: string;
    details?: {
      question?: string;
      options?: string[];
      answer?: string;
      initialCount?: number;
      targetCount?: number;
      draggablesCount?: number;
      objectEmoji?: string;
    };
  };
  reward?: {
    xp: number;
    coins: number;
  };
  metadata?: {
    imageUrl?: string;
  };
  // Fallback for old data format
  question?: string;
  options?: string[];
  answer?: string;
  type?: string;
}

export const practiceApi = {
  getSubjects: (classLevel?: number) =>
    apiRequest<SubjectData[]>(`/api/practice/subjects${classLevel ? `?classLevel=${classLevel}` : ""}`, { auth: true }),
    
  getChapters: (subjectId: string) =>
    apiRequest<ChapterData[]>(`/api/practice/chapters/${subjectId}`, { auth: true }),
    
  getQuestions: (chapterId: string) =>
    apiRequest<QuestionData[]>(`/api/practice/questions/${chapterId}`, { auth: true }),
    
  submitResult: (chapterId: string, totalQuestions: number, correctAnswers: number, incorrectQuestions: any[]) =>
    apiRequest("/api/practice/submit", {
      method: "POST",
      auth: true,
      body: { chapterId, totalQuestions, correctAnswers, incorrectQuestions },
    }),
  
  getDashboardStats: () =>  
    apiRequest("/api/practice/stats", { auth: true })
};

// ── Parent API ────────────────────────────────────────────────────────────────

export const parentApi = {
  getControls: () =>
    apiRequest("/api/parent/controls", { auth: true }),

  updateControls: (data: { allowReels?: boolean; allowChat?: boolean; screenTimeMinutes?: number }) =>
    apiRequest("/api/parent/controls", { method: "PUT", auth: true, body: data }),

  setPin: (pin: string) =>
    apiRequest("/api/parent/set-pin", { method: "POST", auth: true, body: { pin } }),

  verifyPin: (pin: string) =>
    apiRequest("/api/parent/verify-pin", { method: "POST", auth: true, body: { pin } }),

  getReport: () =>
    apiRequest("/api/parent/report", { auth: true }),

  getGlobalExamResult: () =>
    apiRequest("/api/parent/global-exam", { auth: true }),

  getPlans: () =>
    apiRequest("/api/parent/plans", { auth: true }),

  subscribe: (planId: string) =>
    apiRequest("/api/parent/subscribe", { method: "POST", auth: true, body: { planId } }),

  getTickets: () =>
    apiRequest("/api/parent/support", { auth: true }),

  createTicket: (subject: string, message: string, category: string) =>
    apiRequest("/api/parent/support", { method: "POST", auth: true, body: { subject, message, category } }),

  resetJourney: () =>
    apiRequest("/api/parent/reset-journey", { method: "POST", auth: true }),
};

// ── Scan & Learn API ──────────────────────────────────────────────────────────

export const scanApi = {
  // Send a base64 image to Gemini Vision for identification
  analyzeImage: (imageBase64: string) =>
    apiRequest("/api/scan/analyze", {
      method: "POST",
      body: { imageBase64 },
    }),
  // Text-based fallback
  learnAbout: (topic: string) =>
    apiRequest("/api/scan/learn", {
      method: "POST",
      body: { topic },
    }),
};
