import CreateAccount from "@/components/register/create-account-form";
import { signUp } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const CreateNewAccount = async () => {
  const handleCreateAccount = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    "use server";
    await signUp.email(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        role: "CLIENT",
        accountType: "CLIENT",
        phone_number: "0966044534",
      },
      {
        onRequest: () => {},
        onResponse: () => {},
        onError: () => {},
        onSuccess: () => {
          redirect("/auth");
        },
      },
    );
  };
  return <CreateAccount onSubmit={handleCreateAccount} />;
};

export default CreateNewAccount;
