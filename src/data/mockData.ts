
import { Pet } from "../components/PetCard";

export const mockPets: Pet[] = [
  {
    id: "pet1",
    name: "Max",
    age: 3,
    breed: "Golden Retriever",
    gender: "male",
    bio: "Max is a friendly, energetic Golden Retriever who loves swimming and playing fetch. He's great with kids and other dogs.",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    ownerId: "user2",
    ownerName: "Emma Johnson"
  },
  {
    id: "pet2",
    name: "Bella",
    age: 2,
    breed: "Beagle",
    gender: "female",
    bio: "Bella is a curious and playful Beagle who loves sniffing out adventures. She's very affectionate and loves belly rubs.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    ownerId: "user3",
    ownerName: "Michael Smith"
  },
  {
    id: "pet3",
    name: "Luna",
    age: 1.5,
    breed: "Siamese Cat",
    gender: "female",
    bio: "Luna is a vocal and intelligent Siamese who loves interactive toys and climbing to high places. She's independent but affectionate.",
    imageUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    ownerId: "user4",
    ownerName: "Daniel Brown"
  },
  {
    id: "pet4",
    name: "Charlie",
    age: 4,
    breed: "Labrador Retriever",
    gender: "male",
    bio: "Charlie is a gentle and loyal Labrador who loves swimming and fetching balls. He's great with children and other pets.",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    ownerId: "user5",
    ownerName: "Sophia Wilson"
  },
  {
    id: "pet5",
    name: "Milo",
    age: 2.5,
    breed: "Maine Coon",
    gender: "male",
    bio: "Milo is a gentle giant with a luxurious coat. He's playful, good-natured, and loves to curl up on laps despite his size.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    ownerId: "user6",
    ownerName: "Olivia Davis"
  }
];

export const mockMatches: Pet[] = [
  {
    id: "pet2",
    name: "Bella",
    age: 2,
    breed: "Beagle",
    gender: "female",
    bio: "Bella is a curious and playful Beagle who loves sniffing out adventures. She's very affectionate and loves belly rubs.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    ownerId: "user3",
    ownerName: "Michael Smith"
  },
  {
    id: "pet4",
    name: "Charlie",
    age: 4,
    breed: "Labrador Retriever",
    gender: "male",
    bio: "Charlie is a gentle and loyal Labrador who loves swimming and fetching balls. He's great with children and other pets.",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    ownerId: "user5",
    ownerName: "Sophia Wilson"
  }
];

export const mockUserPets: Pet[] = [
  {
    id: "userpet1",
    name: "Buddy",
    age: 3,
    breed: "Border Collie",
    gender: "male",
    bio: "Buddy is an incredibly smart and athletic Border Collie. He loves agility training and knows over 20 tricks!",
    imageUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    ownerId: "user1",
    ownerName: "Your Name"
  }
];
