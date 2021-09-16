import styles from '../../styles/Home.module.css'
import 'react-phone-input-2/lib/material.css'
import Head from 'next/head'
import * as changeCase from 'change-case'
import { connect } from '../../utils/dbConnect'
import Div100vh from 'react-div-100vh'
import Form from './Form'
import SuccessfulScreen from './SuccessfulScreen'
import { useState } from 'react'

export default function Booking({ company }) {
  const [screen, setScreen] = useState('FORM')

  let { name: companyName = null } = company
  if (company) {
    companyName = changeCase.capitalCase(companyName)
  }

  function switchScreen(screen) {
    setScreen(screen)
  }

  function renderScreen() {
    switch (screen) {
      case 'FORM':
        return <Form company={company} switchScreen={switchScreen} />
      case 'SUCCESSFUL':
        return <SuccessfulScreen />
      default:
        return <Form company={company} switchScreen={switchScreen} />
    }
  }

  return (
    <Div100vh className={styles.container}>
      <Head>
        <title>FastQueue</title>
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
      {renderScreen()}
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
            FastQueue
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
