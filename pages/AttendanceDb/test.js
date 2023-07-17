import { db } from '@/firebase'
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import styles from '@/components/tailwind.module.css'
import Link from 'next/link'
import moment from 'moment'
import useCalculateAttendancePercent from '@/hooks/calculateAttendancePercent'

export default function () {
    const {majorPercent,totalPercent} = useCalculateAttendancePercent()
    const [status,setStatus] = useState('')
    const [year,setYear] = useState('')
    const [sem,setSem] = useState('')
    const [major,setMajor] = useState('')
    const [stdata, setStdata] = useState([])
    const showStudentsHandler = async()=>{
        const collectionRef = collection(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
        const q = query(collectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshots) => {
            setStdata(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })
        return unsubscribe
    }
    
  
    const attendanceHandler = async(updateId,status)=>{
        
        
        const docRef = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`, updateId)
        const currentDate = new Date()
        const fieldName = currentDate.toDateString();
        const test = status
        const date = serverTimestamp()
        status === 'Present' ?  setDoc(docRef, {
            'attendance_dates': {
                [fieldName] : 'Present'
            }
            
        }, { merge: true }
        
        ) :  setDoc(docRef, {
            'attendance_dates': {
                [fieldName] : 'Absent'
            }
            
        }, { merge: true }
        )
        
        majorPercent(year,sem,updateId,major)
        
    }
    
    return (

        <>
        <input className={styles.inputbox} placeholder='Enter Year' onChange={(e)=>{setYear(e.currentTarget.value)}}/>
        <input className={styles.inputbox} placeholder='Enter Sem' onChange={(e)=>{setSem(e.currentTarget.value)}}/>

        <input className={styles.inputbox} placeholder='Enter Major' onChange={(e)=>{setMajor(e.currentTarget.value)}}/>

        <button className={styles.button} onClick={showStudentsHandler}>Show Students</button>

        <table className="table table-striped table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Time Added</th>
                    <th scope='col'></th>
                </tr>
            </thead>
            <tbody>
                {stdata.map(st => <>
                    <tr key={st.id}>
                        <th scope='row'>{st.id}</th>
                        <td>{st.std_name}</td>
                        <td>{st.std_email}</td>
                        <td>{moment(st.timestamp).format('MMMM Do YYYY')}</td>
                        <td><i onClick={async()=>{
                           attendanceHandler(st.id,'Present')
                            
                            
                        }} className="fa-regular fa-circle-check"></i></td>
                        <td>
                        <i onClick={async ()=>{
                           attendanceHandler(st.id,"Absent")
                           
                            
                        }} className="fa-sharp fa-solid fa-xmark"></i>
                        </td>
                        
                    </tr></>)}

            </tbody>
        </table>
        <Link href='../students/previousRecords'>Test Filtering</Link>
        <Link href={'/'}>Go to Home</Link>
        </>
    )
}
