import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function handleApiError(res: Response, err: unknown, context: string) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${context}]`, message);
  const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
  res.status(status).json({ error: message });
}

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, mode, history } = req.body as {
      message?: string;
      mode?: string;
      history?: ChatHistoryItem[];
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 4000) {
      res.status(400).json({ error: 'Please provide a valid prompt under 4,000 characters.' });
      return;
    }

    const modeInstructions: Record<string, string> = {
      support:
        'You are the EZ AI WORLD Customer Support Assistant. Answer billing, onboarding, UPI scanner checkout (ezhila486@oksbi), and platform architecture questions clearly and concisely.',
      business:
        'You are the EZ AI WORLD Senior Business Strategist. Provide concrete, actionable growth plans, unit economics guidance, and go-to-market tactics.',
      qa:
        'You are the EZ AI WORLD Technical Q&A Architect. Give direct, accurate answers on automation pipelines, APIs, cloud reliability, and AI deployment.',
      sales:
        'You are the EZ AI WORLD Enterprise Solutions Concierge. Help prospects choose between Starter (₹1,499/mo), Growth (₹4,999/mo), and Enterprise (₹14,999/mo) across all 5 divisions.',
    };

    const systemInstruction = `${
      modeInstructions[mode || 'business'] || modeInstructions.business
    } Always respond in crisp, professional executive prose with structured bullet points when helpful. Platform contact details: Phone 9987353491, Email tenvilla60@gmail.com.`;

    const ai = getGeminiClient();
    const formattedHistory = Array.isArray(history)
      ? history.slice(-8).map((item) => ({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: String(item.text).slice(0, 2000) }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || 'No response generated.' });
  } catch (err) {
    handleApiError(res, err, 'api/ai/chat');
  }
});

app.post('/api/ai/workflow', async (req: Request, res: Response) => {
  try {
    const { goal, category, triggerType } = req.body as {
      goal?: string;
      category?: string;
      triggerType?: string;
    };

    if (!goal || typeof goal !== 'string' || goal.trim().length < 4 || goal.length > 1500) {
      res.status(400).json({ error: 'Describe your automation goal (4–1500 characters).' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Design a production automation blueprint for category "${category || 'workflow'}" with trigger "${triggerType || 'Incoming event'}". Business goal: ${goal.trim()}`,
      config: {
        systemInstruction:
          'You are an enterprise workflow automation architect at EZ AI WORLD. Output a structured JSON workflow blueprint with concrete steps, an email or support response template, and estimated weekly time saved.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workflowTitle: { type: Type.STRING },
            triggerSummary: { type: Type.STRING },
            estimatedHoursSavedPerWeek: { type: Type.NUMBER },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepName: { type: Type.STRING },
                  action: { type: Type.STRING },
                  owner: { type: Type.STRING },
                },
              },
            },
            messageTemplate: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    res.json({ blueprint: parsed });
  } catch (err) {
    handleApiError(res, err, 'api/ai/workflow');
  }
});

app.post('/api/ai/insights', async (req: Request, res: Response) => {
  try {
    const { businessContext, monthlyRevenue, activeCustomers } = req.body as {
      businessContext?: string;
      monthlyRevenue?: number;
      activeCustomers?: number;
    };

    if (!businessContext || typeof businessContext !== 'string' || businessContext.trim().length < 4) {
      res.status(400).json({ error: 'Provide a business scenario or question for analysis.' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Analyze this small/mid-size business context and produce an executive report. Monthly recurring revenue: ₹${Number(monthlyRevenue || 0).toLocaleString('en-IN')}. Active CRM accounts: ${Number(activeCustomers || 0)}. Context: ${businessContext.trim()}`,
      config: {
        systemInstruction:
          'You are an executive business intelligence analyst at EZ AI WORLD. Provide realistic, grounded revenue, retention, and operational optimization recommendations in JSON format.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            priorityInitiatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  actionStep: { type: Type.STRING },
                },
              },
            },
            riskWatch: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    res.json({ report: parsed });
  } catch (err) {
    handleApiError(res, err, 'api/ai/insights');
  }
});

app.post('/api/ai/video-script', async (req: Request, res: Response) => {
  try {
    const { productOrTopic, format, audience, tone } = req.body as {
      productOrTopic?: string;
      format?: string;
      audience?: string;
      tone?: string;
    };

    if (!productOrTopic || typeof productOrTopic !== 'string' || productOrTopic.trim().length < 3) {
      res.status(400).json({ error: 'Enter a product, brand, or campaign topic.' });
      return;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Create a high-converting video production package for format "${format || 'Instagram Reel / Shorts'}". Topic/Product: ${productOrTopic.trim()}. Target Audience: ${audience || 'Founders and online shoppers'}. Tone: ${tone || 'Confident & modern'}.`,
      config: {
        systemInstruction:
          'You are a creative director inside EZ AI WORLD AI Video Creator. Generate crisp, production-ready video hooks, scene-by-scene storyboards, voiceover lines, on-screen text overlays, and captions.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hookLine: { type: Type.STRING },
            durationEstimate: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timecode: { type: Type.STRING },
                  visualDirection: { type: Type.STRING },
                  voiceover: { type: Type.STRING },
                  onScreenText: { type: Type.STRING },
                },
              },
            },
            socialCaption: { type: Type.STRING },
            ctaLine: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    res.json({ production: parsed });
  } catch (err) {
    handleApiError(res, err, 'api/ai/video-script');
  }
});

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  message: string;
  submittedAt: string;
}

const recentInquiries: ContactSubmission[] = [];

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, division, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    division?: string;
    message?: string;
  };

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide your full name.' });
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!message || message.trim().length < 10) {
    res.status(400).json({ error: 'Please share at least 10 characters about your project.' });
    return;
  }

  const entry: ContactSubmission = {
    id: `INQ-${Date.now().toString(36).toUpperCase()}`,
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 150),
    phone: (phone || '').trim().slice(0, 30),
    division: (division || 'All Five Divisions').trim().slice(0, 80),
    message: message.trim().slice(0, 2000),
    submittedAt: new Date().toISOString(),
  };

  recentInquiries.unshift(entry);
  if (recentInquiries.length > 50) recentInquiries.pop();

  res.status(201).json({
    ok: true,
    referenceId: entry.id,
    routedTo: 'tenvilla60@gmail.com',
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT || 3000);

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EZ AI WORLD server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
