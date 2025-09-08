import { symptomDatabase } from "./symptomDatabase";

export async function processWithExpertSystem(query: string) {
  const lowercaseQuery = query.toLowerCase();

  const queryTokens = lowercaseQuery
    .split(/[\s,.;:!?]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const scoredMatches = Object.entries(symptomDatabase)
    .map(([disease, data]) => {
      const symptomMatches = data.symptoms.filter((sym) =>
        queryTokens.some((q) => sym.toLowerCase().includes(q))
      );
      return { disease, data, score: symptomMatches.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredMatches.length === 0) {
    return {
      type: "text",
      content:
        "I understand you're not feeling well. Could you mention specific symptoms like fever, cough, headache, or diarrhoea?",
    };
  }

  const topMatches = scoredMatches.slice(0, 2).map(({ disease, data, score }) => ({
    name: disease.replace(/_/g, " "),
    score,
    description: data.description,
    symptoms: data.symptoms.slice(0, 5),
    question: data.questions[0],
    summary: `${disease.replace(/_/g, " ")} often involves ${data.symptoms[0]} and related issues.`,
  }));

  return {
    type: "expert",
    matches: topMatches,
  };
}