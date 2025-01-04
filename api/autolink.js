const axios = require("axios");

exports.config = {
  name: "autolink",
  author: "VLjnh",
  description: "Download All video by link and return detailed data",
  method: "post",
  category: "utility",
  link: ["/autolink"]
};

exports.initialize = async function ({ req, res }) {
  try {
    const { url } = req.body; // Lấy URL từ request

    if (!url) {
      return res.json({ success: false, message: "No URL provided", status: 400 });
    }

    // API URL với link video và API key
    const apiUrl = `https://api.azig.dev/media/downAIO?url=${url}&apikey=s0jtR16BKW`;

    // Gửi request đến API
    const response = await axios.get(apiUrl);
    const videoData = response.data;

    if (!videoData.success || !videoData.data) {
      return res.json({
        success: false,
        message: "Error fetching video data",
        status: 404
      });
    }

    // Chuẩn bị dữ liệu trả về
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
    return res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
      status: 500
    });
  }
};
