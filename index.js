// Bring in the Express tool
const express = require('express');
const app = express();
const AuthRoute=require("./routes/AuthRoute")
// Set the port (the "door" your server listens to)
const port = 3000;

// Tell the server what to do when someone visits the main page
app.get('/', (request, response) => {
  response.send('server is running.');
});

app.use('api/auth',AuthRoute)

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});