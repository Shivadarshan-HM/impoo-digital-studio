export type LeadStatus = "new" | "contacted" | "closed";

export interface Category {
  id: number;
  name: string;
  cover_image_url: string | null;
  display_order: number;
  photo_count: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: number;
  category_id: number;
  category_name: string;
  image_url: string;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

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

export interface StudioSettings {
  studio_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
}

export const MOCK_STUDIO_SETTINGS: StudioSettings = {
  studio_name: "IMPOO Digital Studio",
  tagline: "We Preserve Emotions.",
  phone: "+91 98451 23456",
  email: "contact@impodigitalstudio.com",
  address: "123 Heritage Lane, Palace Road, Mysuru, Karnataka 570001",
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Wedding",
    cover_image_url: "/portfolio/wedding/cover.jpg",
    display_order: 1,
    photo_count: 64,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-07-18T14:30:00Z",
  },
  {
    id: 2,
    name: "Haldi",
    cover_image_url: "/portfolio/haldi/cover.jpg",
    display_order: 2,
    photo_count: 42,
    created_at: "2026-01-12T11:20:00Z",
    updated_at: "2026-07-15T09:15:00Z",
  },
  {
    id: 3,
    name: "Reception",
    cover_image_url: "/portfolio/reception/cover.jpg",
    display_order: 3,
    photo_count: 58,
    created_at: "2026-01-15T16:45:00Z",
    updated_at: "2026-07-16T18:00:00Z",
  },
  {
    id: 4,
    name: "Baby Shoot",
    cover_image_url: "/portfolio/baby-shoot/cover.jpg",
    display_order: 4,
    photo_count: 36,
    created_at: "2026-02-01T08:30:00Z",
    updated_at: "2026-07-20T11:00:00Z",
  },
  {
    id: 5,
    name: "Awards & Recognition",
    cover_image_url: "/portfolio/awards-recognition/cover.jpg",
    display_order: 5,
    photo_count: 28,
    created_at: "2026-02-10T12:00:00Z",
    updated_at: "2026-07-12T15:40:00Z",
  },
  {
    id: 6,
    name: "Pre-Wedding",
    cover_image_url: "/portfolio/pre-wedding/cover.jpg",
    display_order: 6,
    photo_count: 20,
    created_at: "2026-03-05T14:15:00Z",
    updated_at: "2026-07-08T10:25:00Z",
  },
];

export const MOCK_PHOTOS: Photo[] = [
  {
    id: 101,
    category_id: 1,
    category_name: "Wedding",
    image_url: "/portfolio/wedding/cover.jpg",
    display_order: 1,
    is_cover: true,
    created_at: "2026-07-18T10:00:00Z",
  },
  {
    id: 102,
    category_id: 1,
    category_name: "Wedding",
    image_url: "/portfolio/wedding/photo-2.jpg",
    display_order: 2,
    is_cover: false,
    created_at: "2026-07-18T10:05:00Z",
  },
  {
    id: 103,
    category_id: 2,
    category_name: "Haldi",
    image_url: "/portfolio/haldi/cover.jpg",
    display_order: 1,
    is_cover: true,
    created_at: "2026-07-15T09:15:00Z",
  },
  {
    id: 104,
    category_id: 3,
    category_name: "Reception",
    image_url: "/portfolio/reception/cover.jpg",
    display_order: 1,
    is_cover: true,
    created_at: "2026-07-16T18:00:00Z",
  },
  {
    id: 105,
    category_id: 4,
    category_name: "Baby Shoot",
    image_url: "/portfolio/baby-shoot/cover.jpg",
    display_order: 1,
    is_cover: true,
    created_at: "2026-07-20T11:00:00Z",
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: "Ananya & Rohan Gowda",
    phone: "+91 98451 23456",
    email: "ananya.gowda@gmail.com",
    event_type: "Destination Wedding",
    event_date: "2026-11-24",
    message: "Looking for complete 3-day wedding photography and 4K film package in Mysuru Palace grounds.",
    status: "new",
    created_at: "2026-07-20T08:30:00Z",
  },
  {
    id: 2,
    name: "Vikram & Sneha Hegde",
    phone: "+91 97312 87654",
    email: "vikram.hegde@outlook.com",
    event_type: "Pre-Wedding Shoot",
    event_date: "2026-09-15",
    message: "Interested in cinematic sunset outdoor session at Kabini backwaters with drone coverage.",
    status: "new",
    created_at: "2026-07-19T16:45:00Z",
  },
  {
    id: 3,
    name: "Meera & Rajesh Aradhya",
    phone: "+91 94480 65432",
    email: "meera.aradhya@yahoo.com",
    event_type: "Traditional Haldi & Muhurtham",
    event_date: "2026-10-02",
    message: "Seeking candid documentary photography for 500+ guests event in HD Kote heritage hall.",
    status: "contacted",
    created_at: "2026-07-18T11:15:00Z",
  },
  {
    id: 4,
    name: "Priya & Karthik Rao",
    phone: "+91 96112 34567",
    email: "karthik.rao@techcorp.io",
    event_type: "Grand Reception",
    event_date: "2026-12-10",
    message: "Need editorial twilight reception shoot with fast turnaround photobook and teaser video.",
    status: "contacted",
    created_at: "2026-07-17T14:20:00Z",
  },
  {
    id: 5,
    name: "Dr. Kavya & Suresh Reddy",
    phone: "+91 99001 98765",
    email: "kavya.reddy@hospital.org",
    event_type: "Baby Shoot & 1st Birthday",
    event_date: "2026-08-28",
    message: "Intimate indoor session with warm natural studio lighting for our 1-year-old child.",
    status: "closed",
    created_at: "2026-07-15T09:00:00Z",
  },
];
