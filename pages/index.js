import Head from 'next/head'

export default function Home() {
  return (
    <div>
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

      <header>
        <h1>Welcome to CutQueue</h1>
      </header>
    </div>
  )
}
