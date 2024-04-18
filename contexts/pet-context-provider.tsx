"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssential } from "@/lib/types";
import { Pet } from "@prisma/client";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (pet: PetEssential) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPet: PetEssential) => Promise<void>;
  handleChangeSelectedPet: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
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
  // const [pets, setPets] = useState(data);
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: Date.now().toString() }];
        case "edit":
          return prev.map((pet) => {
            if (pet.id == payload.id) {
              return {
                id: payload.id,
                ...payload.newPet,
              };
            }
            return pet;
          });
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers
  const handleAddPet = async (newPet: PetEssential) => {
    // setPets((prev) => [
    //   ...prev,
    //   {
    //     ...pet,
    //     id: Date.now().toString(),
    //   },
    // ]);
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: Pet["id"], newPet: PetEssential) => {
    //   setPets((prev) =>
    //     prev.map((pet) => {
    //       if (pet.id == petId) {
    //         return {
    //           id: petId,
    //           ...newPet,
    //         };
    //       }
    //       return pet;
    //     })
    //   );
    setOptimisticPets({ action: "edit", payload: { id: petId, newPet } });
    const error = await editPet(petId, newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (id: Pet["id"]) => {
    //   setPets((prev) => prev.filter((pet) => pet.id !== id));
    setOptimisticPets({ action: "delete", payload: id });
    await deletePet(id);
    setSelectedPetId(null);
  };

  const handleChangeSelectedPet = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
        handleChangeSelectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
