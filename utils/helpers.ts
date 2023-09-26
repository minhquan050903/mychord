import { Price } from "../types";

export const getURL = () => {
  const url =
    [
      process?.env?.URL,
      process?.env?.NEXT_PUBLIC_URL,
      process.env.VERCEL_URL,
      process.env.NEXT_PUBLIC_VERCEL_URL,
    ].find((u) => !!u) ?? "http://localhost:3000";

  const finalUrl = url.includes("http") ? url : `https://${url}`;

  console.debug("URL:", finalUrl);

  return finalUrl;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price; analyticsClientId: string | null };
}) => {
  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
