import styles from '../../styles/Home.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import PhoneInput from 'react-phone-input-2'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useRef, useState } from 'react'
import vest from 'vest'
import validate from '../../utils/validate'

export default function Form({ company, switchScreen }) {
  const [num, setNum] = useState('')
  const [dialCode, setDialCode] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(vest.get('phone_form'))
  const recaptchaRef = useRef()

  function runValidate(name, value) {
    const res = validate({
      ...{ [name]: value },
    })
    setResult(res)
  }

  function handlePeopleInput(name, value) {
    setNumberOfPeople(value)
    runValidate(name, value)
  }

  function handleChange(value, country) {
    setError(false)
    setDialCode(country.dialCode)
    setNum(value)
  }

  async function handleBlur() {
    const { parsePhoneNumber } = await import('libphonenumber-js/max')
    if (num) {
      const phoneNumber = parsePhoneNumber('+' + num)
      if (phoneNumber.isValid() === false) {
        setError(true)
      } else {
        setError(false)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()

    try {
      const res = await fetch('/api/queue/create', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: '+' + num,
          company,
          numberOfPeople: parseInt(numberOfPeople),
          timestamp: new Date(),
          token,
        }),
      })
      await res.json()
      setNum(num.substring(0, dialCode.length))
      setNumberOfPeople('')
      setLoading(false)
      switchScreen('SUCCESSFUL')
    } catch (e) {
      console.error('error')
    }
  }

  function checkErrors() {
    return (
      result.hasErrors('number_of_people') || error || !(num && numberOfPeople)
    )
  }

  return (
    <main className={styles.main}>
      <form name="phone_form" className={styles.form} onSubmit={handleSubmit}>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY}
        />
        <label className={styles.label}>
          Please enter your number to join the queue.
        </label>
        <PhoneInput
          country={'sg'}
          name="phone_number"
          value={num}
          onChange={(phone, country, e, formattedValue) =>
            handleChange(phone, country)
          }
          onBlur={handleBlur}
          isValid={(value, country) => {
            if (error) {
              return 'Invalid phone number'
            } else {
              return true
            }
          }}
        />
        <label className={styles.label}>Please indicate how many people.</label>
        <TextField
          label="Pax"
          name="number_of_people"
          type="number"
          error={result.hasErrors('number_of_people')}
          inputProps={{
            max: 10,
            min: 1,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={numberOfPeople}
          onChange={(e) => handlePeopleInput(e.target.name, e.target.value)}
          variant="outlined"
          helperText={result.getErrors('number_of_people')}
          min="0"
          max="10"
        />
        <Button
          type="submit"
          disabled={checkErrors()}
          style={{
            color: !num && 'white',
            marginTop: '16px',
            backgroundColor: checkErrors() ? '#cacaca' : '#0070f3',
            boxShadow: `0 4px 14px 0 ${
              checkErrors()
                ? 'rgba(202, 202, 202, 0.5)'
                : 'rgba(0,118,255,0.39)'
            }`,
            borderRadius: '7px',
          }}
          size={'large'}
          variant="contained"
          color="primary"
        >
          {loading ? '...Loading' : 'Submit'}
        </Button>
      </form>
    </main>
  )
}
