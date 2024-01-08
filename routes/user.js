const router = require("express").Router();
const User = require("../models/user-model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const notifyUser = (email, first_name, password) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Example: 'Gmail' or 'SMTP'
    auth: {
      user: "awaken.ansua.dutta@gmail.com",
      pass: process.env.AWAKEN_MAIL_APP_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: "awaken.ansua.dutta@gmail.com",
    to: email,
    subject: "Welcome to Awaken",
    text: `Dear ${first_name} 
      
I am so glad that you have signed up to learning about tools to help you create the life you deserve and dream of. 

Awaken is created to take you through 4 pillars of your life as you traverse your midlife waters, so you can get to know yourself better, thus feeling empowered to take steps that will lead you to more joy and more abundance in your life.

Watch this welcome video https://youtu.be/enRANjQgg-g

Your credentials for joining are here:

Email : ${email}
Password : ${password}

Please join our Facebook group page, especially designed for midlifers to share, and encourage each other on our journeys. I can’t wait to see you there.

As always, feel free to reach out if you have questions and comments. I am always keen to hear from you.

Enjoy discovering yourself and I am honored to be your guide!

Love and light,
Ansua
Awaken


      
      `,
  };
  console.log("enter 2");
  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("enter 3");
      console.log("email sent successfully");
    }
  });
};
//signup
router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const userData = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    profilePic: req.body.profilePic,
  });

  try {
    const user = await userData.save();
    if (user) {
      notifyUser(email, first_name, password);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/users", (req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).json(404);
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password)
      return res.status(200).json(404);

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/check", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // User with the provided email already exists
      return res.status(200).json({ exists: true });
    } else {
      // User with the provided email does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
