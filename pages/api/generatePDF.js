// pages/api/generatePDF.js

import ReactPDF from '@react-pdf/renderer';
import PdfDocument from '../../utils/generatePDF'; // Adjust the path as necessary

export default async (req, res) => {
    try {
        const { userDetails } = req.body;

        const pdfStream = ReactPDF.renderToStream(<PdfDocument userDetails={userDetails} />);

        const chunks = [];
        pdfStream.on('data', chunk => chunks.push(chunk));
        pdfStream.on('end', () => {
            const pdfBlob = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
            res.send(pdfBlob);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
