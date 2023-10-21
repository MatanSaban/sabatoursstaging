import axios from "axios";

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const body = req.body;

            const mediaRes = await axios.post(
                `${process.env.DATA_SOURCE}/media`,
                body,
                {
                  headers: {
                    Authorization: `${process.env.WORDPRESSTOKEN}`,
                    "Content-Disposition": `form-data; filename="price_offer_${body.offerId}.pdf"`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              const data = mediaRes.data;

            res.status(200).json({data: data, status: 201 });

        } catch (error) { 
            res.status(500).json({ error: error, errorMessage: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

