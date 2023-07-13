import useFetchData from '@/hooks/fetchData'
import React, { useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import moment from 'moment'
import { data } from 'autoprefixer'

export default function previousRecords() {
    const [filteredData,setFilteredData] = useState('')
    const [filteredDate,setFilteredDate] = useState('')
    const [status,setStatus] = useState('');
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
  console.log(doc.data().present_dates.Present)
})
    }
    const filterDateHandler = async (status)=>{
        setFilteredDate([])
        const stuRef = collection(db,'Students')
        const q=query(stuRef,where(`present_dates.${date}`,'==',status))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          onSnapshot(q, (querySnapshots) => {
            setFilteredDate(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
          })
          
        })
        
    }
  return (
    <div className={styles.div1}>
        <h2>By Date</h2>
        
                <input className={styles.inputbox} onChange={(e)=>setDate(e.currentTarget.value)}></input>
                <input className={styles.inputbox} onChange={(e)=>setStatus(e.currentTarget.value)}></input>

        <button className={styles.button} onClick={()=>filterDateHandler(status)}>Show Present Students on Date</button>

        <h2>By Name</h2>
        <input className={styles.inputbox} onChange={(e)=>setName(e.currentTarget.value)}></input>
        <button className={styles.button} onClick={filterNameHandler}>filter by name</button>
        {filteredData && <table className="table table-striped table-dark">
            <thead>
                <tr>
                    
                    <th scope="col">{`${filteredData.std_name} absent dates`}</th>
                    
                    
                </tr>
            </thead>
            <tbody>
                
                    
                        
                        
                        {Object.keys(filteredData.present_dates).map((date)=>{
                            return <tr key={filteredData.id}>
                              {filteredData.present_dates[date]==='Absent' ? <td>{date}</td> :null } 

                            </tr>
                        })}
                        
                        
                    

            </tbody>
        </table>}
        {filteredData && <table className="table table-striped table-dark">
            <thead>
                <tr>
                    
                    <th scope="col">{`${filteredData.std_name} present dates`}</th>
                    
                    
                </tr>
            </thead>
            <tbody>
                
                    
                        
                        
                        {Object.keys(filteredData.present_dates).map((date)=>{
                            return <tr key={filteredData.id}>
                              {filteredData.present_dates[date]==='Present' ? <td>{date}</td> :null } 

                            </tr>
                        })}
                        
                        
                    

            </tbody>
        </table>}

        {filteredDate && 

<table className="table table-striped table-dark">
<thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Attendance</th>
        <th scope='col'></th>
    </tr>
</thead>
<tbody>
    {filteredDate.map((dates)=><tr key={dates.id}>
            <th scope='row' key={dates.id}>{dates.id}</th>
            <td>{dates.std_name}</td>
            <td>{dates.std_email}</td>
            <td>{dates.present_dates[date]==="Present"? <i className="fa-solid fa-circle-check"></i> : <i className="fa-sharp fa-solid fa-xmark"></i>}</td>
            
        </tr>

        )}

</tbody>
</table>
}
        
    </div>
  )
}
