import { Request, Response } from "express";

const userPassword = process.env.USER_PASSWORD as string;

export class UserController {
  async validateUser(req: Request, res: Response) {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Insira a senha" });
    }

    if (password != userPassword) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    return res.status(200).json({ message: "Usuário validado com sucesso!" });
  }
}
