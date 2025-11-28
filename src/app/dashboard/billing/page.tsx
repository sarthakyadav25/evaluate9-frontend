"use client";

import React from "react";
import { Check, Download, Plus, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h2>
            <p className="text-zinc-400 mt-2">Manage your subscription, payment methods, and invoices.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white text-black duration-300 cursor-pointer">
                Contact Support
            </Button>
            <Button className="bg-white text-black hover:bg-zinc-200">
                Upgrade Plan
            </Button>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid gap-8 md:grid-cols-2">
          
          {/* LEFT: Payment Method (The Gradient Card) */}
          <div className="space-y-6">
              <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Payment Method</h3>
                  <p className="text-sm text-zinc-500">Manage your payment details.</p>
              </div>
              
              {/* The "Visa" Gradient Card */}
              <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-rose-400 to-orange-300" />
                  
                  {/* Noise Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                  {/* Card Content */}
                  <div className="relative h-full p-6 md:p-8 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                          <span className="font-medium tracking-wide opacity-90">EvaluatingIX Pro</span>
                          {/* Contactless Icon SVG */}
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                              <path d="M8.5 14.5C8.5 14.5 10 13 12 13C14 13 15.5 14.5 15.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M6 12C6 12 9 9.5 12 9.5C15 9.5 18 12 18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M3.5 9.5C3.5 9.5 7.5 6 12 6C16.5 6 20.5 9.5 20.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                      </div>

                      <div className="space-y-1">
                          <div className="flex items-center gap-4 text-xl md:text-2xl font-mono tracking-widest opacity-90 shadow-sm">
                              <span>••••</span>
                              <span>••••</span>
                              <span>••••</span>
                              <span>4325</span>
                          </div>
                      </div>

                      <div className="flex justify-between items-end opacity-90">
                          <div className="flex flex-col text-xs font-medium uppercase tracking-wider">
                              <span className="opacity-70 text-[10px] mb-1">Card Holder</span>
                              <span>Admin User</span>
                          </div>
                          <div className="flex flex-col text-xs font-medium uppercase tracking-wider">
                              <span className="opacity-70 text-[10px] mb-1">Expires</span>
                              <span>12/28</span>
                          </div>
                          {/* Visa/Mastercard Logo Placeholder */}
                          <div className="font-bold italic text-lg">VISA</div>
                      </div>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                  <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white">
                      <CreditCard className="w-4 h-4 mr-2" /> Edit Card
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white">
                      <Plus className="w-4 h-4 mr-2" /> Add New
                  </Button>
              </div>
          </div>

          {/* RIGHT: Current Plan Details */}
          <div className="space-y-6">
              <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Current Plan</h3>
                  <p className="text-sm text-zinc-500">You are on the <span className="text-emerald-400 font-bold">Ultimate</span> tier.</p>
              </div>

              <Card className="bg-zinc-900 border-zinc-800 h-60">
                  <CardContent className="p-8 h-full flex flex-col justify-center space-y-6">
                      <div className="flex items-center justify-between">
                          <div>
                              <h4 className="text-2xl font-bold text-white tracking-tight">ULTIMATE</h4>
                              <p className="text-zinc-400 text-sm">$99 / month</p>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">Active</Badge>
                      </div>

                      <div className="space-y-3">
                          <FeatureItem text="Unlimited Question Banks" />
                          <FeatureItem text="Advanced RAG Analysis" />
                          <FeatureItem text="500 Active Candidates / mo" />
                          <FeatureItem text="Priority Email Support" />
                      </div>
                  </CardContent>
              </Card>

              <div className="bg-violet-900/10 border border-violet-500/20 rounded-lg p-4 flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-violet-400 mt-0.5" />
                  <div>
                      <h4 className="text-sm font-medium text-violet-300">Next Payment</h4>
                      <p className="text-xs text-zinc-400 mt-1">
                          Your card will be charged <strong>$99.00</strong> on <strong>December 1, 2025</strong>.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- Bottom: Invoice History --- */}
      <div className="pt-8">
          <h3 className="text-xl font-bold text-white mb-6">Billing History</h3>
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
              <Table>
                  <TableHeader className="bg-zinc-900">
                      <TableRow className="border-zinc-800 hover:bg-zinc-900">
                          <TableHead className="text-zinc-400">Invoice ID</TableHead>
                          <TableHead className="text-zinc-400">Date</TableHead>
                          <TableHead className="text-zinc-400">Amount</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                          <TableHead className="text-right text-zinc-400">Action</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {invoices.map((invoice) => (
                          <TableRow key={invoice.id} className="border-zinc-800 hover:bg-zinc-800/50">
                              <TableCell className="font-mono text-zinc-300">{invoice.id}</TableCell>
                              <TableCell className="text-zinc-300">{invoice.date}</TableCell>
                              <TableCell className="text-white font-medium">{invoice.amount}</TableCell>
                              <TableCell>
                                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                      {invoice.status}
                                  </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                      <Download className="w-4 h-4 mr-2" /> PDF
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-zinc-300">{text}</span>
        </div>
    );
}

const invoices = [
    { id: "INV-2025-001", date: "Nov 01, 2025", amount: "$99.00", status: "Paid" },
    { id: "INV-2025-002", date: "Oct 01, 2025", amount: "$99.00", status: "Paid" },
    { id: "INV-2025-003", date: "Sep 01, 2025", amount: "$99.00", status: "Paid" },
];