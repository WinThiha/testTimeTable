import React from 'react'
import styles from './tailwind.module.css'

export default function AddData() {
  return (
    <div className={styles.div1}>
        <input className={styles.inputbox} type='text' placeholder='enter name'></input>
        <input className={styles.inputbox} type='text' placeholder='enter email'></input>
<button className={styles.button}>Add</button>
    </div>
  )
}
