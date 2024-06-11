"use client";
import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { petFormSchema, petFormType } from "@/lib/validations";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { useEffect, useState } from "react";
import { deleteFile } from "@/actions/actions";

export default function PetForm({
  actionType,
  onFormSubmission,
}: {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
}) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<petFormType>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  const [imageURL, setImageURL] = useState(
    actionType === "edit"
      ? selectedPet?.imageUrl || DEFAULT_PET_IMAGE
      : DEFAULT_PET_IMAGE
  );

  const [prevImageURL, setPrevImageURL] = useState(imageURL);

  return (
    <form
      className="flex flex-col"
      action={async () => {
        // trigger validation
        const result = await trigger();
        if (!result) return;
        onFormSubmission();

        const petData = getValues();
        petData.imageUrl = imageURL || DEFAULT_PET_IMAGE;

        if (actionType === "add") {
          handleAddPet(petData);
        } else if (actionType === "edit") {
          handleEditPet(selectedPet!.id, petData);
          if (prevImageURL !== imageURL) {
            deleteFile(prevImageURL);
          }
        }
      }}
    >
      <div className="space-y-3">
        <Label htmlFor="image">Image</Label>
        <div className="flex flex-row items-center justify-around">
          <Image
            src={imageURL}
            alt="Selected Pet Image"
            height={75}
            width={75}
            className="h-[75px] w-[75px] rounded-full object-cover"
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              setImageURL(res[0].url);
              setValue("imageUrl", res[0].url);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="owner">Owner Name</Label>
          <Input id="owner" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>
        {/* <div className="space-y-1">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div> */}
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
