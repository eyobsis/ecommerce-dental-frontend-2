import { signUp } from "@/lib/auth-client";

export async function createEmployee(formData: {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  pos_type: string;
}) {
  try {
    await signUp.email({
      email: formData.email.trim(),
      password: formData.password,
      name: formData.name.trim(),
      phone_number: formData.phoneNumber?.trim() ?? "default",
      role: formData.pos_type.toLowerCase(),
      accountType: "ADMIN",
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Registration failed" };
  }
}
