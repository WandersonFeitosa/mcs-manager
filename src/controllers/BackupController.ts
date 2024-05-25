import { Request, Response } from "express";
import { exec } from "child_process";
import dotenv from "dotenv";
import { getFileNamesInFolder } from "../utils/getFileNamesInFolder";
import { Storage } from "@google-cloud/storage";
import { sendMessageToDiscord } from "../utils/sendMessageToDiscord";

dotenv.config();

const filePath = process.env.FILE_PATH || "/home/ssd/tcsmp";
const backupFileName = process.env.BACKUP_FILE_NAME || "minecraft_backup.sh";
const startFileName = process.env.START_FILE_NAME || "start_server.sh";
const absoluteBackupPath = process.env.ABSOLUTE_BACKUP_PATH || "/home/ssd";

export class BackupController {
  async startBackup(req: Request, res: Response) {
    let lockFileFound = false;

    const executeNextCommand = (command: string, callback: () => void) => {
      if (lockFileFound) {
        return;
      }

      exec(
        command,
        { maxBuffer: 1024 * 5000 },
        (error: any, stdout: any, stderr: any) => {
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
        }
      );
    };

    exec(
      `ls ${filePath}/backup-lock`,
      (error: any, stdout: any, stderr: any) => {
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
      }
    );
  }
  async getBackupList(req: Request, res: Response) {
    let filesList: string[] = await getFileNamesInFolder(`/home/ssd`);

    for (let i = 0; i < filesList.length; i++) {
      if (!filesList[i].startsWith("backup")) {
        filesList.splice(i, 1);
      }
    }
    res.status(200).json({ filesList });
  }

  async downloadBackup(req: Request, res: Response) {
    const { backupName } = req.params;

    const absolutePath = `${absoluteBackupPath}/${backupName}`;

    try {
      exec(`ls ${absolutePath}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          res.status(404).json({ message: "Arquivo não encontrado" });
          return;
        }
        if (stderr) {
          res.status(404).json({ message: "Arquivo não encontrado" });
          return;
        }

        res.download(absolutePath);
      });
    } catch (error) {
      res.status(404).json({ message: "Arquivo não encontrado" });
    }
  }
  async startServer(req: Request, res: Response) {
    exec(
      `${filePath}/${startFileName}`,
      { maxBuffer: 1024 * 5000 },
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );

    res.status(200).json({ message: "Servidor iniciado com sucesso!" });
  }

  async uploadBackup(req: Request, res: Response) {
    const { fileName } = req.body;
    const backupsFolderAbsolutePath: string =
      process.env.BACKUPS_FOLDER_PATH || "/home/hd";
    try {
      const storage = new Storage({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      const bucketName = process.env.BUCKET_NAME as string;

      const filePath = `${backupsFolderAbsolutePath}/${fileName}`;

      res.status(200).json({ message: "Backup iniciado com sucesso!" });

      console.log(`Uploading file ${fileName} to ${bucketName}...`);

      const [file] = await storage.bucket(bucketName).upload(filePath);

      console.log(`File ${file.name} uploaded to ${bucketName}`);

      await sendMessageToDiscord(
        `**${fileName}** foi enviado para o Google Cloud Storage com sucesso!`
      );

      return;
    } catch (error: any) {
      console.log(error);

      await sendMessageToDiscord(
        `Erro ao fazer upload do arquivo **${fileName}**:` +
          "```" +
          error +
          "```"
      );
    }
  }
}
