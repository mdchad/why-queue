import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TextField from "@material-ui/core/TextField";
import {useState} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";

export default function Home() {
  const [num, setNum] = useState(null)

  function handleChange(e) {
    setNum(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(num)
    // const stringifyNumber = String(num)
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        body: JSON.stringify({ data: '+65' + num }),
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
      </Head>

      <header className={styles.header}>
        <h1>Skip the queue. We will notify you ⏰</h1>
      </header>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Please enter your number to  be on the wait list.</label>
          <TextField
              id="outlined-number"
              label="Number"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              required={true}
              value={num}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">🇸🇬 +65</InputAdornment>,
              }}
          />
        </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
