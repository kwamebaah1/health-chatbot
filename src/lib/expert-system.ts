// lib/expert-system.ts
import { symptomDatabase } from "./symptomDatabase";

export async function processWithExpertSystem(query: string) {
  const lowercaseQuery = query.toLowerCase();

  const queryTokens = lowercaseQuery
    .split(/[\s,.;:!?]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const scoredMatches = Object.entries(symptomDatabase)
    .map(([disease, data]) => {
      // ✅ Check if disease name itself is mentioned
      const diseaseMatch = queryTokens.some((q) =>
        disease.toLowerCase().includes(q)
      );

      // ✅ Check symptom matches
      const symptomMatches = data.symptoms.filter((sym) =>
        queryTokens.some((q) => sym.toLowerCase().includes(q))
      );

      // Score: disease mention gets high weight, symptoms count adds more
      const score = (diseaseMatch ? 5 : 0) + symptomMatches.length;

      return { disease, data, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredMatches.length === 0) {
    return {
      type: "text",
      content:
        "I understand you're not feeling well. Could you mention specific symptoms like fever, cough, headache, or diarrhoea?",
      disclaimer:
        "⚠️ This is not medical advice. Please consult a qualified healthcare professional.",
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

  const confidenceLevel =
    topMatches[0].score >= 2 ? "medium-high" : "low";

  // Fallback to Together AI if confidence is low
  if (confidenceLevel === "low") {
    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a medical information assistant. Provide safe, factual, non-diagnostic advice.",
            },
            {
              role: "user",
              content: `Patient query: ${query}. Symptoms detected: ${queryTokens.join(", ")}.`,
            },
          ],
          max_tokens: 200,
        }),
      });

      const aiData = await response.json();
      const aiMessage = aiData.choices?.[0]?.message?.content ?? null;

      if (aiMessage) {
        return {
          type: "ai_fallback",
          matches: topMatches,
          ai_summary: aiMessage,
          disclaimer:
            "⚠️ This is informational only, not a medical diagnosis. Always consult a qualified healthcare professional.",
        };
      }
    } catch (error) {
      console.error("Mistral fallback failed:", error);
    }
  }

  return {
    type: "expert",
    matches: topMatches,
    confidence: confidenceLevel,
    disclaimer:
      "⚠️ This system provides general health information and is not a substitute for professional medical advice.",
  };
}