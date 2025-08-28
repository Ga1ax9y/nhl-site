type SkaterStatsCategory = 'points' | 'goals' | 'assists' | 'plusMinus' | 'savePctg' | 'shutouts' | 'wins' | 'goalsAgainstAverage';
type GoalieStatsCategory = 'savePctg' | 'shutouts' | 'wins' | 'goalsAgainstAverage';
export type StatsCategory = SkaterStatsCategory | GoalieStatsCategory;

export type StandingsCategory = 'conference' | 'division' | 'wildcard' | 'league';
