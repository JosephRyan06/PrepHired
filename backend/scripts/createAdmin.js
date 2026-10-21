require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Usage: node scripts/createAdmin.js "Full Name" email@example.com Password123
// The last argument is the password, the one before it is the email,
// and everything before that is the name (so quotes are optional).
const run = async () => {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('Usage: node scripts/createAdmin.js "Full Name" email password');
    process.exit(1);
  }

  const password = args[args.length - 1];
  const email = args[args.length - 2].trim().toLowerCase();
  const fullName = args.slice(0, -2).join(" ").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log(`"${email}" is not a valid email address.`);
    process.exit(1);
  }

  if (password.length < 8) {
    console.log("The password must be at least 8 characters long.");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI1) {
    console.log("MONGODB_URI1 is missing. Check backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI1);

    const existing = await User.findOne({ email });

    if (existing) {
      console.log(
        existing.role === "admin"
          ? `An admin account already exists for ${email}.`
          : `${email} already belongs to a regular user. Use a different email.`,
      );
      process.exit(1);
    }

    const [firstName, ...rest] = fullName.split(/\s+/);

    await User.create({
      firstName: firstName || "Admin",
      lastName: rest.join(" ") || "Admin",
      fullName: fullName || "Admin",
      email,
      password: await bcrypt.hash(password, 10),
      role: "admin",
      isEnabled: true,
      termsAccepted: true,
    });

    console.log(`Admin account created: ${email}`);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
