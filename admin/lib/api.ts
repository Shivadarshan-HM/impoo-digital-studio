const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const TOKEN_KEY = "admin_access_token";

// Helper Token Functions
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Core HTTP Fetch Client with Automatic Bearer Token & 401 Interception
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeStoredToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data.detail || data.message || `Request failed with status ${response.status}`;
    throw new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
  }

  return data as T;
}

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

export interface AdminUser {
  id: number;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  cover_image_url: string | null;
  display_order: number;
  is_published: boolean;
  photo_count: number;
  created_at: string;
  updated_at: string;
}


export interface Photo {
  id: number;
  category_id: number;
  image_url: string;
  display_order: number;
  is_cover: boolean;
  is_published: boolean;
  created_at: string;
}

export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string | null;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export interface LeadListResponse {
  total: number;
  page: number;
  limit: number;
  items: Lead[];
}

export interface StudioSettings {
  id: number;
  studio_name: string;
  phone: string;
  email: string;
  address: string;
  updated_at: string;
}

export interface DashboardStats {
  total_categories: number;
  total_photos: number;
  total_leads: number;
  unread_leads: number;
  recent_leads: Lead[];
}

// ==============================================================================
// API FUNCTIONS
// ==============================================================================

// 1. Auth API
export async function getRegisterStatus(): Promise<{ registration_open: boolean }> {
  return apiFetch<{ registration_open: boolean }>("/auth/register-status");
}

export async function registerAdmin(
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      confirm_password: confirmPassword,
    }),
  });
}

export async function loginAdmin(email: string, password: string): Promise<TokenResponse> {
  const data = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(data.access_token);
  return data;
}

export async function getMe(): Promise<AdminUser> {
  return apiFetch<AdminUser>("/auth/me");
}


export function logoutAdmin(): void {
  removeStoredToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}


// 2. Dashboard API
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/admin/dashboard/stats");
}

// 3. Category API
export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/admin/categories");
}

export async function createCategory(payload: {
  name: string;
  cover_image_url?: string;
  display_order?: number;
  is_published?: boolean;
}): Promise<Category> {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  id: number,
  payload: Partial<Category>
): Promise<Category> {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}

export async function reorderCategories(
  items: { id: number; display_order: number }[]
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/admin/categories/reorder", {
    method: "PATCH",
    body: JSON.stringify({ items }),
  });
}

// 4. Photo API
export async function getPhotos(categoryId?: number): Promise<Photo[]> {
  const query = categoryId ? `?category_id=${categoryId}` : "";
  return apiFetch<Photo[]>(`/admin/photos${query}`);
}

export async function createPhoto(payload: {
  category_id: number;
  image_url: string;
  display_order?: number;
  is_cover?: boolean;
  is_published?: boolean;
}): Promise<Photo> {
  return apiFetch<Photo>("/admin/photos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deletePhoto(id: number): Promise<void> {
  return apiFetch<void>(`/admin/photos/${id}`, {
    method: "DELETE",
  });
}

export async function setCoverPhoto(id: number): Promise<Photo> {
  return apiFetch<Photo>(`/admin/photos/${id}/set-cover`, {
    method: "PATCH",
  });
}

export async function reorderPhotos(
  items: { id: number; display_order: number }[]
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/admin/photos/reorder", {
    method: "PATCH",
    body: JSON.stringify({ items }),
  });
}

// 5. Lead API
export async function getLeads(params?: {
  search?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}): Promise<LeadListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const queryString = searchParams.toString();
  return apiFetch<LeadListResponse>(`/admin/leads${queryString ? `?${queryString}` : ""}`);
}

export async function getLead(id: number): Promise<Lead> {
  return apiFetch<Lead>(`/admin/leads/${id}`);
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus
): Promise<Lead> {
  return apiFetch<Lead>(`/admin/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteLead(id: number): Promise<void> {
  return apiFetch<void>(`/admin/leads/${id}`, {
    method: "DELETE",
  });
}

// 6. Settings API
export async function getStudioSettings(): Promise<StudioSettings> {
  return apiFetch<StudioSettings>("/admin/settings");
}

export async function updateStudioSettings(
  payload: Partial<StudioSettings>
): Promise<StudioSettings> {
  return apiFetch<StudioSettings>("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// 7. Image Upload API (Cloudinary)
export async function uploadImage(
  file: File
): Promise<{ secure_url: string; public_id: string }> {
  const token = getStoredToken();
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/admin/upload`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (response.status === 401) {
    removeStoredToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data.detail || data.message || `Upload failed with status ${response.status}`;
    throw new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
  }

  return data as { secure_url: string; public_id: string };
}

