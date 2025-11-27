import React from "react";
import { AuthBranding } from "@/components/auth/auth-branding";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex font-sans bg-black">
      {/* Functional Side (Swapped for Login) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative animate-in fade-in slide-in-from-right-10 duration-500">
        <LoginForm />
      </div>
      
      {/* Visual Side (Reused) */}
      <AuthBranding />

    </div>
  );
}