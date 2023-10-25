import axios from "axios";
export default async function handler(req, res) {
    try {
        const data = req.body;
        data.Credentials = {
            CompanyID: process.env.SUMIT_COMPANYID,
            APIKey: process.env.SUMIT_APIKEY
        };

        const response = await axios.post(process.env.SUMIT_CHARGE_ENDPOINT, data);

        // Handle the response as needed
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error handling payment:", error);
        res.status(500).json({ error: "An error occurred while processing the payment." });
    }

}
