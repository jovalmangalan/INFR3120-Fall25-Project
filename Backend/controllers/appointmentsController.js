import Booking from "../models/bookingModel.js";

export default {
    // HOME PAGE – list upcoming appointments
    async showHome(req, res) {
        const appts = await Booking.find().sort({ datetime: 1 });
        res.render("home", { appts });
    },

    // SCHEDULE PAGE
    showSchedulePage(req, res) {
        res.render("schedule");
    },

    // CREATE NEW APPOINTMENT
    async createAppointment(req, res) {
        const { patient, doctor, datetime } = req.body;

        // check for double booking
        const conflict = await Booking.findOne({ doctor, datetime });
        if (conflict) {
            return res.send("This time slot is already taken.");
        }

        await Booking.create({ patient, doctor, datetime });
        res.redirect("/calendar");
    },

    // CALENDAR PAGE
    async showCalendar(req, res) {
        const appts = await Booking.find().sort({ datetime: 1 });
        res.render("calendar", { appts });
    },

    // EDIT PAGE
    async showEditPage(req, res) {
        const { id } = req.params;
        const appt = await Booking.findById(id);

        if (!appt) return res.send("Appointment not found");

        res.render("edit", { appt });
    },

    // UPDATE APPOINTMENT
    async updateAppointment(req, res) {
        const { id } = req.params;
        const { patient, doctor, datetime } = req.body;

        // prevent double booking (ignore current appointment)
        const conflict = await Booking.findOne({
            doctor,
            datetime,
            _id: { $ne: id }
        });

        if (conflict) {
            return res.send("This time slot is already taken.");
        }

        await Booking.findByIdAndUpdate(id, { patient, doctor, datetime });
        res.redirect("/calendar");
    },

    // DELETE APPOINTMENT
    async deleteAppointment(req, res) {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.redirect("/calendar");
    }
};
