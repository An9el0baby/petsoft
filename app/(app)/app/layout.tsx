import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { Toaster } from "sonner";
import { checkAuth, getPetByUserId } from "@/lib/server-util";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // authenticate check
  const session = await checkAuth();

  const pets = await getPetByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />
      <div className="flex flex-col  max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>
      <Toaster position="top-right" />
    </>
  );
}
