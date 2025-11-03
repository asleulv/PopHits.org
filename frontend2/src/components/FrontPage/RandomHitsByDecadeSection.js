import { Shuffle } from "lucide-react";
import RandomHitsByDecadeClient from "@/components/FrontPage/RandomHitsByDecadeClient";

export default function RandomHitsByDecadeSection({
  groupedByDecade,
  initialDecade,
}) {
  if (Object.keys(groupedByDecade).length === 0) {
    return (
      <section className="mb-8 bg-yellow-50 text-slate-900 p-8 w-full lg:rounded-xl shadow-lg">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl text-slate-700">Loading random hits by decade...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 bg-yellow-50 text-slate-900 p-8 w-full lg:rounded-xl shadow-lg">
      <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3">
          <Shuffle className="hidden lg:block w-8 h-8 text-amber-600" />
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Explore Chart-Topping Songs and Hidden Gems by Decade
          </span>
        </h2>
      </div>

      <RandomHitsByDecadeClient
        groupedByDecade={groupedByDecade}
        initialDecade={initialDecade}
      />
    </section>
  );
}
