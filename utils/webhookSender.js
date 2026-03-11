const crypto = require("crypto");
const { readData } = require("./database");

const fireWebhooks = async (merchantId, oldStatus, newStatus) => {
  const allWebhooks = readData("webhooks") || [];
  if (allWebhooks.length === 0) return; 

  const payload = {
    event: "merchant.status_changed",
    data: {
      merchantId: merchantId,
      oldStatus: oldStatus,
      newStatus: newStatus,
      timestamp: new Date().toISOString()
    }
  };

  const payloadString = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET)
    .update(payloadString)
    .digest("hex");

  for (const url of allWebhooks) {
    sendWithRetries(url, payloadString, signature, 3);
  }
};

const sendWithRetries = async (url, payloadString, signature, maxRetries) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YQN-Signature": signature, 
        },
        body: payloadString,
      });

      if (response.ok) {
        console.log(`Webhook successfully delivered to ${url}`);
        break; 
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error(`Webhook attempt ${attempt} failed for ${url}: ${error.message}`);
      if (attempt === maxRetries) {
        console.error(`Gave up sending to ${url} after 3 attempts.`);
      }
    }
  }
};

module.exports = { fireWebhooks };