"use client";

import { usePetContext, useSearchContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PetListProps = {
  pets: Pet[];
};

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPet } = usePetContext();
  const { search } = useSearchContext();

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPet(pet.id)}
            className={cn(
              "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] transition",
              {
                "bg-[#EFF1F2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="Pet Image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
