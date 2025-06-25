const functions = require('firebase-functions');
const axios = require('axios');
const cheerio = require('cheerio');

exports.trends = functions.https.onRequest(async (req, res) => {
    const type = req.path.includes('gpu') ? 'gpu' : 'cpu';

    const urls = {
        cpu: 'https://www.kabum.com.br/hardware/processadores',
        gpu: 'https://www.kabum.com.br/hardware/placas-de-video-vga'
    };

    try {
        const { data } = await axios.get(urls[type]);
        const $ = cheerio.load(data);
        const trends = [];

        $('.productCard').slice(0, 10).each((i, el) => {
            const name = $(el).find('.nameCard').text().trim();
            if (name) trends.push(name);
        });

        res.json({ trends });
    } catch (error) {
        console.error('Erro ao buscar tendências:', error.message);
        res.status(500).json({ error: 'Erro ao buscar tendências.' });
    }
});