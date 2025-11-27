import React from "react";
import { AuthBranding } from "@/components/auth/auth-branding";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen flex font-sans bg-black">
      {/* Visual Side */}
      <AuthBranding />

      {/* Functional Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative animate-in fade-in slide-in-from-right-10 duration-500">
        <RegisterForm />
      </div>
    </div>
  );
}