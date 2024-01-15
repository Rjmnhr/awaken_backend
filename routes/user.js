const router = require("express").Router();
const User = require("../models/user-model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const notifyAdmin = (email, first_name, last_name) => {
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
    from: "Awaken <awaken.ansua.dutta@gmail.com>",
    to: "cantadora@ansua.de , indradeep.mazumdar@gmail.com, renjith.cm@refactor.academy",
    subject: "New Registration",
    text: `Hello Awaken,
    
We are pleased to inform you that a new customer has registered on our platform. Below are the details of the new customer:
        
Name: ${first_name} ${last_name}
Email : ${email}
       
        
This new customer has expressed interest in our services and products.
    
Thank you for your attention, and let's work together to ensure our new customer has a great experience with our product.
        
Regards,
Awaken
      `,
  };

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
    from: "Awaken <awaken.ansua.dutta@gmail.com>",
    to: email,
    subject: "Welcome to Awaken",
    html: `
    <div style="text-align: center;">
    <div style="height: 70%; background: url(https://res.cloudinary.com/dsw1ubwyh/image/upload/v1704825641/nrc266m8t7ft6o2hmv89.jpg); background-repeat: no-repeat; background-size: cover; background-position: center; display: grid; place-items: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(250, 250, 250, 0.5);">
        </div>
        <h2 style="font-weight: 500; font-family: 'Marmelad', sans-serif; font-size: 80px; z-index: 1; color:white" class="mb-3">Awaken</h2>
      </div>
    </div>
    
    <p>Dear ${first_name},</p>
    <p>I am so glad that you have signed up to learning about tools to help you create the life you deserve and dream of.</p>
    <p>Awaken is created to take you through 4 pillars of your life as you traverse your midlife waters, so you can get to know yourself better, thus feeling empowered to take steps that will lead you to more joy and more abundance in your life.</p>
    <a href="https://youtu.be/enRANjQgg-g"> Watch this welcome video </a>

 
    <p>Please join our <a href="https://www.facebook.com/groups/733711701964744/"> Facebook group page</a>, especially designed for midlifers to share and encourage each other on our journeys. I can’t wait to see you there.</p>
    <p>As always, feel free to reach out if you have questions and comments. I am always keen to hear from you.</p>
    <p>Enjoy discovering yourself, and I am honored to be your guide!</p>
    <p>Love and light,<br>Ansua<br>Awaken</p>
  `,
  };

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
      notifyAdmin(email, first_name, last_name);
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
