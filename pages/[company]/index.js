import { useState } from "react";
import styles from "../../styles/Home.module.css";
import PhoneInput from "react-phone-input-2";
import Button from "@material-ui/core/Button";
import "react-phone-input-2/lib/material.css";
import { useRouter } from "next/router";
import Head from "next/head";
import TextField from "@material-ui/core/TextField";

export default function Booking() {
  const [num, setNum] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [error, setError] = useState(false)
  const router = useRouter();
  let { company } = router.query;
  if (company) {
    company = company.charAt(0).toUpperCase() + company.slice(1);
  }

  function handlePeopleInput(value) {
    setNumberOfPeople(value)
  }

  function handleChange(value, country) {
    setDialCode(country.dialCode)
    setNum(value);
  }

  async function handleBlur() {
    const { parsePhoneNumber } = await import('libphonenumber-js/max')
    console.log(parsePhoneNumber)
    if (num) {
      const phoneNumber = parsePhoneNumber('+' + num)
      if (phoneNumber.isValid() === false) {
        setError(true)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/queue/create", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: "+" + num,
          company,
          numberOfPeople: parseInt(numberOfPeople),
          timestamp: new Date(),
        }),
      });
      setNum(num.substring(0, dialCode.length));
    } catch (e) {
      console.error("error");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Skip the Q</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
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
        <h1>{company}</h1>
      </header>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Please enter your number to join the queue.
          </label>
          <PhoneInput
            country={"sg"}
            value={num}
            onChange={(phone, country, e, formattedValue) => handleChange(phone, country)}
            onBlur={handleBlur}
            isValid={(value, country) => {
              if (error) {
                return "Invalid phone number";
              } else {
                return true
              }
            }}
          />
          <label className={styles.label}>
            Please indicate how many people.
          </label>
          <TextField
              id="outlined-number"
              label="Pax"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={numberOfPeople}
              onChange={e => handlePeopleInput(e.target.value)}
              variant="outlined"
          />
          <Button
            type="submit"
            disabled={!num}
            style={{
              color: !num && "white",
              marginTop: "16px",
              backgroundColor: !num ? "#cacaca" : "#0070f3",
              boxShadow: `0 4px 14px 0 ${!num ? "rgba(202, 202, 202, 0.5)" :  "rgba(0,118,255,0.39)"}`,
              borderRadius: "7px",
            }}
            size={"large"}
            variant="contained"
            color="primary"
          >
            Submit
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
              fontFamily: "Inconsolata",
              fontWeight: 600,
              marginLeft: "8px",
              border: "1px solid #000",
              padding: "4px",
            }}
          >
            {" "}
            CutQueue
          </span>
        </a>
      </footer>
    </div>
  );
}