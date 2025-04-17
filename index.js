import express from "express";
import { InferenceClient } from "@huggingface/inference";

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración del cliente de Hugging Face
const client = new InferenceClient("tokens");

// Endpoint POST para interactuar con el modelo
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "El campo 'message' es obligatorio." });
    }

    try {
        const chatCompletion = await client.chatCompletion({
            provider: "together",
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            max_tokens: 512,
        });

        const response = chatCompletion.choices[0].message;
        res.json({ response });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Ocurrió un error al procesar la solicitud." });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});