import { useContext } from "react";
import { SessionContext } from "@/hooks/session-context";

export const useSession = () => {
  const session = useContext(SessionContext);
  if (session === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return { session };
};

