import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from "@/lib/xaca/utils/index";
import { toast } from 'react-hot-toast';

const initialFormState = {
  nombre: '',
  url: '',
  categoria: '',
  precio: '',
  cantidad: '',
  descripcion: '',
  status: 'In Stock'
};

const ProductForm = ({ onClose, product = null }) => {
  const isEditMode = !!product;

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode && product) {
      setFormData({
        nombre: product.nombre || '',
        url: product.url || '',
        categoria: product.categoria || '',
        precio: product.precio?.toString() || '',
        cantidad: product.cantidad?.toString() || '',
        descripcion: product.descripcion || '',
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
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      // Find selected category
      const selectedCategory = categories.find(cat => cat.id === formData.categoria);

      const productData = {
        ...formData,
        precio: Number(formData.precio),
        cantidad: Number(formData.cantidad),
        categoria: formData.categoria,
        categoriaNombre: selectedCategory?.nombre || ''
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              required
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
            <input
              type="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              required
              min="0"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="Cantidad disponible"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoria"
              required
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nombre}</option>
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
              name="descripcion"
              required
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows="4"
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