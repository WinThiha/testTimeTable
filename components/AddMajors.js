import { db } from '@/firebase'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import styles from './tailwind.module.css'
export default function AddMajors() {
    const [year, setYear] = useState('')
    const [sem,setSem] = useState('')
    const [major,setMajor]= useState('')
    const submitHandler = async()=>  {
       
        const semRef = doc(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}`)
        await setDoc(semRef,{
            name :major
        },{merge : true})
    
     
    
   }
   return (
     <div className={styles.div1}>
       <pre>{JSON.stringify({'uear' : year,'sem' : sem,'major': major})}</pre>
       <input className={styles.inputbox} type='text' placeholder='enter year' onChange={(e) => setYear( e.currentTarget.value )}></input>
       <input className={styles.inputbox} type='text' placeholder='enter sem' onChange={(e) => setSem( e.currentTarget.value )}></input>

       <input className={styles.inputbox} type='text' placeholder='enter major' onChange={(e) => setMajor( e.currentTarget.value )}></input>

       <button onClick={submitHandler}className={styles.button}>Add</button>
     </div>
   )
}
