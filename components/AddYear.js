import { db } from '@/firebase'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import styles from './tailwind.module.css'

export default function AddYear() {
    const [year, setYear] = useState('')
    const submitHandler = async()=>  {
     const collectionRef = collection(db, 'AttendanceDB/Years/children')
     const docRef = doc(collectionRef,year)
     await setDoc(docRef, {
        name : year
     })
     const sem1Ref = collection(db,`AttendanceDB/Years/children/${year}/semesters/sem1/majors`)
     await addDoc(sem1Ref,{
        test : 'test'
     })
     const sem2Ref = collection(db,`AttendanceDB/Years/children/${year}/semesters/sem2/majors`)
     await addDoc(sem2Ref,{
        test : 'test'
     })
     
     setYear('')
   }
   return (
     <div className={styles.div1}>
       <pre>{JSON.stringify(year)}</pre>
       <input className={styles.inputbox} type='text' placeholder='enter year' onChange={(e) => setYear( e.currentTarget.value )}></input>
 
       <button onClick={submitHandler}className={styles.button}>Add</button>
     </div>
   )
}

