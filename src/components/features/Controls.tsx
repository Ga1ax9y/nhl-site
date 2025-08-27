import type { StatsCategory } from "../../types/statsCategory";

interface StatsControlsProps {
  category: StatsCategory;
  setCategory: (category: StatsCategory) => void;
  type: 'skater' | 'goalie';
}

const StatsControls: React.FC<StatsControlsProps> = ({ category, setCategory, type }) => {
  const categories = {
    skater: ["points", "goals", "assists", "plusMinus"] as StatsCategory[],
    goalie: ["savePctg", "goalsAgainstAverage", "shutouts", "wins"] as StatsCategory[]
  };

  const getButtonLabel = (ctg: string) => {
    if (type === 'skater') {
      return ctg === "plusMinus" ? "+/-" : ctg.charAt(0).toUpperCase() + ctg.slice(1);
    } else {
      if (ctg === "savePctg") return "save %";
      if (ctg === "goalsAgainstAverage") return "GAA";
      return ctg.charAt(0).toUpperCase() + ctg.slice(1);
    }
  };

  return (
    <div className="stats__controls controls">
      {categories[type].map(ctg => (
        <button
          key={ctg}
          className={`controls__button ${
            category === ctg ? "controls__button--active" : ""
          }`}
          onClick={() => setCategory(ctg)}
          type="button"
        >
          {getButtonLabel(ctg)}
        </button>
      ))}
    </div>
  );
};

export default StatsControls;
