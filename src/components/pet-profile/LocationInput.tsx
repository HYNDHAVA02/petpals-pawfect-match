
import { useLocation } from "@/hooks/useLocation";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { PetFormValues } from "./types";

interface LocationInputProps {
  form: UseFormReturn<PetFormValues>;
  useCurrentLocation: boolean;
  setUseCurrentLocation: (value: boolean) => void;
}

const LocationInput = ({ form, useCurrentLocation, setUseCurrentLocation }: LocationInputProps) => {
  const { toast } = useToast();
  const { location: userLocation } = useLocation();

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setUseCurrentLocation(true);
      form.setValue("location", "Using current location");
    } else {
      toast({
        title: "Location unavailable",
        description: "Please enable location services or enter location manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="Enter location" 
                  {...field}
                  disabled={useCurrentLocation}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Use Current
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationInput;
