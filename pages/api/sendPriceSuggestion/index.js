import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body;
        const firstname = body.userDetails.firstname;
        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "matansaban28@gmail.com",
                pass: "mdktipepukouclbh", // Consider using environment variables for sensitive information
            },
        });

        const logoPath = path.join(process.cwd(), "public", "media", "sabantoursLogo.png");
        const logoData = fs.readFileSync(logoPath);
        const logoDataCid = `logo_${Date.now()}`;

        // Assuming htmlContent is defined somewhere in your actual code
        const htmlContent = `<html>
        <head>
        <style>
        /* Your inline CSS styles here */
        body {
        font-family: Arial, sans-serif;
        direction: rtl;
        }
        .header {
        background-color: #f2f2f2;
        padding: 10px;
        }
    </style>
        </head>
        <body dir="rtl">
            <div class="header">
                <h1>היי ${firstname} , הצעת המחיר שלך הגיעה בהצלחה!!</h1>
            </div>
            <p>
                במידה ומשהו לא מסתדר לגבי הצעת המחיר, ניתן לפנות אלינו בטלפון - 0527984133
                <br/>
                או בחזרה למייל הזה - office@sabantours.co.il
                <br/>
                ונשמח לסייע!
                <br/>
                בברכה, סבן טורס!
                <br/>
                <br/>
                <img src="cid:${logoDataCid}" width="150" height="auto" />
            </p>
        </body>
    </html>`;

        if (!body.pdfBase64) {
            return res.status(200).json({ success: false, reason: "no blob" });
        }

        const base64Data = body.pdfBase64.split(",")[1];
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        const attachments = [
            {
                filename: 'sabantours2.png',
                content: logoData,
                cid: logoDataCid
            },
            {
                filename: `הצעת מחיר סבן טורס -${body.offerId}.pdf`, 
                content: pdfBuffer,
                contentType: 'application/pdf',
            }
        ];

        // Set up email data for the user
        const mailOptions = {
            from: "matansaban28@gmail.com",
            to: body.userDetails.email,
            subject: "הצעת המחיר שלך מ-סבן טורס!",
            html: htmlContent,
            attachments: attachments
        };

        // Set up email data for the office
        const mailToOffice = {
            from: "matansaban28@gmail.com",
            to: "office@sabantours.co.il",
            subject: "הצעת מחיר חדשה הופקה",
            html: `הצעת מחיר חדשה הופקה באתר! <br/> שם פרטי: ${body.userDetails.firstname} <br/> שם משפחה: ${body.userDetails.lastname} <br/> טלפון: ${body.userDetails.phone} <br/> אימייל: ${body.userDetails.email}`,
            attachments: attachments
        };

        // Send email
        try {
            // Send the first email to the user
            await transporter.sendMail(mailOptions);
            // Send the second email to the office
            await transporter.sendMail(mailToOffice);

            // If both emails are sent successfully, send a success response
            return res.status(200).json({ success: true });
        } catch (error) {
            // If there's an error sending either email, send an error response
            console.error('Error sending mail:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    } else {
        // Handle wrong HTTP method
        res.status(405).json({ error: "Method not allowed." });
    }
}
