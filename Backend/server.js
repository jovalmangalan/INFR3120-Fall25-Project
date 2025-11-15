import express from "express";
import path from "path";
import appointmentsRouter from "./routes/appointments.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Static files
app.use(express.static("public"));

// Routes
app.use("/", appointmentsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
