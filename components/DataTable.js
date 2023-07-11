import { db } from '@/firebase'
import { QuerySnapshot, collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import styles from './tailwind.module.css'

export default function DataTable() {
    const [stdata, setStdata] = useState([])
    useEffect(() => {
        const collectionRef = collection(db, 'Students')
        const q = query(collectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshots) => {
            setStdata(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })
        return unsubscribe
    }, [])
    return (

        <table class="table table-striped table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                </tr>
            </thead>
            <tbody>
                {stdata.map(st => <>
                    <tr key={st.id}>
                        <th scope='row'>{st.id}</th>
                        <td>{st.std_name}</td>
                        <td>{st.std_email}</td>
                        <td>{st.timestamp}</td>
                        
                    </tr></>)}

            </tbody>
        </table>
    )
}
