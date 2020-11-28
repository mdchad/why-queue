module.exports = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    TWILIO_KEY: process.env.TWILIO_KEY,
    NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY:
      process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  },
}
