"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function RecentActivity() {
  // Mock Data
  const activities = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+92%",
      status: "Passed",
      test: "Senior React Dev",
      time: "2 mins ago"
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "45%",
      status: "Failed",
      test: "Python Data Science",
      time: "1 hour ago"
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "Pending",
      status: "Active",
      test: "Frontend Architecture",
      time: "3 hours ago"
    },
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800 col-span-3">
      <CardHeader>
        <CardTitle className="text-white text-base font-medium">Recent Evaluations</CardTitle>
        <CardDescription className="text-zinc-500">Candidates processed today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((item, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9 border border-zinc-800">
                <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                    {item.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none text-white">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.test}</p>
              </div>
              <div className="ml-auto font-medium text-sm text-right">
                 <div className={
                     item.status === 'Passed' ? 'text-emerald-400' : 
                     item.status === 'Failed' ? 'text-red-400' : 'text-zinc-400'
                 }>
                     {item.amount}
                 </div>
                 <div className="text-[10px] text-zinc-600">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}