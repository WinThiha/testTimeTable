import React, { useState } from 'react'
import styles from './tailwind.module.css'
import { db } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import useDeleteData from '@/hooks/deleteData';
export default function DeleteData() {
  const [id,setId] = useState('');
  const {deleteHandler} = useDeleteData();
  return  (
    
    <div className={styles.div1}>
        <input className={styles.inputbox} type='text' placeholder='enter id' onChange={(e)=>{setId(e.currentTarget.value)}}></input>
        
<button onClick={(e)=>deleteHandler(id, e)}className={styles.button}>Delete</button>
    </div>
  )
  
}
