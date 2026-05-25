'use client';

import Image from 'next/image';

interface FloatingPortraitCardProps {
  rank: number;
  name: string;
  score: number;
  classStream: string;
  passingYear: number;
  imageUrl: string;
}

export function FloatingPortraitCard({
  rank,
  name,
  score,
  classStream,
  passingYear,
  imageUrl,
}: FloatingPortraitCardProps) {
  return (
    <div className="group">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
        <Image
          src={imageUrl}
          alt={`${name} - Rank #${rank} with ${score}% score`}
          fill
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Floating Rank & Score Badge */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-slate-900 shadow-md">
          <span>#{rank}</span>
          <span className="text-xs opacity-75">•</span>
          <span>{score}%</span>
        </div>
      </div>

      {/* Text Info - Below Image */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {classStream} • {passingYear}
        </p>
      </div>
    </div>
  );
}
