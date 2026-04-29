export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    quantity: number;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}
// we mae interface for products response and structure of products for display

export interface Category {
    slug: string;
    name: string;
    url: string;
}

export interface ProductQueryParams {
    limit?: number;
    skip?: number;
    search?: string;
    category?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
