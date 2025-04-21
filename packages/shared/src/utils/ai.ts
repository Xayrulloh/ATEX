import axios from "axios";

export async function generateDescription(
  productName: string,
): Promise<string> {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: `Tell me a short description about ${productName} with a maximum of 100 words.`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          "Content-Type": "application/json",
          "X-Title": "ATEX",
        },
      },
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("AI error:", error.response?.data || error.message);
    return "Description temporarily unavailable. Please try again later.";
  }
}
