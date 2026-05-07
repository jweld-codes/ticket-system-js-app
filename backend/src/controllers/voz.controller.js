import { GoogleGenAI } from "@google/genai";
import wav from "wav";
import { PassThrough } from "stream";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const pcmToWavBase64 = async (pcmBase64) => {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");

  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = new PassThrough();

    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });

    writer.on("data", (chunk) => chunks.push(chunk));
    writer.on("end", () => {
      const wavBuffer = Buffer.concat(chunks);
      resolve(wavBuffer.toString("base64"));
    });
    writer.on("error", reject);

    stream.end(pcmBuffer);
    stream.pipe(writer);
  });
};

export const generarAudio = async (req, res) => {
  try {
    const { texto } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "No se encontró GEMINI_API_KEY en .env",
      });
    }

    if (!texto) {
      return res.status(400).json({
        message: "Debe enviar texto",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            {
              text: `[clear, professional, warm voice] ${texto}`,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede",
            },
          },
        },
      },
    });

    const audioPcmBase64 =
      response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!audioPcmBase64) {
      return res.status(500).json({
        message: "Gemini no devolvió audio",
        response,
      });
    }

    const audioWavBase64 = await pcmToWavBase64(audioPcmBase64);

    res.json({
      audio: audioWavBase64,
      mimeType: "audio/wav",
    });

  } catch (error) {
    console.error("ERROR GEMINI TTS:", error);

    res.status(500).json({
      message: "Error generando voz",
      error: error.message,
    });
  }
};