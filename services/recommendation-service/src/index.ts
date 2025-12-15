import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "recommendation-service ok" });
});

app.listen(5001, () => {
  console.log("Recommendation Service running on port 5001");
});
