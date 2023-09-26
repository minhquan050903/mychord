import {
  getUser,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getURL } from "../../utils/helpers";
import { stripe } from "../../utils/stripe";
import { createOrRetrieveCustomer } from "../../utils/supabase-admin";

const createCheckoutSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === "POST") {
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      const { user } = await getUser({ req, res });

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || "",
      });

      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "required",
        customer,
        line_items: [
          {
            price: price.id,
            quantity,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
         
          metadata
        },
        success_url: `${getURL()}/account`,
        cancel_url: `${getURL()}/`,
        metadata: {
          analyticsClientId: req.body.analyticsClientId,
        },
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default withAuthRequired(createCheckoutSession);
