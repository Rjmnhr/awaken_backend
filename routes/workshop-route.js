const router = require("express").Router();
const nodemailer = require("nodemailer");
const notifyAdmin = (email, first_name, last_name, phone) => {
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
    // to: "cantadora@ansua.de , indradeep.mazumdar@gmail.com, renjith.cm@refactor.academy",
    to: "renjith.cm@refactor.academy",
    subject: "Workshop Product Purchase",
    text: `Hello Admin,
    
We are pleased to inform you that a new customer has purchased the workshop product. Below are the details of the new customer:
        
Name: ${first_name} ${last_name}
Email : ${email}
Phone : ${phone}
               
      `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
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
        <h2 style="font-weight: 500; font-family: 'Marmelad', sans-serif; font-size: 80px; z-index: 1; color:white" class="mb-3">Workshop</h2>
      </div>
    </div>
    
    <p>Dear ${first_name},</p>


    <p>Your Payment is Successful!</p>
    <p>I am so glad that you have purchased out Workshop product.</p>
    <p>You will be receiving your payment receipt shortly</p>

   
    <>Love and light,<br>Ansua
  `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("email sent successfully");
    }
  });
};

router.post("/sendEmail", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    notifyAdmin(email, first_name, last_name, phone);
    notifyUser(email, first_name);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
