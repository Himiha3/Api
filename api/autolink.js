const axios = require('axios');

exports.config = {
    name: 'autolink',
    author: 'VLjnh',
    description: 'Fetches and downloads media from a given URL using azig.dev API',
    method: 'get',
    category: 'downloader',
    link: ['/autolink']
};

exports.initialize = async function ({ req, res }) {
    try {
        let url = req.query.url; // Lấy URL từ tham số truy vấn

        if (!url) {
            return res.status(400).json({ error: "Please add ?url=media_url_here" });
        }

        // Normalize the URL: ensure it starts with https://
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

        // Gửi yêu cầu đến API azig.dev với URL và API key
        const apiUrl = `https://api.azig.dev/media/downAIO?url=${encodeURIComponent(url)}&apikey=s0jtR16BKW`;
        const response = await axios.get(apiUrl);

        // Trả lại dữ liệu từ API
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error("Error fetching data from API:", error);
        res.status(500).json({ error: "Failed to fetch data from the provided URL via azig.dev API." });
    }
};
