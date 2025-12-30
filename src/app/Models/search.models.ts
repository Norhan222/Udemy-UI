// Search Request DTO
export interface SearchRequestDto {
    search?: string;
    language?: string;
    level?: string;
    isFree?: boolean;
    minRating?: number;
    page?: number;
    pageSize?: number;
}

// Course Item in Search Results
export interface CourseSearchItemDto {
    id: number;
    title: string;
    instructor: string;
    price: number;
    image: string;
    level: string;
    language: string;
    rating: number;
    reviewCount: number;
}

// Facet Item (for filters)
export interface FacetItemDto {
    name: string;
    count: number;
}

// Search Facets (all available filters)
export interface SearchFacetsDto {
    languages: FacetItemDto[];
    levels: FacetItemDto[];
    price: FacetItemDto[];
    ratings: FacetItemDto[];
}

// Search Response
export interface SearchResponseDto {
    courses: CourseSearchItemDto[];
    totalCount: number;
    facets: SearchFacetsDto;
}

// API Response Wrapper
export interface SearchApiResponse {
    success: boolean;
    data: SearchResponseDto;
    message: string;
}
