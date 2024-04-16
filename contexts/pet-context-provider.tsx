"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPet: (id: string) => void;
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
  const handleChangeSelectedPet = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
