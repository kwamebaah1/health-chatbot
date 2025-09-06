const symptomDatabase = {
  headache: {
    description: "Head pain or discomfort",
    questions: [
      "How severe is your headache? (1-10)",
      "Where is the pain located?",
      "How long have you had this headache?"
    ],
    possibleConditions: [
      "Tension headache",
      "Migraine",
      "Cluster headache",
      "Sinus headache"
    ]
  },
  fever: {
    description: "Elevated body temperature",
    questions: [
      "What is your temperature?",
      "How long have you had fever?",
      "Do you have chills or sweating?"
    ],
    possibleConditions: [
      "Viral infection",
      "Bacterial infection",
      "Inflammatory condition"
    ]
  }
  // Expand with more symptoms and conditions
}

export async function processWithExpertSystem(query: string): Promise<string> {
  // Simple keyword matching - you'd want a more sophisticated NLP approach
  const lowercaseQuery = query.toLowerCase()
  
  const matchedSymptoms = Object.entries(symptomDatabase)
    .filter(([symptom]) => lowercaseQuery.includes(symptom))
    .map(([symptom, data]) => ({ symptom, ...data }))
  
  if (matchedSymptoms.length === 0) {
    return "I understand you're not feeling well. Could you describe your symptoms in more detail? For example, you could mention specific symptoms like headache, fever, or cough."
  }
  
  let response = "Based on your description, I've identified possible symptoms. "
  
  matchedSymptoms.forEach(({ symptom, questions, possibleConditions }) => {
    response += `For ${symptom}: ${questions[0]} `
  })
  
  response += "Please provide more details so I can give you better guidance. Remember, I'm an AI assistant and not a substitute for professional medical advice."
  
  return response
}