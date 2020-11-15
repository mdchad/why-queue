// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('dotenv').config()
const accountSid = 'AC46d64dba6bf54d2d5e95b2498704ba57';
const authToken = process.env.TWILIO_KEY;
const client = require('twilio')(accountSid, authToken);
import { connect } from "../../../utils/dbConnect";

export default async (req, res) => {
  try {
    const db = await connect()
    console.log(db)
    const parsed = JSON.parse(req.body);
    console.log(parsed)

    client.messages
        .create({body: 'You are number #2 on the waiting list for ' + parsed.numberOfPeople + ' people', from: parsed.company, to: parsed.phoneNumber})
        .then(message => console.log(message.sid))
        .catch(e => console.log(e));
    res.status(201);
  } catch (e) {
    res.status(500);
    res.json({ error: "Unable to insert queue... sorry" });
  }
  // client.calls
  //     .create({
  //       twiml: '<Response><Say>Hello there General Kenbobi. We meet again!</Say></Response>',
  //       to: parsed.data,
  //       from: '+19252557392'
  //     })
  //     .then(call => console.log(call.sid))
  //     .catch(e => console.log(e));
}
