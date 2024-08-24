import { ResponseBody } from "@google-cloud/storage/build/cjs/src/nodejs-common";
import { Request } from "express";
import { exec } from "child_process";

export class CommandsController {
  async executeCommandOnScreen(req: Request, res: ResponseBody) {
    try {
      const { command, screenName } = req.body;
      if (!command || !screenName) {
        return res
          .status(400)
          .json({ message: "Comando ou nome da tela não informados" });
      }
      const commandToSend = `screen -S ${screenName} -X stuff "${command}^M"`;
      console.log(commandToSend);

      exec(
        commandToSend,
        { maxBuffer: 1024 * 5000 },
        (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return res
              .status(400)
              .json({ message: "Erro ao executar o comando" });
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res
              .status(400)
              .json({ message: "Erro ao executar o comando" });
          }
          console.log(`stdout: ${stdout}`);

          return res
            .status(200)
            .json({ message: "Comando executado com sucesso!" });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Erro ao executar o comando" });
    }
  }

  async executeShellFile(req: Request, res: ResponseBody) {
    try {
      const { filePath } = req.body;
      if (!filePath) {
        return res
          .status(400)
          .json({ message: "Caminho do arquivo não informado" });
      }

      exec(
        filePath,
        { maxBuffer: 1024 * 5000 },
        (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return res
              .status(400)
              .json({ message: "Erro ao executar o arquivo" });
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res
              .status(400)
              .json({ message: "Erro ao executar o arquivo" });
          }
          console.log(`stdout: ${stdout}`);

          return res
            .status(200)
            .json({ message: "Arquivo executado com sucesso!" });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Erro ao executar o arquivo" });
    }
  }
}
