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

    showEditPage(req, res) {
        const { id } = req.params;
        const appts = loadAppointments();

        const appt = appts.find(a => a.id === id);
        if (!appt) return res.send("Appointment not found");

        res.render("edit", { appt });
    },

    updateAppointment(req, res) {
        const { id } = req.params;
        const { patient, doctor, datetime } = req.body;

        let appts = loadAppointments();
        const index = appts.findIndex(a => a.id === id);

        if (index === -1) return res.send("Appointment not found");

        // check for conflict
        const conflict = appts.find(
            (a) => a.doctor === doctor && a.datetime === datetime && a.id !== id
        );
        if (conflict) {
            return res.send("This time slot is already taken.");
        }

        appts[index] = { id, patient, doctor, datetime };
        saveAppointments(appts);

        res.redirect("/calendar");
    },

    deleteAppointment(req, res) {
        const { id } = req.params;
        let appts = loadAppointments();

        appts = appts.filter(a => a.id !== id);
        saveAppointments(appts);

        res.redirect("/calendar");
    }
};
