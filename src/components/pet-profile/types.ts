
import { z } from "zod";

export const petFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  breed: z.string().min(1, { message: "Breed is required" }),
  gender: z.enum(["male", "female"], {
    message: "Please select a gender",
  }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  location: z.string().min(1, { message: "Location is required" }),
});

export type PetFormValues = z.infer<typeof petFormSchema>;

export interface PetProfileFormProps {
  onSubmit: (data: PetFormValues & { imageUrl: string; latitude?: number; longitude?: number }) => void;
  initialData?: PetFormValues & { imageUrl: string; latitude?: number; longitude?: number };
  isSubmitting?: boolean;
  isEditing?: boolean;
}
