// Admin session is kept separate from the student/parent session in api.ts.
const TOKEN_KEY = "adminToken";
const USER_KEY = "adminUser";
const BASE = "/api/admin/question-pipeline";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type DraftStatus = "pending" | "approving" | "approved" | "rejected";
export type CountsByStatus = Partial<Record<DraftStatus, Partial<Record<Difficulty, number>>>>;

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface ChapterRow {
  id: string;
  name: string;
  order: number;
  hasPdf: boolean;
  pdfFilename: string;
  verificationStatus: string;
  verificationScore: number | null;
  draftCounts: CountsByStatus;
  latestJob: Job | null;
}

export interface Verification {
  status: string;
  method?: string;
  score?: number;
  message?: string;
  officialUrl?: string;
  matchedPages?: [number, number] | null;
  checkedAt?: string;
  checkedBy?: string;
}

export interface Rejection {
  question: string;
  difficulty: Difficulty;
  stage: "rules" | "verifier";
  reasons: string[];
}

export interface Job {
  id: string;
  status: "queued" | "running" | "completed" | "partial" | "failed";
  message: string;
  targets: Record<Difficulty, number>;
  accepted: Record<Difficulty, number>;
  rejectedCount?: number;
  rejections?: Rejection[];
  round?: number;
  sourceTextMethod?: string;
  model?: string;
  verifierModel?: string;
  createdAt?: string;
}

export interface ChapterDetail {
  chapter: { id: string; name: string; title?: string; order: number };
  board: string;
  classLevel: string;
  subject: string;
  subjectId: string;
  s3Key: string | null;
  pdfViewUrl: string | null;
  verification: Verification | null;
  plan: Record<Difficulty, number>;
  remaining: Record<Difficulty, number>;
  draftCounts: CountsByStatus;
  latestJob: Job | null;
}

export interface Draft {
  id: string;
  status: DraftStatus;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  sourceQuote: string;
  sourcePage: number;
  quoteScore: number | null;
  sourceTextMethod: string;
  verification: { chosen_option: string; correct_option_count: number; answerable_from_chapter: boolean; difficulty: Difficulty; issues: string } | null;
  generator?: string;
  editedByHuman?: boolean;
  rejectReason?: string;
  reviewedBy?: string;
}

export interface DraftEdits {
  question?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: Difficulty;
}

export interface ClaudeContext {
  chapterId: string;
  chapter: string;
  board: string;
  classLevel: string;
  subject: string;
  pdfUrl: string | null;
  remaining: Record<Difficulty, number>;
  avoidQuestions: string[];
}

export interface ImportResult {
  acceptedCount: number;
  accepted: Record<Difficulty, number>;
  rejected: { index: number; question: string; difficulty?: string; reasons: string[] }[];
  quoteCheckable: boolean;
  remaining: Record<Difficulty, number>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const adminSession = {
  token: () => localStorage.getItem(TOKEN_KEY),
  user: (): AdminUser | null => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },
  save: (token: string, user: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const token = adminSession.token();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) {
    adminSession.clear();
    window.dispatchEvent(new Event("admin-logout"));
  }
  if (!res.ok) {
    const detail = json.detail ?? json.message ?? `Request failed (${res.status})`;
    throw new ApiError(typeof detail === "string" ? detail : JSON.stringify(detail), res.status);
  }
  return json as T;
}

const post = <T>(url: string, body: unknown = {}) => request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const adminApi = {
  login: async (email: string, password: string) => {
    const res = await post<{ token: string; user: AdminUser }>("/api/admin/auth/login", { email, password });
    adminSession.save(res.token, res.user);
    return res.user;
  },

  filters: (board?: string, classLevel?: string) => {
    const q = new URLSearchParams();
    if (board) q.set("board", board);
    if (classLevel) q.set("classLevel", classLevel);
    return request<{ data: { boards: string[]; classLevels: string[]; subjects: { id: string; name: string }[] } }>(
      `${BASE}/filters?${q}`
    ).then((r) => r.data);
  },

  chapters: (subjectId: string) =>
    request<{ data: { chapters: ChapterRow[]; officialSource: { url: string } | null } }>(
      `${BASE}/chapters?subjectId=${encodeURIComponent(subjectId)}`
    ).then((r) => r.data),

  chapter: (chapterId: string) => request<{ data: ChapterDetail }>(`${BASE}/chapters/${chapterId}`).then((r) => r.data),

  verify: (chapterId: string, officialUrl?: string) =>
    post<{ data: Verification }>(`${BASE}/chapters/${chapterId}/verify`, { officialUrl: officialUrl || null }).then((r) => r.data),

  verifyManually: (chapterId: string, note: string) =>
    post<{ data: Verification }>(`${BASE}/chapters/${chapterId}/verify-manual`, { note }).then((r) => r.data),

  setOfficialSource: (subjectId: string, url: string) =>
    request(`${BASE}/subjects/${subjectId}/official-source`, { method: "PUT", body: JSON.stringify({ url }) }),

  generate: (chapterId: string) => post<{ data: Job }>(`${BASE}/chapters/${chapterId}/generate`).then((r) => r.data),

  claudeContext: (chapterId: string) =>
    request<{ data: ClaudeContext }>(`${BASE}/chapters/${chapterId}/claude-context`).then((r) => r.data),

  importQuestions: (chapterId: string, questions: unknown[]) =>
    post<{ data: ImportResult }>(`${BASE}/chapters/${chapterId}/import`, { questions, generator: "claude-app" }).then((r) => r.data),

  job: (jobId: string) => request<{ data: Job }>(`${BASE}/jobs/${jobId}`).then((r) => r.data),

  drafts: (chapterId: string, status: DraftStatus | "all") =>
    request<{ data: Draft[] }>(`${BASE}/drafts?chapterId=${chapterId}&status=${status}`).then((r) => r.data),

  updateDraft: (draftId: string, edits: DraftEdits) =>
    request<{ data: Draft }>(`${BASE}/drafts/${draftId}`, { method: "PUT", body: JSON.stringify(edits) }).then((r) => r.data),

  approve: (draftId: string, edits?: DraftEdits) =>
    post<{ data: Draft }>(`${BASE}/drafts/${draftId}/approve`, { edits: edits || null }).then((r) => r.data),

  reject: (draftId: string, reason: string) =>
    post<{ data: Draft }>(`${BASE}/drafts/${draftId}/reject`, { reason }).then((r) => r.data),
};
