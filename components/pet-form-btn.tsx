// import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function PetFormBtn({
  actionType,
}: {
  actionType: "add" | "edit";
}) {
  // since we are using useOptimistic hook, we don't need to disable the button
  // const { pending } = useFormStatus();

  return (
    // <Button type="submit" disabled={pending} className="mt-5 self-end">
    <Button type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add Pet" : "Edit Pet"}
    </Button>
  );
}
