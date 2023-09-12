import { Request, Response } from "express";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const filePath = process.env.FILE_PATH || "/home/backup";

export class BackupController {
  async startBackup(req: Request, res: Response) {
    let lockFileFound = false;

    const executeNextCommand = (command: string, callback: () => void) => {
      if (lockFileFound) {
        return;
      }

      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        callback();
      });
    };

    exec(`ls ${filePath}/lock`, (error: any, stdout: any, stderr: any) => {
      if (stdout) {
        lockFileFound = true;
        res.status(200).json({ message: "Um backup já está em andamento" });
      } else {
        res.status(200).json({ message: "Backup iniciado com sucesso!" });

        executeNextCommand(`touch ${filePath}/lock`, () => {
          executeNextCommand(`${filePath}/minecraft-backup.sh`, () => {
            executeNextCommand(`rm ${filePath}/lock`, () => {
              return;
            });
          });
        });
      }
    });
  }
}
