const router = require("express").Router();
const nodemailer = require("nodemailer");
const notifyAdmin = (email, first_name, last_name, newsletter) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Example: 'Gmail' or 'SMTP'
    auth: {
      user: "ansua.dutta.coaching@gmail.com",
      pass: process.env.AWAKEN_MAIL_APP_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: "Ansua <ansua.dutta.coaching@gmail.com>",
    // to: "cantadora@ansua.de , indradeep.mazumdar@gmail.com, renjith.cm@refactor.academy",
    to: "renjith.cm@refactor.academy ",
    subject: "Workshop Product Purchase",
    text: `Hello Admin,
    
We are pleased to inform you that a new customer has purchased the workshop product. Below are the details of the new customer:
        
Name: ${first_name} ${last_name}
Email : ${email}
Newsletter : ${newsletter}
               
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
      user: "ansua.dutta.coaching@gmail.com",
      pass: process.env.AWAKEN_MAIL_APP_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: "Ansua <ansua.dutta.coaching@gmail.com>",
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
    <br/>
<div>
    <center>
    
    <h3 >Thank you for signing up for </h3>
    

    <h2 style="margin: 0;">Unlocking Your Inner Wisdom </h2>
    <h3>A Journey into Listening and Harnessing Inner Guidance </h3>


    <h2>23rd March Saturday 4PM GMT +1 (Paris)</h2>
    <h2>11AM EST (New York)/ 8:30PM IST (India) </h2>
  

    <h3>Zoom link is below</h3>
    
    <h2>Payment of EUR 20 received with thanks!</h2>
    
    <h3 style="margin: 0">Bring your journal and markers/pens/pencils and water.</h3>
    <h3> Sweatpants welcome!</h3>

    
    <h3>Set a reminder and set this time aside for yourself and your inner wisdom. 

    I can’t wait to see you all!</h3>


    <h3>If you run into any problem please contact at ansua.dutta.coaching@gmail.com</h3>

   
    Love and light,<br>Ansua


    <h3>Ansua Dutta is inviting you to a scheduled Zoom meeting.</h3>
    <h3>Topic: Unlocking your Inner Wisdom Workshop</h3>
    <h3>Time: Mar 23, 2024 04:00 PM Paris</h3>
    <a href="https://us06web.zoom.us/j/81063196977?pwd=IpJdKLlWZ7hE49GCznUDQIp1nXLb8D.1">Join Zoom Meeting</a>
    <h3>Meeting ID: 810 6319 6977</h3>
    <h3>Passcode: 145635</h3>



    <a href="https://www.ansuadutta.com/">Check out my website</a>

    </center>



    </div>
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
  const { first_name, last_name, email, newsletter } = req.body;

  try {
    notifyAdmin(email, first_name, last_name, newsletter);
    notifyUser(email, first_name);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
