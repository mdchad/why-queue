import {connect} from "../../../utils/dbConnect"
import * as changeCase from "change-case"
import {runMiddleware} from "../../../utils/cors";

export default async (req, res) => {
  try {
    await runMiddleware(req, res)
    const { db } = await connect()
    let { name, country } = req.body
    name = changeCase.snakeCase(name)

    const result = await db.collection("company").insertOne({
      name,
      country,
      queue: [],
      createdAt: new Date()
    })
    res.status(201);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json({ result })
  } catch (e) {
    res.status(500);
    console.log(e)
    res.json({ error: "Unable to insert queue... sorry" });
  }
}
