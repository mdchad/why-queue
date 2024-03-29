import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Div100vh from 'react-div-100vh'
import { connect } from '../utils/dbConnect'
import * as changeCase from 'change-case'

export default function Home({ company }) {
  return (
    <Div100vh className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.header}>Welcome to CutQueue</h1>
      </header>
      <main className={styles.wrapper}>
        <p>Here's a list of restaurant that we support</p>
        <ul>
          {company.map((co, i) => {
            return (
              <li key={i}>
                <Link href={`/${changeCase.paramCase(co.name)}`}>
                  {changeCase.capitalCase(co.name)}
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </Div100vh>
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  try {
    const { db } = await connect()
    const company = await db
      .collection('company')
      .find({}, { projection: { _id: 0, createdAt: 0 } })
      .toArray()

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
}
