import React, { useState } from 'react'
import styles from './tailwind.module.css'
import { db } from '@/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import useDeleteData from '@/hooks/deleteData';
export default function DeleteData() {
  const [id,setId] = useState('');
  const [path,setPath] = useState('')
  const deleteHandler = async()=>{
    const yearRef = collection(db, "AttendanceDB/Years/children");
    const years = await getDocs(yearRef);
    years.forEach(async (year) => {
      const semRef = collection(
        db,
        `AttendanceDB/Years/children/${year.id}/semesters`
      )
      const sems = await getDocs(semRef)
      sems.forEach(async (sem) => {
        const majorRef = collection(
          db,
          `AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors`
        )
       const majors = await getDocs(majorRef)
        majors.forEach(async (major) => {
          const studentRef = collection(
            db,
            `AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors/${major.id}/Students`
          )
          const students = await getDocs(studentRef)
          students.forEach(async (student) => {
            if (student.id === id) {
              const studentRef = doc(db,`AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors/${major.id}/Students/${student.id}`)
              await deleteDoc(studentRef)
            }
          });
        });
      });
    });

    const docRef = doc(db, "students", id);

    deleteDoc(docRef);
  }
  return  (
    
    <div className={styles.div1}>
        <input className={styles.inputbox} type='text' placeholder='enter id' onChange={(e)=>{setId(e.currentTarget.value)}}></input>
      
<button onClick={()=>deleteHandler()}className={styles.button}>Delete</button>
    </div>
  )
  
}
