
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: "male" | "female";
  bio: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
}

interface PetCardProps {
  pet: Pet;
  onSwipeRight: (pet: Pet) => void;
  onSwipeLeft: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onSwipeRight, onSwipeLeft }) => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const swipeThreshold = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (offsetX > swipeThreshold) {
      handleSwipeRight();
    } else if (offsetX < -swipeThreshold) {
      handleSwipeLeft();
    } else {
      setOffsetX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (offsetX > swipeThreshold) {
      handleSwipeRight();
    } else if (offsetX < -swipeThreshold) {
      handleSwipeLeft();
    } else {
      setOffsetX(0);
    }
  };

  const handleSwipeRight = () => {
    setSwipeDirection("right");
    onSwipeRight(pet);
    setTimeout(() => {
      setSwipeDirection(null);
      setOffsetX(0);
    }, 500);
  };

  const handleSwipeLeft = () => {
    setSwipeDirection("left");
    onSwipeLeft(pet);
    setTimeout(() => {
      setSwipeDirection(null);
      setOffsetX(0);
    }, 500);
  };

  const cardClasses = `
    pet-card 
    ${swipeDirection === "right" ? "swiped-right" : ""} 
    ${swipeDirection === "left" ? "swiped-left" : ""}
  `;

  const cardStyle = {
    transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
    opacity: Math.max(1 - Math.abs(offsetX) / 500, 0.6)
  };

  return (
    <Card 
      className={cardClasses}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <CardContent className="p-0 overflow-hidden">
        <div className="relative">
          <img 
            src={pet.imageUrl} 
            alt={pet.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-bold">{pet.name}</h3>
              <span className="text-lg">{pet.age} yrs</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-white/20 text-white border-none">
                {pet.breed}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-none">
                {pet.gender === "male" ? "♂ Male" : "♀ Female"}
              </Badge>
            </div>
            <p className="text-sm text-white/80 line-clamp-2">{pet.bio}</p>
            <p className="text-xs mt-2 text-white/70">Owner: {pet.ownerName}</p>
          </div>
        </div>
      </CardContent>
      <div className="flex justify-center gap-6 p-4 bg-white">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 border-2 border-red-400 text-red-400 hover:bg-red-50"
          onClick={handleSwipeLeft}
        >
          ✕
        </Button>
        <Button 
          size="icon" 
          className="rounded-full h-14 w-14 bg-gradient-to-r from-petpals-purple to-petpals-pink text-white"
          onClick={handleSwipeRight}
        >
          ♥
        </Button>
      </div>
    </Card>
  );
};

export default PetCard;
