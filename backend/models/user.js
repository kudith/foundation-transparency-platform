import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ID
  name: { type: String, required: true },
  communities: [{ type: String }], // Communities
  roles: [{ type: String }], // Roles
  statusPekerjaan: {
    type: String,
    enum: ["Pelajar", "Mahasiswa", "Pekerja", "Wirausaha", "Lainnya"],
  },
  kategoriUsia: {
    type: String,
    enum: ["<18", "18-25", "26-35", "36-45", ">45"],
  },
  domisili: { type: String },
  createdAt: { type: Date, required: true },
});

export default mongoose.model("User", UserSchema);
