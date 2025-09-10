export interface Category {
    _id?: string;
    name: string;
    image?: string;
    description?: string;
    featured?: boolean;
    productCount?: number;
    relatedImages?: string[];
}