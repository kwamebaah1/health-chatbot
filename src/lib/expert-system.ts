import { symptomDatabase } from "./symptomDatabase";

export async function processWithExpertSystem(query: string): Promise<string> {
  const lowercaseQuery = query.toLowerCase();

  const matched = Object.entries(symptomDatabase).filter(
    ([disease, data]) =>
      lowercaseQuery.includes(disease.toLowerCase()) ||
      data.symptoms.some((sym) => lowercaseQuery.includes(sym.trim().toLowerCase()))
  );

  if (matched.length === 0) {
    return "I understand you're not feeling well. Could you describe your symptoms in more detail? For example, mention specific ones like headache, fever, cough, or rash.";
  }

  let response = "Based on your description, I found some possible matches:\n\n";

  matched.forEach(([disease, data]) => {
    response += `🩺 **${disease}**\n`;
    response += `- Description: ${data.description}\n`;
    response += `- First question: ${data.questions[0]}\n`;
    response += `- Common symptoms: ${data.symptoms.join(", ")}\n`;
    response += `- Suggested precautions: ${data.precautions.join(", ")}\n\n`;
  });

  response +=
    "Please provide more details so I can refine the guidance. Remember, I'm an AI assistant and not a substitute for professional medical advice.";

  return response;
}