const express = require("express");
const app = express();
const AuthRoute = require("./routes/AuthRoute");
const MerchentRoute = require("./routes/MerchantRoute");
const port = 3000;

app.use(express.json()); 

app.get("/", (request, response) => {
  response.send("server is running.");
});

app.use("/api/auth", AuthRoute);
app.use("/api/merchant", MerchentRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});