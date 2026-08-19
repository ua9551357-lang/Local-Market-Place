export interface Category {
  id: string;
  name: string;
  icon?: string;
  providerCount: number;
}

export interface Provider {
  id: string;
  userId: string;
  categoryId: string;
  bio?: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  priceFrom: string;
  verified: boolean;
  location?: string;
  availability?: string;
  user: {
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  };
  category: {
    name: string;
  };
}

export interface PaginatedProviders {
  data: Provider[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProviderFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  search?: string;
  city?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  price: string;
  durationMins: number;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    name: string;
    avatarUrl?: string;
  };
}

export interface ProviderDetail extends Provider {
  services: Service[];
  user: Provider['user'] & { city?: string };
}