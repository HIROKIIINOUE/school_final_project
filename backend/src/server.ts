import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT ?? 4000);
app.use(express.json());

app.use((req, res) => {
  res.status(404).send("Invalid Page");
});

app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
