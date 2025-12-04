import mongoose from "mongoose";

// Admin role constants
export const ADMIN_ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password by default
    },
    role: {
      type: String,
      enum: {
        values: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN],
        message: "Role must be either admin or super_admin",
      },
      default: ADMIN_ROLES.ADMIN,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
