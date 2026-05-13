import { useState } from "react";

interface GenreFilterProps {
  genres: { id: number; name: string }[];
  selected: number | null;
  onChange: (id: number | null) => void;
}

export default function GenreFilter({ genres, selected, onChange }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      <button
        onClick={() => onChange(null)}
        className={`genre-tag px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
          selected === null ? "active" : ""
        }`}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`genre-tag px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            selected === g.id ? "active" : ""
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
