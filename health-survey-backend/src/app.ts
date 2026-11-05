import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import activitiesRouter from "./modules/activities/activities.route";
import areasRouter from "./modules/areas/areas.route";
import authRouter from "./modules/auth/auth.route";
import dashboardRouter from "./modules/dashboard/dashboard.route";
import fieldWorkersRouter from "./modules/field-workers/field-workers.route";
import householdsRouter from "./modules/households/households.route";
import {
  assessmentsRouter,
  memberAssessmentsRouter,
} from "./modules/assessments/assessments.route";
import {
  householdMembersRouter,
  membersRouter,
} from "./modules/members/members.route";
import syncRouter from "./modules/sync/sync.route";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/auth", authRouter);
app.use("/api/areas", areasRouter);
app.use("/api/field-workers", fieldWorkersRouter);
app.use("/api/households/:householdId/members", householdMembersRouter);
app.use("/api/households", householdsRouter);
app.use("/api/members/:memberId/assessments", memberAssessmentsRouter);
app.use("/api/members", membersRouter);
app.use("/api/assessments", assessmentsRouter);
app.use("/api/sync", syncRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(errorHandler);

export default app;
