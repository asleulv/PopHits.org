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
  // Don't render anything if no artist data
  if (!artistData) return null;

  const isGroup = artistData.artist_type === "group";
  const stats = artistData.billboard_stats;

  // Safe year extraction that won't cause hydration issues
  const getYear = (dateString) => {
    if (!dateString) return null;
    return dateString.split("-")[0];
  };

  // Determine what type of artist this is and show appropriate relationships
  const relatedArtists = [];

  // Add members (if band)
  if (artistData.members && artistData.members.length > 0) {
    artistData.members.forEach((member) => {
      relatedArtists.push({
        name: member.artist_name,
        slug: member.artist_slug,
        type: "member",
      });
    });
  }

  // Add bands (if solo artist)
  if (artistData.member_of && artistData.member_of.length > 0) {
    artistData.member_of.forEach((band) => {
      relatedArtists.push({
        name: band.artist_name,
        slug: band.artist_slug,
        type: "band",
      });
    });
  }

  // Add collaborations
  if (artistData.collaborations && artistData.collaborations.length > 0) {
    artistData.collaborations.forEach((collab) => {
      relatedArtists.push({
        name: collab.name,
        slug: collab.slug,
        type: "collaboration",
      });
    });
  }

  // Add participating artists (for collaboration artists)
  if (
    artistData.participating_artists &&
    artistData.participating_artists.length > 0
  ) {
    artistData.participating_artists.forEach((artist) => {
      relatedArtists.push({
        name: artist.name,
        slug: artist.slug,
        type: "collaborator",
      });
    });
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 rounded-xl shadow-lg mb-6">
      {/* Artist Name Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        {isGroup ? (
          <Users className="w-6 h-6 text-pink-400" />
        ) : (
          <User className="w-6 h-6 text-pink-400" />
        )}
        {artistData.name}
      </h2>

      {/* Artist Image */}
      {artistData.image && (
        <div className="mb-4 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-xl">
            <Image
              src={artistData.image}
              alt={artistData.name}
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>
          {artistData.image_credit && (
            <p className="text-xs text-gray-400 mt-2 italic">
              {artistData.image_credit}
            </p>
          )}
        </div>
      )}

      {/* Basic Info Grid */}
      <div
        className={`grid gap-3 mb-4 ${
          artistData.death_date
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {/* Nationality */}
        {artistData.nationality && (
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <Globe className="w-6 h-6 text-white mx-auto mb-1" />
            <div className="text-white text-sm">Nationality</div>
            <div className="font-bold text-pink-400 text-lg">
              {artistData.nationality}
            </div>
          </div>
        )}

        {/* Artist Type */}
        {artistData.artist_type && (
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            {isGroup ? (
              <Users className="w-6 h-6 text-white mx-auto mb-1" />
            ) : (
              <User className="w-6 h-6 text-white mx-auto mb-1" />
            )}
            <div className="text-white text-sm">Type</div>
            <div className="font-bold text-pink-400 text-lg capitalize">
              {artistData.artist_type === "person"
                ? "Solo Artist"
                : artistData.artist_type}
            </div>
          </div>
        )}

        {/* Formation/Birth */}
        {artistData.birth_date && (
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-white mx-auto mb-1" />
            <div className="text-white text-sm">
              {isGroup ? "Formed" : "Born"}
            </div>
            <div className="font-bold text-pink-400 text-lg">
              {getYear(artistData.birth_date)}
            </div>
          </div>
        )}

        {/* Disbanded/Death */}
        {artistData.death_date && (
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-white mx-auto mb-1" />
            <div className="text-white text-sm">
              {isGroup ? "Disbanded" : "Died"}
            </div>
            <div className="font-bold text-pink-400 text-lg">
              {getYear(artistData.death_date)}
            </div>
          </div>
        )}
      </div>

      {/* Genre Tags - Smaller and more subtle */}
      {artistData.tags && artistData.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-sm text-gray-400">Genres</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {artistData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-600/30"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Billboard Statistics */}
      {stats && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-3 text-center text-white">
            Chart Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Total Hits */}
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <Music className="w-6 h-6 text-white mx-auto mb-1" />
              <div className="text-white text-sm">Total Hits</div>
              <div className="font-bold text-pink-400 text-2xl">
                {stats.total_hits}
              </div>
            </div>

            {/* Best Position */}
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <Star className="w-6 h-6 text-white mx-auto mb-1" />
              <div className="text-white text-sm">Best Peak</div>
              <div className="font-bold text-pink-400 text-2xl">
                #{stats.highest_peak}
                {stats.highest_peak === 1 && stats.number_one_hits > 0 && (
                  <span className="text-base ml-1">
                    ({stats.number_one_hits})
                  </span>
                )}
              </div>
            </div>

            {/* Total Weeks */}
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <Clock className="w-6 h-6 text-white mx-auto mb-1" />
              <div className="text-white text-sm">Total Weeks</div>
              <div className="font-bold text-pink-400 text-2xl">
                {stats.total_weeks}
              </div>
            </div>

            {/* Billboard Era */}
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <Calendar className="w-6 h-6 text-white mx-auto mb-1" />
              <div className="text-white text-sm">Chart Years</div>
              <div className="font-bold text-pink-400 text-lg">
                {stats.first_hit_year === stats.last_hit_year
                  ? stats.first_hit_year
                  : `${stats.first_hit_year}-${stats.last_hit_year}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-bold text-lg text-white">Related:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {relatedArtists.map((artist, index) => {
              // Calculate gradient position for each button
              const totalButtons = relatedArtists.length;
              const position = index / Math.max(totalButtons - 1, 1);

              // Pink to Purple gradient
              const r = Math.round(236 - position * (236 - 147));
              const g = Math.round(72 - position * (72 - 51));
              const b = Math.round(153 - position * (153 - 234));

              return (
                <Link
                  key={index}
                  href={`/artist/${artist.slug}`}
                  style={{
                    backgroundColor: `rgb(${r}, ${g}, ${b})`,
                  }}
                  className="text-gray-300 hover:text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {artist.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
