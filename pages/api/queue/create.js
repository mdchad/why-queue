// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_KEY
const client = require('twilio')(accountSid, authToken)
import { connect } from '../../../utils/dbConnect'

async function validateHuman(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: 'POST',
    }
  )

  const data = await response.json()
  return data.success
}

export default async (req, res) => {
  try {
    const db = await connect()
    const { numberOfPeople, phoneNumber, company, token } = JSON.parse(req.body)

    const isHuman = validateHuman(token)
    if (!isHuman) {
      res.status(400)
      res.json({ error: 'Google Captcha failed.' })
    }

    // const response = await client.messages.create({
    //   body: 'You are number #2 on the waiting list for ' + numberOfPeople + ' people',
    //   from: changeCase.capitalCase(company.name),
    //   to: phoneNumber
    // })

    res.status(201)
    res.json({ message: 'Successful' })
  } catch (e) {
    res.status(500)
    res.json({ error: 'Unable to insert queue... sorry' })
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
