interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
  }) => void;
}

declare const AddCategory: React.FC<AddCategoryProps>;
export default AddCategory; 