"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Shield, Eye, Lock, AlertTriangle, Monitor, MousePointerClick, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProctoringSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [strictness, setStrictness] = useState(70); // 0-100 scale
  const [config, setConfig] = useState({
      webcam: true,
      tabSwitch: true,
      audio: false,
      fullScreen: true,
      copyPaste: true
  });

  const handleSave = () => {
      setLoading(true);
      // Simulate Backend Call
      setTimeout(() => {
          setLoading(false);
          toast.success("Security Policy Updated", {
              description: "New proctoring rules will apply to future tests."
          });
      }, 1000);
  };

  // Helper to determine label based on slider
  const getStrictnessLabel = (val: number) => {
      if (val < 40) return { label: "Lenient", color: "text-emerald-400" };
      if (val < 80) return { label: "Standard", color: "text-violet-400" };
      return { label: "Strict", color: "text-red-400" };
  };

  const currentLevel = getStrictnessLabel(strictness);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Proctoring Settings</h2>
                <p className="text-zinc-400 mt-2">Configure the anti-cheat strictness and violation thresholds.</p>
            </div>
            <Button onClick={handleSave} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white min-w-[140px]">
                {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            
            {/* LEFT COLUMN: Main Controls */}
            <div className="md:col-span-2 space-y-6">
                
                {/* 1. Global Strictness Slider */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                            <span>Global Strictness</span>
                            <Badge variant="outline" className={`bg-zinc-950 border-zinc-800 ${currentLevel.color}`}>
                                {currentLevel.label} ({strictness}%)
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Adjust the sensitivity of the AI monitoring algorithms.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Slider 
                            value={[strictness]} 
                            onValueChange={(vals) => setStrictness(vals[0])}
                            max={100} 
                            step={10}
                            className="py-4"
                        />
                        <div className="grid grid-cols-3 text-xs text-zinc-500 text-center">
                            <span>Lenient</span>
                            <span>Standard</span>
                            <span>Zero Tolerance</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Detection Modules */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Detection Modules</CardTitle>
                        <CardDescription>Enable or disable specific tracking features.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-zinc-200">Webcam Monitoring</Label>
                                <p className="text-sm text-zinc-500">Detects if candidate leaves the frame or multiple faces appear.</p>
                            </div>
                            <Switch 
                                checked={config.webcam} 
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, webcam: c }))} 
                            />
                        </div>
                        <Separator className="bg-zinc-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-zinc-200">Tab Switch Detection</Label>
                                <p className="text-sm text-zinc-500">Logs warnings when the browser loses focus.</p>
                            </div>
                            <Switch 
                                checked={config.tabSwitch} 
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, tabSwitch: c }))} 
                            />
                        </div>
                        <Separator className="bg-zinc-800" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base text-zinc-200">Audio Environment Analysis</Label>
                                <p className="text-sm text-zinc-500">Detects human speech or suspicious background noise.</p>
                            </div>
                            <Switch 
                                checked={config.audio} 
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, audio: c }))} 
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* 3. Browser Lockdown */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Browser Lockdown</CardTitle>
                        <CardDescription>Restrict user interactions during the exam.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-500/10 rounded-md text-violet-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-zinc-200">Force Full Screen</Label>
                                </div>
                            </div>
                            <Switch 
                                checked={config.fullScreen} 
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, fullScreen: c }))} 
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-500/10 rounded-md text-violet-400">
                                    <MousePointerClick className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-sm text-zinc-200">Disable Copy/Paste</Label>
                                </div>
                            </div>
                            <Switch 
                                checked={config.copyPaste} 
                                onCheckedChange={(c) => setConfig(prev => ({ ...prev, copyPaste: c }))} 
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Consequences Preview */}
            <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-amber-500">
                    <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Termination Policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Based on your current strictness ({currentLevel.label}), the system will automatically terminate a session after:
                        </p>
                        
                        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-sm text-zinc-300">Tab Switches</span>
                            <span className="font-mono font-bold text-white">3</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-sm text-zinc-300">Face Loss (Seconds)</span>
                            <span className="font-mono font-bold text-white">10s</span>
                        </div>
                        
                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-500">
                                <strong className="text-zinc-300">Note:</strong> Candidates are given 1 warning toast before a strike is recorded.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="p-4 rounded-xl bg-violet-900/10 border border-violet-500/20">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-violet-400 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-violet-100">Enterprise Grade</h4>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                Your organization uses <strong>BlazeFace v2</strong> for biometric verification. All logs are encrypted and stored for 90 days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}