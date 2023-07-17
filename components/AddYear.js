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
     const sem1Ref = doc(db,`AttendanceDB/Years/children/${year}/semesters/sem1`)
     await setDoc(sem1Ref,{
        blank : 'blank'
     })
     const sem2Ref = doc(db,`AttendanceDB/Years/children/${year}/semesters/sem2`)
     await setDoc(sem2Ref,{
        blank : 'blank'
     })
     const majorRef1 = doc(db,`AttendanceDB/Years/children/${year}/semesters/sem1/majors`)
     await setDoc(sem1Ref,{
        blank : 'blank'
     })
     const majorRef2 = doc(db,`AttendanceDB/Years/children/${year}/semesters/sem2/majors`)
     await setDoc(sem2Ref,{
        blank : 'blank'
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

