export interface Product {
  id: string;
  name: string;
  price: number;
  url: string;
  quantity: number;
  category: string;
  categoryName: string;
  description: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
} 