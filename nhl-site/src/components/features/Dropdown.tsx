import type { ISeason } from "../../types/season";

interface SeasonSelectorProps {
  seasons: ISeason[];
  selectedSeason: string;
  onSeasonChange: (seasonValue: string) => void;
  className?: string;
}

export default function SeasonSelector({seasons, selectedSeason, onSeasonChange,className = ""
}: SeasonSelectorProps) {
  const getSeasonLabel = (season: ISeason) => {
    return `${season.id.toString().slice(0, 4)}/${season.id.toString().slice(4, 8)}`;
  };

  const getSeasonValue = (season: ISeason) => {
    return season.id;
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSeasonChange(event.target.value);
  };

  return (
    <div className={`${className}__season-selector`}>
      <select
        className={`${className}__season-dropdown`}
        value={selectedSeason}
        onChange={handleChange}
        id="season-select"
      >
        {seasons.map((seasonItem) => (
          <option key={seasonItem.id} value={getSeasonValue(seasonItem)} id={seasonItem.id.toString()}>
            {getSeasonLabel(seasonItem)}
          </option>
        ))}
      </select>
    </div>
  );
}
