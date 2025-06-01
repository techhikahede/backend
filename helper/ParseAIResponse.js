

export const extractJsonArrayFromText= (text)  => {
  try {
    // Try to extract JSON inside ```json ... ``` block
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      const jsonString = match[1].trim();
      return JSON.parse(jsonString); // Parse it
    }

    // Fallback: Try to extract any array-like JSON in the text
    const arrayMatch = text.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (arrayMatch && arrayMatch[0]) {
      return JSON.parse(arrayMatch[0]);
    }

    return null;
  } catch (error) {
    console.error("Error extracting JSON:", error);
    return null;
  }
}
