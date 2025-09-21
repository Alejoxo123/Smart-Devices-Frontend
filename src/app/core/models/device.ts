export interface Device {
    id: string;
    name: string;
    brandId: string;
    categoryId: string;
    releaseDate: string;   // ISO yyyy-mm-dd
    priceCOP: number;
    specs?: Record<string, string>;
    images: string[];
    tags?: string[];
    description?: string;
    ratingAvg?: number;
}
