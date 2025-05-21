import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from "@/lib/xaca/utils/index";
import { toast } from 'react-hot-toast';
import { InputImage } from "@/components/ui";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

const initialFormState = {
  name: '',
  url: '',
  category: '',
  price: '',
  quantity: '',
  description: '',
  status: 'In Stock'
};

const ProductForm = ({ onClose, product = null }: { onClose: () => void, product: Product | null }) => {
  const isEditMode = !!product;
  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement> | null;

  useEffect(() => { 
    fetchCategories();
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        url: product.url || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        description: product.description || '',
        status: product.status || 'In Stock'
      });
    } else {
      setFormData(initialFormState);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const categoriesSnapshot = await getDocs(collection(db, "categorias"));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        status: doc.data().status
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      // Find selected category
      const selectedCategory = categories.find(cat => cat.id === formData.category);

      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: formData.category,
        categoryName: selectedCategory?.name || ''
      };

      if (isEditMode) {
        // Update existing product
        const productRef = doc(db, "productos", product.id);
        await updateDoc(productRef, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        // Create new product
        await addDoc(collection(db, "productos"), productData);
        toast.success('Producto agregado exitosamente');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(isEditMode ? 'Error al actualizar el producto' : 'Error al agregar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 z-1000">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
            <InputImage fileInputRef={fileInputRef} initialImage={formData.url} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              name="quantity"
              required
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Cantidad disponible"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="In Stock">En Stock</option>
              <option value="Low Stock">Stock Bajo</option>
              <option value="Out of Stock">Sin Stock</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 