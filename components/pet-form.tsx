"use client";
import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";

export default function PetForm({
  actionType,
  onFormSubmission,
}: {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
}) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  return (
    <form
      className="flex flex-col"
      action={async (formData) => {
        onFormSubmission();
        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) ||
            "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
          age: Number(formData.get("age")),
          notes: formData.get("notes") as string,
        };

        if (actionType === "add") {
          handleAddPet(petData);
        } else if (actionType === "edit") {
          handleEditPet(selectedPet!.id, petData);
        }
      }}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet!.name : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="owner">Owner Name</Label>
          <Input
            id="owner"
            type="text"
            name="ownerName"
            required
            defaultValue={actionType === "edit" ? selectedPet!.ownerName : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            type="text"
            name="imageUrl"
            defaultValue={actionType === "edit" ? selectedPet!.imageUrl : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            name="age"
            required
            defaultValue={actionType === "edit" ? selectedPet!.age : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            name="notes"
            required
            defaultValue={actionType === "edit" ? selectedPet!.notes : ""}
          />
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
