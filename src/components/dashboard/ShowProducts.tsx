import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, FolderPlus } from 'lucide-react';
import readProducts from '../../lib/xaca/data/read_product';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../lib/xaca/utils/config';
import { doc, deleteDoc, getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast, Toaster } from 'react-hot-toast';
import AddProductModal from './AddProductModal';
import AddCategoryModal from './AddCategoryModal';
import readUser from '../../lib/xaca/data/read_user';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

  export default function ShowProducts() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastKnownPage, setLastKnownPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  async function userIsLogged(){
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await auth.authStateReady();
    
    const user = auth.currentUser;
    if (!user?.uid) return null;
    const userInfo = await readUser(user.uid);
    setIsAdmin(userInfo?.role === "admin");
    return userInfo;
  }

  const fetchProducts = async () => {
    const products: Product[] = await readProducts();
    setProducts(products);
  };

  const fetchCategories = async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const categoriesSnapshot = await getDocs(collection(db, "categorias"));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  useEffect(() => {
    (async()=>{
      const user = await userIsLogged();
      if(user){
        if(user.role === "admin"){
          fetchProducts();
          fetchCategories();
        }
        else{
          navigate('/');
        }
      }
      else{
        navigate('/login');
      }
    })();          
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
    if (selectedCategory !== 'all') {
      setCurrentPage(1);
    }
  }, [selectedCategory, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

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

  const handleCloseAddModal = () => {
    setIsAddProductModalOpen(false);
    setProductToEdit(null);
    fetchProducts().then(() => {
      setCurrentPage(lastKnownPage);
    });
  };

  const handleEditClick = (product: Product) => {
    setLastKnownPage(currentPage);
    setProductToEdit(product);
    setIsAddProductModalOpen(true);
  };

  return (
    isAdmin
    && (<div className="p-6 mx-auto w-full">
    <Toaster/>
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
        <div className="flex w-full md:w-[250px] justify-between mb-4">
          <h1 className="md:text-2xl text-xl text-left font-semibold">Product List</h1>
          {selectedProducts.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {selectedProducts.length} Selected
            </span>
          )}
        </div>
        <div className="w-full mb-4 md:w-[200px] text-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="text-sm lg:text-base bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <FolderPlus className="text-lg" />
            ADD CATEGORY
          </button>
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="text-sm lg:text-base bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="text-lg" />
            ADD PRODUCT
          </button>
        </div>
      </div>

      <div className="w-full mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2 sm:px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === products.length}
                  />
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((product,index) => (
                <tr
                  key={index}
                  className={`${
                    selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                  } hover:bg-gray-50`}
                >
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <img
                          className="h-full w-full rounded-full object-cover"
                          src={product.url}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product?.categoryName}
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.quantity}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                      {product?.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => handleEditClick(product)}
                      >
                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-gray-700 whitespace-nowrap">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
            </span>
            {filteredProducts.length > 5 && (
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="w-full sm:w-auto px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            )}
          </div>
          {filteredProducts.length > itemsPerPage && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          )}
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
        productName={productToDelete?.name || ''}
        isDeleting={isDeleting}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleCloseAddModal}
        product={productToEdit}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
    </div>
  ))
};