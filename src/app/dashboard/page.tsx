export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {/* Simple Cards just to see layout */}
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
             <div className="text-zinc-400 text-sm font-medium">Total Candidates</div>
             <div className="text-2xl font-bold mt-2 text-white">1,20{i}</div>
           </div>
         ))}
      </div>
    </div>
  );
}