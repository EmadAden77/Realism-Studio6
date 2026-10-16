/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. POST /api/analyze-scene - AI-powered Arabic scene analyzer
app.post('/api/analyze-scene', async (req, res) => {
  try {
    const { description, currentScene } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!aiClient) {
      // Return flag to use deterministic client-side parser
      return res.json({
        fallback: true,
        message: 'Using deterministic interpretation engine'
      });
    }

    const systemInstruction = `You are an expert photographic optics and scene interpreter for the Realism Studio AI application.
You specialize in extracting structured parameters from Arabic natural language descriptions for realistic smartphone photography (Xiaomi 15 Ultra).
Extract the user's intent into structured parameters without overwriting locked identity fields (height, weight, skull, hairline, hair density).
Output strictly in JSON adhering to the specified schema.`;

    const promptText = `Analyze this Arabic scene description: "${description}"
Extract and map to realistic values:
- environmentCategory: one of ['bedroom', 'home_general', 'saudi_street', 'commercial', 'cafe', 'vehicle', 'gym', 'work']
- cameraMode: one of ['front_selfie', 'rear_main_self_capture', 'mirror_selfie', 'third_person_phone']
- lightingMode: one of ['phone_screen_only', 'natural_daylight', 'morning_daylight', 'late_afternoon', 'sunset', 'deep_night', 'ceiling_light_only', 'street_led', 'storefront_light', 'vehicle_dashboard', 'mixed_practical']
- upperGarment: description in Arabic and English
- lowerGarment: description in Arabic and English
- expression: subtle human emotion (no smile, calm, relaxed, slightly amused, tired, etc.)
- gaze: target (direct_lens, phone_screen, off_camera, etc.)
- poseHint: brief English description of natural posture
- disorderLevel: integer from 0 to 4 (default 2)`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            environmentCategory: { type: Type.STRING },
            cameraMode: { type: Type.STRING },
            lightingMode: { type: Type.STRING },
            upperGarmentEn: { type: Type.STRING },
            upperGarmentAr: { type: Type.STRING },
            lowerGarmentEn: { type: Type.STRING },
            lowerGarmentAr: { type: Type.STRING },
            expression: { type: Type.STRING },
            gaze: { type: Type.STRING },
            poseHint: { type: Type.STRING },
            disorderLevel: { type: Type.INTEGER },
            summaryAr: { type: Type.STRING }
          },
          required: [
            'environmentCategory',
            'cameraMode',
            'lightingMode',
            'upperGarmentEn',
            'lowerGarmentEn'
          ]
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('AI scene analysis failed:', error);
    return res.json({
      fallback: true,
      error: error.message || 'AI parsing unavailable'
    });
  }
});

// 2. POST /api/refine-prompt - Coherent English prompt refiner
app.post('/api/refine-prompt', async (req, res) => {
  try {
    const { rawPrompt, negativePrompt, sceneSummary } = req.body;

    if (!rawPrompt) {
      return res.status(400).json({ error: 'Raw prompt is required' });
    }

    if (!aiClient) {
      return res.json({
        fallback: true,
        refinedPrompt: rawPrompt,
        refinedNegativePrompt: negativePrompt
      });
    }

    const systemInstruction = `You are a photographic prompt engineer for diffusion models (Midjourney, Flux, SD3.5).
Refine the provided English prompt for physical consistency, natural syntax, and authentic smartphone snapshot fidelity.
RULES:
1. Preserve all identity constraints (hairline, density, height, body, facial hair, skin tone).
2. If phone-screen-only illumination is specified, do NOT add rim light, daylight, or extra studio lamps.
3. Keep the Xiaomi 15 Ultra camera specifications (21mm f/2.0 front or 23mm f/1.63 rear).
4. Strictly forbid digital wax skin, CGI cartoon textures, or runway fashion cliches.
5. Return clean JSON with "refinedPrompt" and "refinedNegativePrompt".`;

    const promptText = `Scene summary: ${JSON.stringify(sceneSummary || {})}
Current Raw Prompt:
"${rawPrompt}"

Current Negative Prompt:
"${negativePrompt}"

Refine both for maximum physical grounding and photographic realism without altering locked specifications.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedPrompt: { type: Type.STRING },
            refinedNegativePrompt: { type: Type.STRING },
            enhancementNotes: { type: Type.STRING }
          },
          required: ['refinedPrompt', 'refinedNegativePrompt']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('AI prompt refinement failed:', error);
    return res.json({
      fallback: true,
      refinedPrompt: req.body.rawPrompt,
      refinedNegativePrompt: req.body.negativePrompt,
      error: error.message
    });
  }
});

// 3. POST /api/review-image - Generated Image Realism Review Engine
app.post('/api/review-image', async (req, res) => {
  try {
    const { imageBase64, currentScene } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!aiClient) {
      return res.json({
        fallback: true,
        message: 'Using local deterministic physical evaluation engine'
      });
    }

    const systemInstruction = `You are a Senior Photographic Quality & Human Biomechanics Specialist for Realism Studio AI.
You evaluate generated images against physical rules, Xiaomi 15 Ultra camera optics (21mm f/2.0), and identity locks.
EVALUATE:
1. Facial identity preservation vs reference rules.
2. Hair density (no synthetic thickening at temples).
3. Human anatomy (selfie arm natural length 45-65cm, clavicle anchor, realistic hand joints).
4. Lighting falloff (if phone screen only, ensure background is genuinely dark with no fake rim light).
5. Fabric folds (mattress/hip compression).
Return JSON adhering to schema with specific review items and targeted prompt corrections. Do not guarantee perfect visual matches.`;

    // Extract base64 without data URI header if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: `Audit this generated image against scene state: ${JSON.stringify({
              camera: currentScene?.camera,
              lighting: currentScene?.lighting,
              pose: currentScene?.pose,
              hair: currentScene?.hair
            })}. Return physical consistency review.`
          }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessmentAr: { type: Type.STRING },
            targetedEditInstructionsEn: { type: Type.STRING },
            reviewItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  issueAr: { type: Type.STRING },
                  evidenceEn: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  suggestedPromptCorrectionEn: { type: Type.STRING },
                  elementsToPreserveEn: { type: Type.STRING }
                },
                required: ['id', 'category', 'severity', 'issueAr', 'evidenceEn', 'suggestedPromptCorrectionEn']
              }
            }
          },
          required: ['overallAssessmentAr', 'targetedEditInstructionsEn', 'reviewItems']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('AI image review failed:', error);
    return res.json({
      fallback: true,
      error: error.message
    });
  }
});

// 4. POST /api/analyze-reference - V3 Reference Fidelity Analyzer
app.post('/api/analyze-reference', async (req, res) => {
  try {
    const { referenceImageUrl, referenceImageName, options } = req.body;

    if (!referenceImageUrl) {
      return res.status(400).json({ error: 'referenceImageUrl is required' });
    }

    if (!aiClient) {
      return res.json({
        fallback: true,
        message: 'Using deterministic reference fidelity analyzer'
      });
    }

    const systemInstruction = `You are a forensic physical identity and reference fidelity auditor for Realism Studio AI V3.0.
Your mandate is the HONEST OBSERVATION PRINCIPLE:
- Extract visible physical characteristics of the subject from the provided reference photo.
- NEVER invent or assume details hidden by camera angle, shadows, hair styling, eyeglasses, occlusion, cropping, or resolution limits.
- For each property, classify visibility and confidence into one of: 'clearly_visible', 'partially_visible', 'uncertain', 'not_observable'.
- If hairline is partially covered by hair strands or shadows, classify it as 'partially_visible' and confidence 'uncertain'.
- Output strictly valid JSON conforming to the schema.`;

    const cleanBase64 = referenceImageUrl.includes('base64,')
      ? referenceImageUrl.split('base64,')[1]
      : referenceImageUrl;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: 'Analyze visible identity characteristics (head silhouette, hairline, hair density, beard, skin texture, asymmetries) preserving uncertainty for any hidden or shadow-occluded regions.'
          }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            uncertaintyNotesAr: { type: Type.STRING },
            hairCompatibility: {
              type: Type.OBJECT,
              properties: {
                isCompatible: { type: Type.BOOLEAN },
                hairlinePreserved: { type: Type.BOOLEAN },
                densityPreserved: { type: Type.BOOLEAN },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['isCompatible', 'hairlinePreserved', 'densityPreserved', 'warnings', 'suggestions']
            },
            observations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  property: { type: Type.STRING },
                  propertyNameAr: { type: Type.STRING },
                  value: { type: Type.STRING },
                  visibility: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                  source: { type: Type.STRING },
                  notes: { type: Type.STRING }
                },
                required: ['property', 'propertyNameAr', 'visibility', 'confidence', 'source']
              }
            }
          },
          required: ['uncertaintyNotesAr', 'hairCompatibility', 'observations']
        }
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('Reference analysis failed:', error);
    return res.json({
      fallback: true,
      error: error.message
    });
  }
});

// Vite Middleware for Full-stack Dev or Static Serve for Production
async function setupViteServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import('fs/promises');
        let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REALISM STUDIO AI server running at http://0.0.0.0:${PORT}`);
  });
}

setupViteServer();
