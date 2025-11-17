import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    patient: { type: String, required: true },
    doctor: { type: String, required: true },
    datetime: { type: String, required: true }
});

export default mongoose.model("Booking", bookingSchema);
