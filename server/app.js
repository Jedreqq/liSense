const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/api", (req, res, next) => {
    res.json({message: "Server is here."});
});

app.listen(PORT, () => {
    console.log(`Server running, listening on port ${PORT}`);
});