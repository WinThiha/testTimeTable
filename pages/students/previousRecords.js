import useFetchData from '@/hooks/fetchData'
import React, { useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import moment from 'moment'

export default function previousRecords() {
    const [filteredData,setFilteredData] = useState('')
    const [date,setDate] = useState('')
    const [name,setName] = useState('')
    const {stdata,setStdata} = useFetchData()
    const filterNameHandler =async ()=>{
        const stuRef = collection(db, 'Students')
        const q = query(stuRef,where('std_name','==',name))
        const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  setFilteredData(doc.data())
})
    }
  return (
    <div className={styles.div1}>
        <h2>By Date</h2>
        <input className={styles.inputbox} onChange={(e)=>setDate(e.currentTarget.value)}></input>
        <h2>By Name</h2>
        <input className={styles.inputbox} onChange={(e)=>setName(e.currentTarget.value)}></input>
        <button className={styles.button} onClick={filterNameHandler}>filter by name</button>
        {filteredData && <table className="table table-striped table-dark">
            <thead>
                <tr>
                    
                    <th scope="col">{filteredData.std_name}</th>
                    
                </tr>
            </thead>
            <tbody>
                
                    <tr key={filteredData.id}>
                        
                        <td>{filteredData.std_name}</td>
                        
                        <td>{moment(filteredData.present_dates).format('MMMM Do YYYY')}</td>
                        
                        
                    </tr>

            </tbody>
        </table>}
    </div>
  )
}
