
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

export type Category = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: string;
  userId: string;
  categoryId: string | Category;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  user: User;
}

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

export type ArticleFormValues = {
  title: string;
  content: string;
  categoryId: string;
  image?: FileList | null;
};

export type CategoryFormValues = {
  name: string;
  slug?: string;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

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
export type ArticleFormData = {
  title: string;
  content: string;
  categoryId: string;
  imageUrl?: string;
}