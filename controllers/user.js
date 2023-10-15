const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  createAccount: async (req, res) => {
    try {
      const { firstName, lastName, email, birthday, password, repeatPassword, image } =
        req.body;

      if (password !== repeatPassword) {
        res.status(400).send("Passwords did not match!");
        return;
      }

      const excistingUser = await user.findOne({ email });

      if (excistingUser) {
        return res.status(409).send("User Already Exist");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      await user.create({
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        birthday: birthday,
        image: req.body.image,
        password: encryptedPassword,
      });

      res.status(201).send();
    } catch (err) {
      console.log(err);
    }
  },

  login: async (req, res) => {
    if (req && req.body && req.body.password && req.body.email) {
      let userObj = await user.findOne({ email: req.body.email });

      if (userObj) {
        let validPassword = await bcrypt.compare(
          req.body.password,
          userObj.password
        );

        if (!validPassword) {
          res
            .status(400)
            .send({ result: "Wrong credentials. Username and password did not match!" });
          return;
        }

        const token = jwt.sign(
          { user_id: userObj._id, email: userObj.email },
          config.TOKEN_KEY,
          {
            expiresIn: "4h",
          }
        );

        const response = {
          token: token,
          id: userObj._id,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email?.toLowerCase(),
          birthday: userObj.birthday,
        };

        res.send(response);
      } else {
        res.status(400).send({ result: "No User found" });
        return;
      }
    } else {
      res.status(400).send({ result: "No user found" });
      return;
    }
  },

  getUserById: async (req, res) => {
    let result = await user.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send("No user found");
    }
  },

  updateAccount: async (req, res) => {
    if (
      !( req && req.body && req.params && req.params.id && req.body.password === req.body.repeatPassword
      )
    ) {
      res.status(400).send({ result: "Not valid request" });
      return;
    }

    let userObj = await user.findOne({ _id: req.params.id });

    if (!userObj) {
      res.status(404).send({ result: "User not found!" });
      return;
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    let dbUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      birthday: req.body.birthday,
      image: req.body.image,
      password: encryptedPassword,
    };

    let result = await user.updateOne(
      { _id: req.params.id },
      { $set: dbUser }
    );
    res.status(200).send(result);
  },
};
