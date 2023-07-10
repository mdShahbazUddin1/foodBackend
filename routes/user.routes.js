const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.models");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const isUserPresent = await UserModel.findOne({ email: email });

    if (isUserPresent) {
      return res.status(301).send({ msg: "User already present" });
    }
    const hashPassword = await bcrypt.hash(password, 8);

    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      address,
    });
    await newUser.save();
    res.status(201).send({ msg: "User register successful", newUser });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserPresent = await UserModel.findOne({ email: email });

    if (!isUserPresent) {
      return res.status(401).send({ msg: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      isUserPresent.password
    );

    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Wrong Credential" });
    }

    const token = jwt.sign({ userId: isUserPresent._id }, "superman", {
      expiresIn: "1hr",
    });
    res.status(201).send({ msg: "login success", token });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.put("/user/:id/reset", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(401).send({ msg: "user not found" });
    }

    const isCurrentPassValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPassValid) {
      return res.status(401).send({ msg: "wrong password" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashPassword;
    await user.save();
    res.status(204);
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

module.exports = { userRouter };
