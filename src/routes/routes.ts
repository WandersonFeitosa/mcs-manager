import { Router } from "express";
import cors from "cors";
import { BackupController } from "../controllers/BackupController";

const routes = Router();

routes.use(cors());

routes.get("/startBackup", new BackupController().startBackup);

export default routes;
