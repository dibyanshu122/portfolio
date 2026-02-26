export default async function handler(req, res) {
    // 1. Sirf POST request allow karein (Security)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 2. Data extraction (Safe Parsing)
        // Vercel kabhi-kabhi body ko string deta hai aur kabhi object, isliye ye handle karna zaroori hai
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { userInput } = body;

        if (!userInput) {
            return res.status(400).json({ error: 'Input is required' });
        }

        // 3. API Key uthana
        // Yaad rakho Vercel Dashboard mein "GEMINI_API_KEY" hi naam rakhna
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API Key not configured on server' });
        }

        // 4. Gemini AI ko request bhejna
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "You are Dibyanshu's Portfolio AI. Answer briefly and professionally: " + userInput }]
                }]
            })
        });

        const data = await response.json();

        // 5. Final Response
        res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}