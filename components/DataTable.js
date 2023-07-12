import { db } from '@/firebase'
import { QuerySnapshot, collection, doc, onSnapshot, orderBy, query ,Timestamp} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import styles from './tailwind.module.css'
import moment from 'moment/moment'
import DeleteData from './DeleteData'
import useDeleteData from '@/hooks/deleteData'

export default function DataTable() {
    const {deleteHandler} = useDeleteData()
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
    return (

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
                        <td><i onClick={e=>deleteHandler(st.id, e)}className="fa-sharp fa-solid fa-trash"></i></td>
                        
                    </tr></>)}

            </tbody>
        </table>
    )
}
