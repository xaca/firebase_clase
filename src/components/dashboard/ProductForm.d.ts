import { FC } from 'react';

interface Product {
  id?: string;
  nombre?: string;
  url?: string;
  categoria?: string;
  precio?: string | number;
  cantidad?: string | number;
  descripcion?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface ProductFormProps {
  onClose: () => void;
  product?: Product | null;
}

declare const ProductForm: FC<ProductFormProps>;

export default ProductForm; 