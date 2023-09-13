import { NextFunction, Request, Response } from "express";

const authToken = process.env.AUTH_TOKEN as string;

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Insira um token de acesso" })
    }

    const [type, token] = authorization.split(" ");

    if (token != authToken) {
        return res.status(401).json({ message: "Token de acesso inválido" })
    }

    next();

}