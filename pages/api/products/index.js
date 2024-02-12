import dbConnect from "../../../db/connect";
import Product from "../../../db/models/Product";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const products = await Product.find();
    return response.status(200).json(products);
  }
  //try/Catch überflüssig, Daten vom Server kann man immer vertrauen

  if (request.method === "POST") {
    try {
      const newProduct = await Product.create(request.body);

      response.status(201).json(newProduct);
    } catch (error) {
      console.log("POST/api/products/", error);
      //400 ist bad request, was bedeutet, dass gepostete Daten nich gültig sind, z.B. bei nicht
      //ausgefüllten Pflichtfeldern
      response.status(400).json({ error: error.message });
    }
  }
}
