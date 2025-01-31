require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const EXCHANGE_API = "https://api.exchangerate-api.com/v4/latest";

// Route to convert currency
app.get("/convert", async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const response = await axios.get(`${EXCHANGE_API}/${from}`);
        const rate = response.data.rates[to];

        if (!rate) {
            return res.status(400).json({ error: "Invalid currency code" });
        }

        const convertedAmount = (amount * rate).toFixed(2);
        res.json({ from, to, amount, convertedAmount, rate });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
