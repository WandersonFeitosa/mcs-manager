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
            fs.readFile(logFilePath, (err, data) => {
                if (err) {
                    res.status(404).send("Log file not found");
                } else {
                    res.send(data);
                }
            });
        } catch (err) {
            res.status(404).send("Log file not found");
        }
    }
}
