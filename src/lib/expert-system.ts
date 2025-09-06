import { symptomDatabase } from "./symptomDatabase";

export async function processWithExpertSystem(query: string): Promise<string> {
  const lowercaseQuery = query.toLowerCase();

  // break query into tokens
  const queryTokens = lowercaseQuery
    .split(/[\s,.;:!?]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  // score diseases by number of symptom matches
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
    return "I understand you're not feeling well. Could you mention specific symptoms like fever, cough, headache, or diarrhoea?";
  }

  // just take top 1–2 matches
  const topMatches = scoredMatches.slice(0, 2);

  let response = "Based on your symptoms, here are the most likely conditions:\n\n";

  topMatches.forEach(({ disease, data, score }) => {
    const prettyName = disease.replace(/_/g, " ");

    response += `🩺 **${prettyName}** (matched ${score} symptom${score > 1 ? "s" : ""})\n`;
    response += `- **Description:** ${data.description.split(".")[0]}. \n`;
    response += `- **Typical symptoms:** ${data.symptoms.slice(0, 4).join(", ")}...\n`;
    response += `- **Next question:** ${data.questions[0]}\n`;

    // short summary line
    response += `_Summary: ${prettyName} often involves ${data.symptoms[0]} and related issues._\n\n`;
  });

  response += "Could you tell me more so I can refine the guidance?";

  return response;
}