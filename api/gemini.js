export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body);
        const { userInput } = body;

        const API_KEY = process.env.GEMINI_API_KEY;

        // --- YEH HAI TUMHARA CONTEXT (Jo AI ko yaad dilaayega) ---
        const systemPrompt = `
        You are the Personal AI Assistant of Dibyanshu (also known as Rishu). 
        Context about Dibyanshu:
        - Work: Currently a Full Stack Developer at Anantya.ai.
        - Expertise: React, Node.js, Python (Django), PostgreSQL, and AI Integration.
        - Experience: Previously worked as an IT Manager at Phero Health Care.
        - Education: B.Tech in Computer Science from RITM Lucknow (8.05 CGPA).
        - Key Projects: AI Assistant "Jarvis", Real-time Voice Translator, CRM Portal with Google OAuth.
        - Personality: Professional, helpful, and tech-savvy.
        
        Your Job: If anyone asks about Dibyanshu's skills, experience, or identity, use this information to answer. Answer briefly and in a friendly way.
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: systemPrompt + "\n\nUser Question: " + userInput }] 
                }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
}