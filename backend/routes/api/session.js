const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { validateLogin } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { User } = require("../../db/models");
const router = express.Router();

//--------------------------------------------------------------------------------------//
//                                        Log in                                        //
//--------------------------------------------------------------------------------------//
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "Invalid credentials" };
    if (err.errors && err.errors.credential === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return next(err);
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

//--------------------------------------------------------------------------------------//
//                                 Restore session user                                 //
//--------------------------------------------------------------------------------------//
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

//--------------------------------------------------------------------------------------//
//                                       Log out                                        //
//--------------------------------------------------------------------------------------//
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;
