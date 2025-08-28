interface ControlsProps<T extends string> {
  category: T;
  setCategory: (category: T) => void;
  type: 'skater' | 'goalie' | 'standings';
  season: string
}

const Controls = <T extends string>({ category, setCategory, type, season}: ControlsProps<T>) => {
  const categories = {
    skater: ["points", "goals", "assists", "plusMinus"] as const,
    goalie: ["savePctg", "goalsAgainstAverage", "shutouts", "wins"] as const,
    standings: ["conference", "league"]
  };
  if (Number(season) > 20112012 || season === "now"){
    categories.standings.push("division", "wildcard");
  }
  if (Number(season) === 20202021){
    categories.standings = ['league']
  }

  const getButtonLabel = (ctg: string) => {
    if (type === 'skater') {
      return ctg === "plusMinus" ? "+/-" : ctg.charAt(0).toUpperCase() + ctg.slice(1);
    } else {
      if (ctg === "savePctg") return "save %";
      if (ctg === "goalsAgainstAverage") return "GAA";
      return ctg.charAt(0).toUpperCase() + ctg.slice(1);
    }
  };

  const getSectionName = (type: 'skater' | 'goalie' | 'standings') => {
    if (type === 'skater' || type === 'goalie') return 'stats';
    if (type === 'standings') return 'standings';
  }

  return (
    <div className={`${getSectionName(type)}__controls controls`}>
      {categories[type].map(ctg => (
        <button
          key={ctg}
          className={`controls__button ${
            category === ctg ? "controls__button--active" : ""
          }`}
          onClick={() => setCategory(ctg as T)}
          type="button"
        >
          {getButtonLabel(ctg)}
        </button>
      ))}
    </div>
  );
};

export default Controls;
