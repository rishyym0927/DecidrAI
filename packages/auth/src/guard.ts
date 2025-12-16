import { Request, Response, NextFunction } from "express";

export const requireInternalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const serviceSecret = req.headers["x-service-secret"];

    if (!serviceSecret || serviceSecret !== process.env.SERVICE_SECRET) {
        res.status(401).json({ error: "Unauthorized: Invalid Service Secret" });
        return;
    }

    next();
};
