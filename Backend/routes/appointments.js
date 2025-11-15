import express from "express";
import controller from "../controllers/appointmentsController.js";

const router = express.Router();

router.get("/", controller.showHome);
router.get("/schedule", controller.showSchedulePage);
router.post("/schedule", controller.createAppointment);
router.get("/calendar", controller.showCalendar);
router.get("/delete/:id", controller.deleteAppointment);

export default router;
