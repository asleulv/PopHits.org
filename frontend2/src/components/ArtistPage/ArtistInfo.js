"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Users,
  User,
  Calendar,
  Music,
  Clock,
  Star,
  Tag,
} from "lucide-react";

export default function ArtistInfo({ artistData }) {
  if (!artistData) return null;

  const isGroup = artistData.artist_type === "group";
  const stats = artistData.billboard_stats;

  const getYear = (dateString) => dateString?.split("-")[0] || null;

  // Build related artists
  const relatedArtists = [
    ...(artistData.members?.map((m) => ({
      name: m.artist_name,
      slug: m.artist_slug,
      type: "member",
    })) || []),
    ...(artistData.member_of?.map((b) => ({
      name: b.artist_name,
      slug: b.artist_slug,
      type: "band",
    })) || []),
    ...(artistData.collaborations?.map((c) => ({
      name: c.name,
      slug: c.slug,
      type: "collaboration",
    })) || []),
    ...(artistData.participating_artists?.map((a) => ({
      name: a.name,
      slug: a.slug,
      type: "collaborator",
    })) || []),
  ];

  // Info pills
  const infoItems = [];
  if (artistData.nationality)
    infoItems.push({
      icon: Globe,
      label: "From",
      value: artistData.nationality,
    });
  if (artistData.birth_date)
    infoItems.push({
      icon: Calendar,
      label: isGroup ? "Formed" : "Born",
      value: getYear(artistData.birth_date),
    });
  if (artistData.death_date)
    infoItems.push({
      icon: Calendar,
      label: isGroup ? "Disbanded" : "Died",
      value: getYear(artistData.death_date),
    });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-8 border border-slate-400">
      {/* Artist Header */}
      <header className="text-center border-b border-slate-300 pb-4">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-slate-900">
          {isGroup ? (
            <Users className="w-7 h-7 text-amber-600" />
          ) : (
            <User className="w-7 h-7 text-amber-600" />
          )}
          {artistData.name}
        </h2>
      </header>

      {/* IMAGE + INFO */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {artistData.image && (
          <div className="md:col-span-2 flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-md border border-slate-300">
              <Image
                src={artistData.image}
                alt={artistData.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
              />
            </div>
            {artistData.image_credit && (
              <p className="text-xs text-slate-600 mt-2 italic">
                {artistData.image_credit}
              </p>
            )}
          </div>
        )}

        {/* INFO + GENRES */}
        <div
          className={`${
            artistData.image ? "md:col-span-3" : "md:col-span-5"
          } space-y-6`}
        >
          {infoItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                {isGroup ? "Group Info" : "Artist Info"}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center items-center md:justify-start">
                {infoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full text-sm border border-slate-300 flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-amber-600" />
                      <span className="text-slate-600 text-xs">
                        {item.label}:
                      </span>
                      <span className="font-semibold text-amber-700">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {artistData.tags?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" /> Genres
              </h3>
              <div className="flex flex-wrap gap-1.5 justify-center items-center md:justify-start">
                {artistData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs border border-slate-300"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CHART STATS */}
      {stats && (
        <section className="border-t border-slate-300 pt-6">
          <h3 className="text-lg font-semibold text-center text-slate-900 mb-6 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-600" /> Chart Performance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { label: "Total Hits", icon: Music, value: stats.total_hits },
              {
                label: "Best Peak",
                icon: Star,
                value: `#${stats.highest_peak}${
                  stats.highest_peak === 1 && stats.number_one_hits > 0
                    ? ` (${stats.number_one_hits})`
                    : ""
                }`,
              },
              { label: "Total Weeks", icon: Clock, value: stats.total_weeks },
              {
                label: "Chart Years",
                icon: Calendar,
                value:
                  stats.first_hit_year === stats.last_hit_year
                    ? stats.first_hit_year
                    : `${stats.first_hit_year}-${stats.last_hit_year}`,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-yellow-50 border border-slate-300 rounded-xl px-5 py-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-700">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* RELATED ARTISTS */}
      {relatedArtists.length > 0 && (
        <section className="border-t border-slate-300 pt-6">
          <h3 className="text-lg font-semibold text-center text-slate-900 mb-3 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-amber-600" /> Related Artists
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {relatedArtists.map((artist, index) => (
              <Link
                key={index}
                href={`/artist/${artist.slug}`}
                className="bg-slate-100 text-slate-800 hover:text-amber-700 hover:bg-slate-200 px-3 py-1.5 rounded-full text-sm border border-slate-300 transition-all duration-200 font-medium"
              >
                {artist.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
