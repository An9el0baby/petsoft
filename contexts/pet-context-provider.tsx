"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPet: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (pet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, newPet: Omit<Pet, "id">) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers
  const handleAddPet = (pet: Omit<Pet, "id">) => {
    setPets((prev) => [
      ...prev,
      {
        ...pet,
        id: Date.now().toString(),
      },
    ]);
  };

  const handleEditPet = (petId: string, newPet: Omit<Pet, "id">) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id == petId) {
          return {
            id: petId,
            ...newPet,
          };
        }
        return pet;
      })
    );
  };

  const handleChangeSelectedPet = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPet,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
