"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { TenantForm } from "@/components/settings/tenant-form";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-zinc-400 mt-2">Manage your account preferences and organization details.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Profile</TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Organization</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
            <ProfileForm />
        </TabsContent>
        
        <TabsContent value="organization">
            <TenantForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}