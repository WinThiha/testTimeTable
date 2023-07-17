import { db } from '@/firebase'
import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore'
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
    
        const stuRef = collection(db,`students`)
        const students = await getDocs(stuRef)
        students.forEach(async(student)=>{
          const colRef = doc(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students/${student.data().std_id}`)
          await setDoc(colRef,student.data())
        })
        
     
    
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
