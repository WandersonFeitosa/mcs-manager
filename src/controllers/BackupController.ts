import { Request, Response } from "express";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const filePath = process.env.FILE_PATH || "/home/ssd/ncsmp";
const backupFileName = process.env.BACKUP_FILE_NAME || "start-backup.sh";

export class BackupController {
  async startBackup(req: Request, res: Response) {
    let lockFileFound = false;

    const executeNextCommand = (command: string, callback: () => void) => {
      if (lockFileFound) {
        return;
      }

      exec(command, { maxBuffer: 1024 * 5000 }, (error: any, stdout: any, stderr: any) => {
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

    exec(`ls ${filePath}/backup-lock`, (error: any, stdout: any, stderr: any) => {
      if (stdout) {
        lockFileFound = true;
        res.status(200).json({ message: "Um backup já está em andamento" });
      } else {
        res.status(200).json({ message: "Backup iniciado com sucesso!" });
        executeNextCommand(`touch ${filePath}/backup-lock`, () => {
          executeNextCommand(`${filePath}/${backupFileName}`, () => {
            return;
          });
        });
      }
    });
  }
}
