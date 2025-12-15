import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => {
  console.log("API Gateway running on port 4000");
});
