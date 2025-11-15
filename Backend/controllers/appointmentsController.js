import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "appointments.json");

function loadAppointments() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function saveAppointments(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default {
    showHome(req, res) {
        res.render("home");
    },

    showSchedulePage(req, res) {
        res.render("schedule");
    },

    createAppointment(req, res) {
        const { patient, doctor, datetime } = req.body;

        const appts = loadAppointments();

        // double-booking check
        const conflict = appts.find(
            (a) => a.doctor === doctor && a.datetime === datetime
        );

        if (conflict) {
            return res.send("This time slot is already taken.");
        }

        const newAppt = {
            id: Date.now().toString(),
            patient,
            doctor,
            datetime
        };

        appts.push(newAppt);
        saveAppointments(appts);

        res.redirect("/calendar");
    },

    showCalendar(req, res) {
        const appts = loadAppointments();
        res.render("calendar", { appts });
    },

    deleteAppointment(req, res) {
        const { id } = req.params;
        let appts = loadAppointments();

        appts = appts.filter(a => a.id !== id);
        saveAppointments(appts);

        res.redirect("/calendar");
    }
};
