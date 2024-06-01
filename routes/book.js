import express from "express";

import * as controller from "../controllers/book.js";
import * as middleware from "../middleware.js";

const router = express.Router();

router.get("/", middleware.auth, controller.index);
router.post("/borrow", middleware.auth, controller.borrow);
router.post("/return", middleware.auth, controller.returnBook);

export default router;
