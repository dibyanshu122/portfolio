// Backend for the "Ask the Core" terminal on /new/.
// Separate from api/gemini.js so the old site keeps working unchanged.
// Uses the same GEMINI_API_KEY environment variable on Vercel.
// Optional GEMINI_MODEL overrides the model; the list below is tried in order.

const FACTS = `You are Dibyanshu Singh's AI portfolio assistant ("the Core"). Answer directly and accurately from these facts only. Never invent anything. Max 80 words. Friendly, professional, third person ("he").

ABOUT: Dibyanshu Singh, AI Engineer & Software Developer, Noida, India. 3+ years building production LLM, RAG and agentic AI systems.

CURRENT ROLE: Senior AI Engineer at SPM Medicare Pvt. Ltd. (Aug 2026 - present): production LLM and agentic features with LangChain + LangGraph (tool calling, evaluation, safety guardrails); RAG pipelines over domain documents; owns FastAPI + PostgreSQL + AWS services end to end incl. monitoring and cost/latency optimisation.

PREVIOUS:
- Full Stack Developer, RingPass Services Pvt. Ltd. (Sep 2025 - Aug 2026, New Delhi): 3-tier multi-agent system (Researcher, Critic, Writer) with LangChain + LangGraph + Pinecone RAG; Next.js + PostgreSQL enterprise CRM with Google OAuth 2.0, 4-role RBAC, HTTP-only cookies; onboarding automation cut manual setup 80%; Razorpay + Rozgar Pay webhooks with retry/backoff at 99.8% success; DB latency -45%; 10K+ daily active users.
- Backend Developer, Phero Health Care Pvt. Ltd. (Aug 2023 - Sep 2025, Delhi): Django + Node.js microservices, 100K+ daily API requests, 50K+ monthly users, 99.5% uptime; led MySQL to MongoDB migration with sharding (500ms to 350ms); HIPAA-compliant RBAC, AES-256 at rest, audit logging, AWS EC2/RDS auto-scaling.

FLAGSHIP PROJECT: B9 Automation, a multi-tenant WhatsApp AI SaaS he built and runs. Used by 100+ businesses, 100K+ requests/day, sub-1s AI replies across 1,000+ concurrent sessions, 95%+ retention. 86+ REST endpoints, 62+ PostgreSQL models, JWT auth, 9 live integrations (Meta WhatsApp Cloud API, Razorpay, Shopify, IndiaMART, Facebook Ads, Google Sheets...). Agentic core: autonomous agent builder, RAG over business documents, Groq Llama 3.3 + Gemini 2.0 Flash failover, lead scoring, prompt-safety guardrails. No-code 37-node flow builder, Celery + Redis campaign engine, Razorpay tiered billing, AWS EC2. Live: b9-automation-frontend.vercel.app

OTHER PROJECTS: Nexus AI Insight Engine (3-tier multi-agent research: Researcher, Critic, Writer; Tavily live web search; Pinecone RAG memory; sub-2s; PDF export; Next.js + FastAPI + LangGraph + Gemini). Full-Stack Auth & CRM Portal (Next.js, Node.js, PostgreSQL, Google OAuth 2.0, RBAC, CSRF, real-time Razorpay, admin analytics, Nodemailer credential emails).

SKILLS: Python, FastAPI, Django, Node.js, REST, microservices, SQLAlchemy, Celery, Redis, Pydantic, Pytest; Next.js 15, React, TypeScript, Tailwind, Zustand; LangChain, LangGraph, multi-agent systems, tool calling, prompt engineering, guardrails, LLM evaluation, LLM failover/routing, RAG, vector embeddings, semantic search, Groq (Llama 3.3), Gemini 2.0 Flash, Pinecone; PostgreSQL (Supabase), MongoDB, MySQL, Redis; AWS EC2/S3/RDS, Docker, GitHub Actions, CI/CD, Linux, Vercel, Render; JWT, OAuth 2.0, RBAC, CSRF, Fernet (AES), HIPAA.

EDUCATION: B.Tech Computer Science & Engineering, Rameshwaram Institute of Technology & Management, Lucknow (2019-2023), CGPA 8.05/10, Best Computer Science Student Award. Certifications: Python Programming (IIT Kanpur, 2024), Google Analytics IQ (2024), Accenture Data Analytics & Visualization Simulation (Forage, 2024), HackerRank 5-Star Problem Solver (DSA).

CONTACT: ddibyanshu2@gmail.com, +91 96289 54948 (WhatsApp), linkedin.com/in/dibyanshu-singh-ai/, github.com/dibyanshu122. Open to interesting AI / agentic work.

RULES: answer only what is asked; if greeted, greet briefly; if asked something outside these facts, say you only know about Dibyanshu's work and suggest emailing him.`;

// Google retires models without notice, so try a short list in order.
const MODELS = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash']
  .filter((m, i, a) => m && a.indexOf(m) === i);

// Per-instance rate limit: 20 questions per IP per 10 minutes.
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 20;
}

async function generate(apiKey, prompt) {
  let last = 'empty answer';
  for (const model of MODELS) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.6 }
      })
    });
    const data = await r.json();
    const c = data && data.candidates && data.candidates[0];
    const text = c && c.content && c.content.parts && c.content.parts[0] && c.content.parts[0].text;
    if (text) return { text: text.trim(), model };
    last = (data && data.error && data.error.message) || `HTTP ${r.status}`;
    // only move on to the next model when this one is gone; quota/auth errors are the same for every model
    if (!/not found|no longer available|not supported|deprecated/i.test(last)) break;
  }
  return { error: last };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    const q = String((body && body.q) || '').slice(0, 400).trim();
    if (!q) return res.status(400).json({ error: 'Missing q' });

    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'unknown';
    if (limited(ip)) return res.status(429).json({ error: 'Too many questions, try again in a few minutes' });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const out = await generate(API_KEY, FACTS + '\n\nUser: ' + q);
    console.log('[core]', JSON.stringify({ q, model: out.model || null, error: out.error || null }));
    if (!out.text) return res.status(502).json({ error: 'No answer', details: out.error });
    res.status(200).json({ text: out.text, model: out.model });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
}
