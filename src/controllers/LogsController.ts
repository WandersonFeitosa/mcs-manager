import { Request, Response } from "express";
import { getFileNamesInFolder } from "../utils/getFileNamesInFolder";
import * as fs from 'fs';


export class LogsController {
    async getFileNames(req: Request, res: Response) {
        const fileNames = await getFileNamesInFolder("/home/ssd/ncsmp/logs");
        res.status(200).json({ fileNames });
    }

    async sendLog(req: Request, res: Response) {
        const { log } = req.params;
        const logFilePath = `/home/ssd/ncsmp/logs/${log}`;

        try {
            // Read the content of the log file asynchronously
            const logContent = await fs.promises.readFile(logFilePath, 'utf-8');
            res.status(200).send(logContent);
        } catch (err) {
            // Handle any errors (e.g., file not found)
            res.status(404).send("Log file not found");
        }
    }
}
