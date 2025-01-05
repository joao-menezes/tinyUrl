import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../models/url.model";

export const createShortUrl = async (req: Request, res: Response) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        res.status(400).json({ error: "URL original é obrigatória" });
        return
    }

    const shortId = nanoid(8);
    const newUrl = new Url({ originalUrl, shortId });

    try {
        await newUrl.save();
        res.status(201).json({ originalUrl, shortId });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar URL encurtada" });
    }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
    const { shortId } = req.params;

    try {
        const url = await Url.findOne({ shortId });
        if (url) {
            res.redirect(url.originalUrl);
            return
        } else {
            res.status(404).json({ error: "URL não encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar URL" });
    }
};

export const afterOneDayWipeServer = async () => {
    try {
        // const oneDayAgo = new Date(new Date().getTime() - 86400000);
        const result = await Url.deleteMany();
        console.log(`URLs expiradas apagadas: ${result.deletedCount}`);
    } catch (error) {
        console.error("Erro ao apagar URLs expiradas:", error);
    }
};