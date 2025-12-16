import { Request, Response, NextFunction } from "express";

export const requireInternalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const serviceSecret = req.headers["x-service-secret"];

    if (!process.env.SERVICE_SECRET) {
        console.error("Missing SERVICE_SECRET environment variable");
        res.status(500).json({ error: "Internal Server Error: Misconfiguration" });
        return;
    }

    if (!serviceSecret || serviceSecret !== process.env.SERVICE_SECRET) {
        res.status(401).json({ error: "Unauthorized: Invalid Service Secret" });
        return;
    }

    next();
};
