import { db } from '@/firebase';
import styles from './tailwind.module.css'

import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'

export default function UpdateData() {
  const [updateId,setUpdateId] = useState('');
  const [updatedName,setUpdatedName] = useState('')
  async function updateHandler(){
    const docRef = doc(db, 'Students', updateId)
    const updatedData = {std_name : updatedName,timestamp : serverTimestamp()}
    
    updateDoc(docRef, updatedData)
  }
  return (
    <div className={styles.div1}>
    <pre>{JSON.stringify(updateId)}</pre>
    <input className={styles.inputbox} type='text' placeholder='enter id' onChange={(e)=>{setUpdateId(e.currentTarget.value)}}></input>
    <input className={styles.inputbox} type='text' placeholder='enter name to change' onChange={(e) => setUpdatedName(e.currentTarget.value)}></input>
    
<button onClick={updateHandler}className={styles.button}>Update</button>
</div>
  )
}
