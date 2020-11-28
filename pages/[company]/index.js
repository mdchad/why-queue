import { useState, useRef } from 'react'
import styles from '../../styles/Home.module.css'
import PhoneInput from 'react-phone-input-2'
import Button from '@material-ui/core/Button'
import 'react-phone-input-2/lib/material.css'
import Head from 'next/head'
import TextField from '@material-ui/core/TextField'
import * as changeCase from 'change-case'
import { connect } from '../../utils/dbConnect'
import Div100vh from 'react-div-100vh'
import vest from 'vest'
import validate from '../../utils/validate'
import ReCAPTCHA from 'react-google-recaptcha'

export default function Booking({ company }) {
  const [num, setNum] = useState('')
  const [dialCode, setDialCode] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(vest.get('phone_form'))
  const recaptchaRef = useRef()

  let { name: companyName = null } = company
  if (company) {
    companyName = changeCase.capitalCase(companyName)
  }

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
    <Div100vh className={styles.container}>
      <Head>
        <title>Skip the Q</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className={styles.header}>
        <h1 style={{ marginBottom: '0.2rem' }}>{companyName}</h1>
        <div className={styles.subheaderContainer}>
          <span className={styles.dot}></span>
          <p className={styles.subheader}>Bedok</p>
        </div>
      </header>
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
          <label className={styles.label}>
            Please indicate how many people.
          </label>
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
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span
            style={{
              fontFamily: 'Inconsolata',
              fontWeight: 600,
              marginLeft: '8px',
              border: '1px solid #000',
              padding: '4px',
            }}
          >
            {' '}
            CutQueue
          </span>
        </a>
      </footer>
    </Div100vh>
  )
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  // const res = await fetch('api/company/')
  // const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  // const paths = posts.map((post) => ({
  //   params: { name: post.id },
  // }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: [
      {
        params: {
          company: 'wak-jof',
        },
      },
    ],
    fallback: false,
  }
}

export async function getStaticProps(ctx) {
  let name = ctx.params.company
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  try {
    const { db } = await connect()
    name = changeCase.snakeCase(name)
    const company = await db
      .collection('company')
      .findOne({ name }, { projection: { _id: 0, createdAt: 0 } })
    if (company) {
      return {
        props: {
          company,
        },
      }
    }
  } catch (e) {
    throw new Error('Internal Server error')
  }
  //
  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
}
