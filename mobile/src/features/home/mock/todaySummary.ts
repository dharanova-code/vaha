export interface TodaySummary {
  greeting: string;
  totalCapturesToday: number;
  reflectionPrompt: string;
}

export const todaySummary: TodaySummary = {
  greeting: "Good morning, Thought Companion",
  totalCapturesToday: 4,
  reflectionPrompt: "Is there any area of your thoughts you wish to sit with in silence today?",
};
