import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css';
import Button from "@material-ui/core/Button";
import { useRouter } from 'next/router'

export default function Home() {
  const [num, setNum] = useState(null)

  function handleChange(e) {
    setNum(e)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(num)
    // const stringifyNumber = String(num)
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        body: JSON.stringify({ data: num, company: 'Refuel', timestamp: new Date() }),
      });
      setNum('')
    } catch (e) {
      console.error("error");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Skip the Q</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@500;600&display=swap" rel="stylesheet" />
      </Head>

      <header className={styles.header}>
        <h1>Refuel</h1>
      </header>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Please enter your number to join the queue.</label>
          <PhoneInput
            country={'sg'}
            value={num}
            onChange={phone => handleChange(phone)}
            isValid={(value, country) => {
              if (value.match(/12345/)) {
                return 'Invalid value: '+value+', '+country.name;
              } else if (value.match(/1234/)) {
                return false;
              } else {
                return true;
              }
            }}
          />
          <Button type='submit' style={{ marginTop: '16px', backgroundColor: '#0070f3', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)', borderRadius: '7px' }} size={'large'} variant="contained" color='primary'>Submit</Button>
          {/*<TextField*/}
          {/*    id="outlined-number"*/}
          {/*    label="Number"*/}
          {/*    type="number"*/}
          {/*    InputLabelProps={{*/}
          {/*      shrink: true,*/}
          {/*    }}*/}
          {/*    variant="outlined"*/}
          {/*    required={true}*/}
          {/*    value={num}*/}
          {/*    onChange={handleChange}*/}
          {/*    InputProps={{*/}
          {/*      startAdornment: <InputAdornment position="start">🇸🇬 +65</InputAdornment>,*/}
          {/*    }}*/}
          {/*/>*/}
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span style={{ fontFamily: 'Inconsolata', fontWeight: 600, marginLeft: '8px', border: '1px solid #000', padding: '4px'}}>{' '}CutQueue</span>
        </a>
      </footer>
    </div>
  )
}
