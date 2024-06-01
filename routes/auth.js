import express from "express";

import * as controller from "../controllers/auth.js";
import * as middleware from "../middleware.js";

const router = express.Router();

router.post("/login", controller.login);
router.post("/logout", middleware.auth, controller.logout);
router.post("/refresh", middleware.auth, controller.refresh);

export default router;
