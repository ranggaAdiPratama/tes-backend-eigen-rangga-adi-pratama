import express from "express";

import * as controller from "../controllers/member.js";
import * as middleware from "../middleware.js";

const router = express.Router();

router.get("/", middleware.auth, controller.index);

export default router;
