import fetch from 'node-fetch';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to fetch the image as a Data URL
app.post('/fetch-image', async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status} T_T`);
        }

        const buffer = await response.buffer();

        const base64 = buffer.toString('base64');

        const contentType = response.headers.get('content-type');
        const dataUrl = `data:${contentType};base64,${base64}`;

        res.json({ dataUrl });
    } catch (error) {
        console.error("Error fetching the image:", error.message);
        res.status(500).json({ error: 'Failed to fetch the image! =[' });
    }
});

// Route to handle text translation
app.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|en`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check the data structure and extract translation
        const translatedText = data.responseData.translatedText;

        console.log(translatedText)

        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to translate the text' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
