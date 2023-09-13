import { Router } from "express";
import cors from "cors";
import { BackupController } from "../controllers/BackupController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { LogsController } from "../controllers/LogsController";

const routes = Router();

routes.use(cors());

routes.use(authMiddleware);

routes.get("/startBackup", new BackupController().startBackup);
routes.get("/getLogsNames", new LogsController().getFileNames);
routes.get("/getLog/:log", new LogsController().sendLog);

export default routes;
