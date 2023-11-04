import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    // Assuming `req.body` contains the file data and `offerId`
    const { fileData, offerId } = req.body; // You need to have the file data in a variable `fileData`

    // Create form data
    const formData = new FormData();
    formData.append("file", fileData, `price_offer_${offerId}.pdf`);
    formData.append("offerId", offerId); // Assuming your WordPress endpoint can handle this

    try {
      const mediaRes = await axios.post(
        `${process.env.DATA_SOURCE}/media`,
        formData, // send formData
        {
          headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
            // Don't set Content-Type manually; let Axios set it
          },
        }
      );

      const data = mediaRes.data;
      res.status(200).json({ data: data, status: 201 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error, errorMessage: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
