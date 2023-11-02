import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, firstname } = req.body;

        // Generate a random 6-digit code
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(verificationCode);

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.inbox.co.il",
            port: "587",
            secure: false,
            auth: {
                user: "office@sabantours.co.il",
                pass: "Stst199456Stst",
            },
        });

        const logoPath = path.join(process.cwd(), "public", "media", "sabantoursLogo.png");
        const logoData = fs.readFileSync(logoPath);
        const logoDataCid = `logo_${Date.now()}`;



        const htmlContent = `
            <html>
                <head>
                <style>
                /* Your inline CSS styles here */
                body {
                font-family: Arial, sans-serif;
                }
                .header {
                background-color: #f2f2f2;
                padding: 10px;
                }
            </style>
                </head>
                <body>
                    <div class="header">
                        <h1>היי ${firstname} , קוד האימות שלך מוכן!</h1>
                        <h2>קוד האימות שלך הוא: ${verificationCode}</h2>
                    </div>
                    <p>
                        לאחר הזנת קוד האימות תקבל את הצעת המחיר מאיתנו באופן מיידי!
                        <br/>
                        במידה ולא קיבלת את הצעת המחיר, ניתן לפנות אלינו בטלפון - 0527984133
                        <br/>
                        תודה רבה, סבן טורס!
                        <br/>
                        <br/>
                        <img src="cid:${logoDataCid}" width="150" height="auto" />
                    </p>
                </body>
            </html>
        `;

        const attachments = [
            {
                filename: 'sabantours2.png',
                content: logoData,
                cid: logoDataCid
            }
        ];

        // Set up email data 
        const mailOptions = {
            from: '"סבן טורס" <office@sabantours.co.il>',
            to: email,
            subject: "קוד האימות שלך מ-סבן טורס",
            html: htmlContent,
            attachments: attachments
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, error: error.message });
            } else {
                // You could save the verification code to a database here.
                // For simplicity, we're just returning it (not secure for production!).
                return res.status(200).json({ success: true, code: verificationCode });
            }
        });
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}
