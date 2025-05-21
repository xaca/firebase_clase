import {useState, useEffect} from 'react';

interface AvatarProps {
  fileInputRef: React.RefObject<HTMLInputElement>|null;
  initialImage?: string;
}

export default function InputImage({ fileInputRef, initialImage }: AvatarProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev:ProgressEvent<FileReader>) => setImage((ev.target as FileReader).result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full">
      <div className="flex flex-col items-center w-full md:w-auto">
        <label className="text-[1.1rem] md:text-[1.3rem] text-gray-500 mb-4 md:mb-6">Cargar Imagen</label>
        <input
          id="archivo_imagen"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef?.current?.click()}
          className="w-full md:w-48 bg-gray-400 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
        >
          Examinar...
        </button>
      </div>
      <div
        className="w-32 h-32 md:w-40 md:h-40 bg-gray-300 rounded-2xl md:rounded-3xl flex items-center justify-center mt-4 md:mt-0"
      >
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
          />
        ) : null}
      </div>
    </div>
  );
}


