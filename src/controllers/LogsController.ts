import { Request, Response } from "express";
import { getFileNamesInFolder } from "../utils/getFileNamesInFolder";
import * as fs from "fs";

export class LogsController {
  logsFilePath = process.env.LOGS_FILE_PATH || "/home/ssd/tcsmp/logs";
  async getFileNames(req: Request, res: Response) {
    const fileNames = await getFileNamesInFolder(this.logsFilePath);
    res.status(200).json({ fileNames });
  }

  async sendLog(req: Request, res: Response) {
    const { log } = req.params;
    const logFilePath = `${this.logsFilePath}/${log}`;

    try {
      fs.readFile(logFilePath, (err, data) => {
        if (err) {
          res.status(404).json({
            message:
              "Arquivo não encontrado, por favor verifique se o nome está correto",
            sucess: false,
          });
        } else {
          res.send(data);
        }
      });
    } catch (err) {
      res.status(404).json({
        message: "Arquivo não , por favor verifique se o nome está correto",
        sucess: false,
      });
    }
  }
}
