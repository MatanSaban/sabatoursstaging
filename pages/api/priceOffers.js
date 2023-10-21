import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const body = req.body;

      const wpRes = await axios.post(
        `${process.env.DATA_SOURCE}/price_offers`,
        body,
        {
          headers: {
            Authorization: `${process.env.WORDPRESSTOKEN}`,
          },
        }
      );

      const data = wpRes.data;

      res.status(200).json(data,{  status: 201 });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {

    try {
      const body = req.body;
    const updatePriceOfferRes = await axios.put(
      `${process.env.DATA_SOURCE}/price_offers/${body.offerId}`,
      body,
      {
        headers: {
          Authorization: `${process.env.WORDPRESSTOKEN}`,
        },
      }
    );
      const data = updatePriceOfferRes.data;
      res.status(200).json({ data: data, status: 200 });


    } catch (error) {
      res.status(500).json({ error: error.message });
    }


  } else {
    res.status(405).json({ error: "Method not allowed." });
  }

};

