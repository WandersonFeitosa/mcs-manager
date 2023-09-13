import { Router } from "express";
import cors from "cors";
import { BackupController } from "../controllers/BackupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.use(cors());

routes.use(authMiddleware);

routes.get("/startBackup", new BackupController().startBackup);

export default routes;
