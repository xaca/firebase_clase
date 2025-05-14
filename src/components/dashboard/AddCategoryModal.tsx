import React from 'react';
import AddCategory from './AddCategory';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../libs/utils/config';
import { toast } from 'react-hot-toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const handleSave = async (categoryData: any) => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      await addDoc(collection(db, 'categorias'), {
        nombre: categoryData.name,
        descripcion: categoryData.description,
        createdAt: new Date()
      });

      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  return (
    <AddCategory 
      isOpen={isOpen} 
      onClose={onClose}
      onSave={handleSave}
    />
  );
};

export default AddCategoryModal; 