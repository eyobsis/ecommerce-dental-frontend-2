"use client";

import { createContext, ReactNode } from "react";

export type AppSession = {
  user?: {
    accountType?: string;
    role?: string;
    phone_number?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
} | null;

type SessionValue = {
  session: AppSession;
};

export const SessionContext = createContext<SessionValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
  session: AppSession;
};

export default function UserProvider({
  children,
  session,
}: UserProviderProps) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}
