import express from "express";
import controller from "../controllers/appointmentsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC PAGES
router.get("/", controller.showHome);

router.get("/schedule", controller.showSchedulePage);
router.post("/schedule", controller.createAppointment);

router.get("/calendar", controller.showCalendar);

// PROTECTED ROUTES (must be logged in)
router.get("/edit/:id", requireAuth, controller.showEditPage);
router.post("/edit/:id", requireAuth, controller.updateAppointment);

router.get("/delete/:id", requireAuth, controller.deleteAppointment);

export default router;
