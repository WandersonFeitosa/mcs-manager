import { Request, Response } from "express";
import { getFileNamesInFolder } from "../utils/getFileNamesInFolder";
import * as fs from "fs";

export class LogsController {
  async getFileNames(req: Request, res: Response) {
    const logsFilePath = process.env.LOGS_FILE_PATH || "/home/ssd/tcsmp/logs";
    const fileNames = await getFileNamesInFolder(logsFilePath);
    res.status(200).json({ fileNames });
  }

  async sendLog(req: Request, res: Response) {
    const { log } = req.params;
    const logsFilePath = process.env.LOGS_FILE_PATH || "/home/ssd/tcsmp/logs";
    const logFilePath = `${logsFilePath}/${log}`;

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

  async getLatestLog(req: Request, res: Response) {
    const file = fs.readFileSync("/home/ssd/tcsmp/logs/latest.log", "utf8");
    return res
      .status(200)
      .json({ message: "Comando executado com sucesso!", file });
  }
}
