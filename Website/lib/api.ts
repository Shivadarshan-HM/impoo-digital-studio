const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  cover_image_url: string | null;
  display_order: number;
  photo_count: number;
}

export interface PublicPhoto {
  id: number;
  category_id: number;
  image_url: string;
  display_order: number;
  is_cover: boolean;
  is_published: boolean;
  created_at: string;
}

export interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date?: string | null;
  message: string;
  hp_website?: string;
}

export interface LeadResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  event_type: string;
  event_date: string | null;
  message: string;
  status: string;
  created_at: string;
}

// ==============================================================================
// PUBLIC SITE API FUNCTIONS
// ==============================================================================

/**
 * Fetch all published categories for the portfolio section
 */
export async function getPublishedCategories(): Promise<PublicCategory[]> {
  const url = `${API_BASE_URL}/public/categories`;
  const response = await fetch(url, {
    cache: "no-store", // Ensure fresh data from backend
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single published category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<PublicCategory> {
  const url = `${API_BASE_URL}/public/categories/slug/${encodeURIComponent(slug)}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Category '${slug}' not found`);
  }

  return response.json();
}

/**
 * Fetch all published photos for a specific category by slug
 */
export async function getCategoryPhotosBySlug(
  slug: string
): Promise<PublicPhoto[]> {
  const url = `${API_BASE_URL}/public/categories/slug/${encodeURIComponent(slug)}/photos`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch photos for category '${slug}'`);
  }

  return response.json();
}

/**
 * Submit client inquiry form lead to backend
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const url = `${API_BASE_URL}/public/leads`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.detail || data.message || `Lead submission failed with status ${response.status}`;
    throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
  }

  return data as LeadResponse;
}
