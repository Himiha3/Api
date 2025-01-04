const axios = require("axios");

exports.config = {
  name: "autolink",
  author: "Your_Name",
  description: "Download Facebook video by link and return detailed data",
  method: "post",
  category: "downloader",
  link: ["/autolink"]
};

exports.initialize = async function ({ req, res }) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.json({ success: false, message: "No URL provided", status: 400 });
    }

    const apiUrl = `https://api.azig.dev/media/downAIO?url=${url}&apikey=s0jtR16BKW`;

    // Fetch data from API
    const response = await axios.get(apiUrl);

    // Log raw API response for debugging
    console.log("API Response:", response.data);

    const videoData = response.data;

    if (!videoData.success || !videoData.data) {
      return res.json({
        success: false,
        message: "Error fetching video data",
        status: 404
      });
    }

    // Prepare the result
    const result = {
      success: true,
      data: {
        url: videoData.data.url,
        source: videoData.data.source,
        title: videoData.data.title,
        thumbnail: videoData.data.thumbnail,
        duration: videoData.data.duration,
        medias: videoData.data.medias.map(media => ({
          url: media.url,
          quality: media.quality,
          extension: media.extension,
          type: media.type
        })),
        type: videoData.data.type,
        error: videoData.data.error
      }
    };

    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);

    // Log error details
    console.error("Error details:", error.response?.data || error);

    return res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500
    });
  }
};
