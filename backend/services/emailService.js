const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetOtp = async (email, otp) => {
  await transporter.sendMail({
    from: `"PrepHired" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your PrepHired Password Reset Code",

    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          />

          <title>Password Reset - PrepHired</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              background-color: #f1f5f9;
              padding: 40px 15px;
            "
          >
            <tr>
              <td align="center">

                <!-- Main Card -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
                  "
                >

          
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #2563eb;
                        padding: 30px 40px;
                      "
                    >
                      <div
                        style="
                          color: #ffffff;
                          font-size: 26px;
                          font-weight: 700;
                          letter-spacing: -0.5px;
                        "
                      >
                        PrepHired
                      </div>

                      <div
                        style="
                          margin-top: 6px;
                          color: #dbeafe;
                          font-size: 13px;
                        "
                      >
                        Your career journey starts here.
                      </div>
                    </td>
                  </tr>


                  <tr>
                    <td style="padding: 42px 40px 35px;">

                      <!-- Security Icon -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>
                          <td align="center">

                            <div
                              style="
                                width: 64px;
                                height: 64px;
                                line-height: 64px;
                                background-color: #eff6ff;
                                border-radius: 50%;
                                text-align: center;
                              "
                            >
                              <i
                                class="fa-solid fa-shield-halved"
                                style="
                                  color: #2563eb;
                                  font-size: 30px;
                                  line-height: 64px;
                                "
                              ></i>
                            </div>

                          </td>
                        </tr>
                      </table>

                      <!-- Title -->
                      <h1
                        style="
                          margin: 22px 0 0;
                          text-align: center;
                          color: #111827;
                          font-size: 26px;
                          line-height: 34px;
                          font-weight: 700;
                        "
                      >
                        Password Reset
                      </h1>

                      <!-- Description -->
                      <p
                        style="
                          margin: 16px 0 0;
                          text-align: center;
                          color: #64748b;
                          font-size: 15px;
                          line-height: 24px;
                        "
                      >
                        We received a request to reset the password
                        for your PrepHired account.
                      </p>

                      <!-- OTP Card -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          margin-top: 30px;
                          background-color: #f8fafc;
                          border: 1px solid #e2e8f0;
                          border-radius: 12px;
                        "
                      >
                        <tr>
                          <td
                            align="center"
                            style="padding: 28px 20px;"
                          >

                            <!-- Key Icon -->
                            <i
                              class="fa-solid fa-key"
                              style="
                                color: #2563eb;
                                font-size: 22px;
                              "
                            ></i>

                            <div
                              style="
                                margin-top: 8px;
                                color: #64748b;
                                font-size: 12px;
                                font-weight: 700;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                              "
                            >
                              Verification Code
                            </div>

                            <!-- OTP -->
                            <div
                              style="
                                margin-top: 14px;
                                color: #2563eb;
                                font-size: 36px;
                                line-height: 44px;
                                font-weight: 700;
                                letter-spacing: 9px;
                                padding-left: 9px;
                              "
                            >
                              ${otp}
                            </div>

                            <!-- Timer Icon + Expiration -->
                            <div
                              style="
                                margin-top: 14px;
                                color: #64748b;
                                font-size: 13px;
                              "
                            >
                              <i
                                class="fa-regular fa-clock"
                                style="
                                  color: #64748b;
                                  font-size: 15px;
                                  margin-right: 4px;
                                "
                              ></i>

                              This code expires in
                              <strong style="color: #334155;">
                                10 minutes
                              </strong>.
                            </div>

                          </td>
                        </tr>
                      </table>

                      <!-- Security Notice -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          margin-top: 22px;
                          background-color: #fffbeb;
                          border: 1px solid #fde68a;
                          border-radius: 10px;
                        "
                      >
                        <tr>
                          <td style="padding: 18px 20px;">

                            <!-- Warning Icon -->
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                            >
                              <tr>
                                <td
                                  style="
                                    width: 30px;
                                    vertical-align: top;
                                  "
                                >
                                  <i
                                    class="fa-solid fa-triangle-exclamation"
                                    style="
                                      color: #d97706;
                                      font-size: 21px;
                                    "
                                  ></i>
                                </td>

                                <td
                                  style="
                                    color: #92400e;
                                    font-size: 14px;
                                    font-weight: 700;
                                    padding-bottom: 7px;
                                  "
                                >
                                  Security Notice
                                </td>
                              </tr>
                            </table>

                            <p
                              style="
                                margin: 0;
                                color: #92400e;
                                font-size: 13px;
                                line-height: 21px;
                              "
                            >
                              You have a maximum of
                              <strong>5 attempts</strong>
                              to enter the correct verification code.
                              Never share this code with anyone.
                            </p>

                          </td>
                        </tr>
                      </table>

                      <!-- Information Section -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="margin-top: 25px;"
                      >
                        <tr>

                          <!-- Info Icon -->
                          <td
                            width="30"
                            valign="top"
                          >
                            <i
                              class="fa-solid fa-circle-info"
                              style="
                                color: #94a3b8;
                                font-size: 19px;
                              "
                            ></i>
                          </td>

                          <td
                            style="
                              color: #64748b;
                              font-size: 14px;
                              line-height: 22px;
                            "
                          >
                            If you didn't request a password reset,
                            you can safely ignore this email.
                            Your account remains secure.
                          </td>

                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div
                        style="
                          height: 1px;
                          background-color: #e5e7eb;
                        "
                      ></div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      align="center"
                      style="padding: 25px 40px 30px;"
                    >

                      <!-- Lock Footer Icon -->
                      <i
                        class="fa-solid fa-lock"
                        style="
                          color: #94a3b8;
                          font-size: 18px;
                          margin-bottom: 8px;
                        "
                      ></i>

                      <p
                        style="
                          margin: 0;
                          color: #94a3b8;
                          font-size: 12px;
                          line-height: 19px;
                        "
                      >
                        This is an automated message from PrepHired.
                        Please do not reply to this email.
                      </p>

                      <p
                        style="
                          margin: 10px 0 0;
                          color: #cbd5e1;
                          font-size: 11px;
                        "
                      >
                        © ${new Date().getFullYear()} PrepHired.
                        All rights reserved.
                      </p>

                    </td>
                  </tr>

                </table>

                <p
                  style="
                    margin: 20px 0 0;
                    color: #94a3b8;
                    font-size: 11px;
                    text-align: center;
                  "
                >
                  Secure account verification • PrepHired
                </p>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};

module.exports = {
  sendPasswordResetOtp,
};
