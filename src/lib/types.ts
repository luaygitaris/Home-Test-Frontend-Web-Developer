// src/lib/types.ts

// Type untuk User/Authentication
export type User = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

// Type untuk Kategori
export type Category = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// Type untuk Artikel
export type Article = {
  id: string;
  userId: string;
  categoryId: string | Category; // Bisa string (ID) atau objek Category
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category?: Category; // Optional jika ada data denormalized
  user: User; // Bisa objek User atau string (ID)
}

// Type untuk Pagination/API Response
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

// Type untuk Form Artikel
export type ArticleFormValues = {
  title: string;
  content: string;
  categoryId: string;
  image?: FileList | null;
};

// Type untuk Form Kategori
export type CategoryFormValues = {
  name: string;
  slug?: string;
};

// Type untuk Error Response
export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

// Type untuk Filter/Pagination params
export type ListQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type ArticleResponse = {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
}

// types.ts
export type ArticleFormData = {
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
}