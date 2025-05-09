import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import readProducts from '../../libs/data/read_product';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../libs/utils/config';
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from 'react-router';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast, Toaster } from 'react-hot-toast';

interface Product {
    id: string;
    [key: string]: any;
}
/*interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}*/



const ShowProduct: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function userIsLogged(){
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await auth.authStateReady();
    /*onAuthStateChanged(auth, async (user) => {
        setIsLoggedIn(user !== null);
    });*/
    
    const user = auth.currentUser;
    return user !== null;
  }

  useEffect(() => {
    userIsLogged().then(isLoggedIn => {
      if(isLoggedIn){
        const fetchProducts = async () => {
          const products = await readProducts();
          setProducts(products);
        };
        fetchProducts();
      }
      else{
        navigate('/login');
      }
    });
    
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete && !isDeleting) {
      try {
        setIsDeleting(true);
        console.log('Attempting to delete product:', productToDelete);
        
        // Initialize Firebase only once
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Delete the document
        await deleteDoc(doc(db, "productos", productToDelete.id));
        console.log('Product successfully deleted');
        
        // Update the UI
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
        toast.success('Producto eliminado exitosamente');
        
        // Close the modal
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error al eliminar el producto');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-6 mx-auto w-full">
    <Toaster/>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Product List</h1>
          {selectedProducts.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {selectedProducts.length} Selected
            </span>
          )}
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="text-lg" />
          ADD PRODUCT
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === products.length}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product,index) => (
              <tr
                key={index}
                className={`${
                  selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                } hover:bg-gray-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.url}
                        alt={product.nombre}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.nombre}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product?.categoria}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.precio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                    {product?.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-3">
                    <button className="text-gray-600 hover:text-blue-600">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-red-600"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing 1 - {products.length} of {products.length}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.nombre || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ShowProduct;
