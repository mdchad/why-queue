import Div100vh from 'react-div-100vh'
import styles from '../../styles/Home.module.css'
import Button from '@material-ui/core/Button'

export default function SuccessfulScreen() {
  function onRemovebutton() {
    return
  }

  return (
    <Div100vh>
      <main className={styles.main}>
        <p className={styles.info}>Your queue number is #045</p>
        <p className={styles.info}>There are 5 people ahead of you</p>
        <p className={styles.info}>Average time: 20 - 30 mins</p>
        <Button
          type="submit"
          style={{
            color: 'white',
            marginTop: '16px',
            backgroundColor: '#0070f3',
            boxShadow: `0 4px 14px 0 rgba(0,118,255,0.39)`,
            borderRadius: '7px',
          }}
          onClick={onRemovebutton}
          size={'large'}
          variant="contained"
          color="primary"
        >
          Remove from queue
        </Button>
      </main>
    </Div100vh>
  )
}
