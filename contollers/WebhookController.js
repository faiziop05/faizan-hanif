const { readData, saveData } = require("../utils/database");
const subscribeWebhook = async (req, res) => {
  try {
    const { targetUrl } = req.body;

    if (!targetUrl || !targetUrl.startsWith("http")) {
      return res.status(400).json({ message: "Please provide a valid targetUrl." });
    }

    const allWebhooks = readData("webhooks") || [];

    if (!allWebhooks.includes(targetUrl)) {
      allWebhooks.push(targetUrl);
      saveData("webhooks", allWebhooks);
    }

    return res.status(201).json({
      message: "Successfully subscribed to webhook notifications.",
      url: targetUrl
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { subscribeWebhook };