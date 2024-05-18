"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { auth, signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/server-util";

// --- User Actions ---
export async function logIn(formData: FormData) {
  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// --- Pet Actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  // authenticate check
  const session = await checkAuth();
  // server-side validation
  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // database operation
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Failed to add pet",
    };
  }
  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);
  //  authenticate check
  const session = await checkAuth();
  // server-side validation
  const validatedPet = petFormSchema.safeParse(newPetData);
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // authorization check (user owns the pet)
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // database operation
  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Failed to edit pet",
    };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);
  // authenticate check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet ID",
    };
  }

  // authorization check (user owns the pet)
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // database operation
  try {
    await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch (error) {
    return {
      message: "Failed to delete pet",
    };
  }
  revalidatePath("/app", "layout");
}
