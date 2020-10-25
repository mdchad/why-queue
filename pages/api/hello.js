// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const accountSid = 'AC46d64dba6bf54d2d5e95b2498704ba57';
const authToken = 'ae6e50a237ec59ec2b159b2a9471cc44';
const client = require('twilio')(accountSid, authToken);

export default (req, res) => {
  const {
    method,
  } = req;

  if (method === 'POST') {
    const parsed = JSON.parse(req.body);
    console.log(parsed)
    // client.messages
    //     .create({body: 'Abang munir. I love you so much. Jom tido sayang!', from: 'Sofia', to: parsed.data})
    //     .then(message => console.log(message.sid))
    //     .catch(e => console.log(e));
    client.calls
        .create({
          twiml: '<Response><Say>Hello there General Kenbobi. We meet again!</Say></Response>',
          to: parsed.data,
          from: '+19252557392'
        })
        .then(call => console.log(call.sid))
        .catch(e => console.log(e));
  } else {
    // Handle any other HTTP method
  }
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
