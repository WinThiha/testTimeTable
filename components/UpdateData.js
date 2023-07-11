import React from 'react'
import styles from './tailwind.module.css'
export default function UpdateData() {
  return (
    <div className={styles.div1}>
        <input className={styles.inputbox} type='text' placeholder='enter id'></input>
        <input className={styles.inputbox} type='text' placeholder='enter name to change'></input>
<button className={styles.button}>Update</button>
    </div>
  )
}
