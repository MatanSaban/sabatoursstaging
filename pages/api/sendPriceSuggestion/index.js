import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const body = req.body;

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "matansaban28@gmail.com",
                pass: "mdktipepukouclbh",
            },
        });

        const logoPath = path.join(process.cwd(), "public", "media", "sabantoursLogo.png");
        const logoData = fs.readFileSync(logoPath);
        const logoDataCid = `logo_${Date.now()}`;

        const htmlContent = ``;

        if (!body.pdfBlob) {
            // Handle the request which doesn't include the PDF blob
            // For now, just respond with success. You can add more logic if needed.
            return res.status(200).json({ success: true });
        }

        const base64Data = body.pdfBlob.split(",")[1];
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


        // Set up email data
        const mailOptions = {
            from: "matansaban28@gmail.com",
            to: body.userDetails.email,
            subject: "הצעת המחיר שלך מ-סבן טורס!",
            html: htmlContent,
            attachments: attachments
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error");
                console.log("error");
                console.log("error");
                console.log(error);
                return res.status(500).json({ success: false, error: error.message });
            } else {
                // You could save the verification code to a database here.
                // For simplicity, we're just returning it (not secure for production!).
                return res.status(200).json({ success: true });
            }
        });
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}
