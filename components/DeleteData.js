import React from 'react'
import styles from './tailwind.module.css'
export default function DeleteData() {
  return (
    <div className={styles.div1}>
        <input className={styles.inputbox} type='text' placeholder='enter id'></input>
        
<button className={styles.button}>Delete</button>
    </div>
  )
}
