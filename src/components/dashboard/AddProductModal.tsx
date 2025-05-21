import ProductForm from './ProductForm';
import { Product } from '@/types/product';
import { X } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: Product | null }) {
  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } flex items-center justify-center z-1000`}
    >
      <div
        className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
          {isOpen && <ProductForm key={Date.now()} onClose={onClose} product={product} />}
        </div>
      </div>
    </div>
  );
}