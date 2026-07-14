import express from "express";
const app = express();
const PORT = process.env.PORT || 9001;
app.get("/", (req, res) => {
    res.send("Hello World");
    })
app.get("/login", (req, res) => {
    res.send("Login Page");
    })  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })

