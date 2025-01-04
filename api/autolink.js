const axios = require("axios");

let apiKeyData = {}; // Biến lưu trữ API Key

// Hàm lấy API Key từ API
async function getApiKey() {
  try {
    if (!apiKeyData.key) {
      const response = await axios.get("http://www.hungdev.id.vn/getApiKey");
      apiKeyData = response.data.data; // Lưu trữ API Key vào biến toàn cục
    }
    return apiKeyData;
  } catch (err) {
    console.error("Error in getApiKey:", err);
    throw new Error("Failed to fetch API Key");
  }
}

// Hàm xử lý tải xuống nội dung từ URL thông qua API của `hungdev.id.vn`
async function downloadWithApi(url, replyFunction) {
  try {
    const apiKey = await getApiKey();
    const apiUrl = `http://www.hungdev.id.vn/media/downaio?apikey=${apiKey.key}&url=${encodeURIComponent(
      url
    )}`;
    const response = await axios.get(apiUrl);

    const videoUrl = response.data.data.medias[0].url;
    const title = response.data.data.title;
    const author = response.data.data.author;

    // Trả về nội dung đã tải
    replyFunction({
      body: `Title: ${title}\n\nBy: ${author}`,
      attachment: await global.utils.getStreamFromURL(videoUrl),
    });
  } catch (err) {
    console.error("An error occurred while downloading media:", err);
    throw new Error("Failed to download media");
  }
}

// Cấu hình module
const config = {
  name: "autolink",
  author: "Lance Cochangco",
  description: "Downloads media from API of hungdev.id.vn",
  method: "get",
  category: "downloader",
  link: ["/downloader"],
};

// Hàm chính xử lý yêu cầu tải xuống
async function initialize({ req, res }) {
  try {
    let url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: "Please add ?url=media_url_here" });
    }

    // Chuẩn hóa URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    await downloadWithApi(url, async (response) => {
      res.json(response); // Trả về kết quả tải xuống qua API
    });
  } catch (error) {
    console.error("Error downloading media:", error);
    res.status(500).json({ error: "Failed to download media" });
  }
}

module.exports = {
  config,
  initialize,
  getApiKey,
  downloadWithApi,
};
