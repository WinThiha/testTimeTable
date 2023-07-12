import React, { useState } from 'react'
import styles from './tailwind.module.css'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'

export default function AddData() {
  const [student, setStudent] = useState({ std_name: '', std_email: '' })
   const submitHandler = async()=>  {
    const collectionRef = collection(db, 'Students')
    const dofRef = await addDoc(collectionRef, { ...student, timestamp: serverTimestamp() })
    setStudent({ std_name: '', std_email: '' })
  }
  return (
    <div className={styles.div1}>
      <pre>{JSON.stringify(student)}</pre>
      <input className={styles.inputbox} type='text' placeholder='enter name' onChange={(e) => setStudent({ ...student, std_name: e.currentTarget.value })}></input>
      <input className={styles.inputbox} type='text' placeholder='enter email' onChange={(e) => setStudent({ ...student, std_email: e.currentTarget.value })}></input>

      <button onClick={submitHandler}className={styles.button}>Add</button>
    </div>
  )
}
