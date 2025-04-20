
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  imagePreview: string;
  setImagePreview: (url: string) => void;
}

const ImageUpload = ({ imagePreview, setImagePreview }: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6">
      <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Pet preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm text-center px-2">
            Click to upload pet photo
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-xs text-center mt-2 text-gray-500">
        Click to upload (max 5MB)
      </p>
    </div>
  );
};

export default ImageUpload;
