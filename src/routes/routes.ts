import { Router } from "express";
import cors from "cors";
import { BackupController } from "../controllers/BackupController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { LogsController } from "../controllers/LogsController";
import { UserController } from "../controllers/UserController";

const routes = Router();

routes.use(cors());

routes.use(authMiddleware);

routes.get("/startBackup", new BackupController().startBackup);
routes.get("/getLogsNames", new LogsController().getFileNames);
routes.get("/getLog/:log", new LogsController().sendLog);
routes.get("/getBackupList", new BackupController().getBackupList);
routes.get("/getBackup/:backupName", new BackupController().downloadBackup);
routes.post("/validateUser", new UserController().validateUser);

export default routes;
