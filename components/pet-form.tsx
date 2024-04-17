"use client";
import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function PetForm({
  actionType,
  onFormSubmission,
}: {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
}) {
  const { handleAddPet } = usePetContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };
    handleAddPet(newPet);
    onFormSubmission();
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="owner">Owner Name</Label>
          <Input id="owner" type="text" name="ownerName" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" type="text" name="imageUrl" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" name="age" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} name="notes" required />
        </div>
      </div>
      <Button type="submit" className="mt-5 self-end">
        {actionType === "add" ? "Add Pet" : "Edit Pet"}
      </Button>
    </form>
  );
}
