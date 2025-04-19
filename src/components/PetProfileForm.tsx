
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const petFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  breed: z.string().min(1, { message: "Breed is required" }),
  gender: z.enum(["male", "female"], {
    message: "Please select a gender",
  }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetProfileFormProps {
  onSubmit: (data: PetFormValues & { imageUrl: string }) => void;
  initialData?: PetFormValues & { imageUrl: string };
}

const PetProfileForm: React.FC<PetProfileFormProps> = ({ onSubmit, initialData }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: initialData || {
      name: "",
      age: "",
      breed: "",
      gender: "male",
      bio: "",
    },
  });

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
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload to AWS S3 here
    // For now, we'll just use the preview
  };

  const handleSubmit = (data: PetFormValues) => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please upload a photo of your pet",
        variant: "destructive",
      });
      return;
    }

    // Submit the form data with the image URL
    onSubmit({
      ...data,
      imageUrl: imagePreview,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Buddy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="e.g., 2.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Golden Retriever" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your pet's personality, likes and dislikes..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : initialData ? "Update Pet Profile" : "Create Pet Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default PetProfileForm;
