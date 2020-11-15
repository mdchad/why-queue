import {runMiddleware} from "../../../utils/cors";
import {connect} from "../../../utils/dbConnect";
import * as changeCase from "change-case";

export default async (req, res) => {
  try {
    await runMiddleware(req, res)
    const { db } = await connect()
    let {
      query: { name },
    } = req
    name = changeCase.snakeCase(name)

    const result = await db.collection("company").findOne({
      name
    })
    res.status(200);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.json({ result })
  } catch (e) {
    res.status(500);
    console.log(e)
    res.json({ error: "Unable to find company... sorry" });
  }
}
