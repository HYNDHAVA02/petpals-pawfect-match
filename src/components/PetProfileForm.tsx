
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/hooks/useLocation";
import ImageUpload from "./pet-profile/ImageUpload";
import LocationInput from "./pet-profile/LocationInput";
import { PetProfileFormProps, petFormSchema, PetFormValues } from "./pet-profile/types";

const PetProfileForm: React.FC<PetProfileFormProps> = ({ 
  onSubmit, 
  initialData,
  isSubmitting = false 
}) => {
  const { toast } = useToast();
  const { location: userLocation } = useLocation();
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: initialData || {
      name: "",
      age: "",
      breed: "",
      gender: "male",
      bio: "",
      location: "",
    },
  });

  const handleSubmit = (data: PetFormValues) => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please upload a photo of your pet",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...data,
      imageUrl: imagePreview,
      ...(useCurrentLocation && userLocation ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      } : {})
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ImageUpload imagePreview={imagePreview} setImagePreview={setImagePreview} />

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

        <LocationInput 
          form={form} 
          useCurrentLocation={useCurrentLocation}
          setUseCurrentLocation={setUseCurrentLocation}
        />

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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : 
           initialData ? "Update Pet Profile" : "Create Pet Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default PetProfileForm;
