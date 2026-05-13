interface GenreFilterProps {
  genres: string[];
  selected: string | null;
  onSelect: (genre: string | null) => void;
}

export default function GenreFilter({ genres, selected, onSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`genre-tag text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${!selected ? "active" : ""}`}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(selected === g ? null : g)}
          className={`genre-tag text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${selected === g ? "active" : ""}`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
