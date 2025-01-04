import express from "express";
import {createShortUrl, redirectToOriginalUrl} from "../controller/url.controller";

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/shorten/:shortId", redirectToOriginalUrl);

export default router;
