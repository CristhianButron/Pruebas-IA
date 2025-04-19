import express from "express";
import dotenv from "dotenv";
import Together from "together-ai";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Inicializa Together con tu API Key
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// Endpoint POST para interactuar con el modelo
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El campo 'message' es obligatorio." });
  }

  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      max_tokens: 1024, // Puedes ajustarlo según tus necesidades
    });

    const reply = response.choices[0].message.content;
    res.json({ response: reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar la solicitud." });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
