import { db } from '@/firebase'
import { QuerySnapshot, collection, doc, onSnapshot, orderBy, query ,Timestamp, addDoc, serverTimestamp, updateDoc, setDoc} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import moment from 'moment/moment'
import Link from 'next/link'



export default function studentAttendance() {
    
    const [stdata, setStdata] = useState([])
    useEffect(() => {
        const collectionRef = collection(db, 'Students')
        const q = query(collectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshots) => {
            setStdata(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })
        return unsubscribe
        
    }, [])
    console.log(stdata.timestamp)
    const attendanceHandler = async(updateId)=>{
        console.log(stdata[0].present_dates)
        
        
        const docRef = doc(db, 'Students', updateId)
        const currentDate = new Date()
        const fieldName = currentDate.toDateString();
        const date = serverTimestamp()
        await setDoc(docRef, {
            'present_dates': {
               [fieldName]  : 'present'
            }
            
        }, { merge: true }
        )
        
    }
    
    return (

        <>
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
                        <td><i onClick={()=>{
                            attendanceHandler(st.id)
                        }} className="fa-regular fa-circle-check"></i></td>
                        
                    </tr></>)}

            </tbody>
        </table>
        <Link href='./previousRecords'>Test</Link>
        </>
    )
}
