import axios from "axios";

export async function generateDescription(
  productName: string,
): Promise<string> {
  console.log("🚀 ~ generateDescription ~ productName:", productName);
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
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "X-Title": "ProductBot",
        },
      },
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("AI error:", error.response?.data || error.message);
    return "Description temporarily unavailable. Please try again later.";
  }
}
