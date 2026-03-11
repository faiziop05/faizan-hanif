require("dotenv").config();
const express = require("express");
const app = express();
const AuthRoute = require("./routes/AuthRoute");
const MerchentRoute = require("./routes/MerchantRoute");
const WebhookRouter = require("./routes/WebhookRouter");
const port = 3000;

app.use(express.json()); 

app.get("/", (request, response) => {
  response.send("server is running.");
});

app.use("/api/auth", AuthRoute);
app.use("/api/merchants", MerchentRoute);
app.use("/api/webhooks", WebhookRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});