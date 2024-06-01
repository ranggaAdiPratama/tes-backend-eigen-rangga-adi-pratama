import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  return res.json({ message: "Yatta!" });
});

export default router;
