import useFetchData from '@/hooks/fetchData'
import React, { useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import moment from 'moment'
import { data } from 'autoprefixer'
import Link from 'next/link'

export default function previousRecords() {
  const [showPercentTable,setShowPercentTable] = useState(false)
    const [year,setYear] = useState('')
    const [sem,setSem] = useState('')
    const [major,setMajor] = useState('')
    const [filteredData,setFilteredData] = useState('')
    const [filteredDate,setFilteredDate] = useState('')
    const [status,setStatus] = useState('');
    const [date,setDate] = useState('')
    const [name,setName] = useState('')
    const [stdata,setStData] = useState([])
    
    const [percent,setPercent] =useState(0)
    const filterNameHandler =async ()=>{
        const stuRef = collection(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
        const q = query(stuRef,where('std_name','==',name))
        const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  setFilteredData(doc.data())
  console.log(doc.data().present_dates.Present)
})
    }
    const filterDateHandler = async (status)=>{
        setFilteredDate([])
        const stuRef = collection(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
        const q=query(stuRef,where(`present_dates.${date}`,'==',status))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          onSnapshot(q, (querySnapshots) => {
            setFilteredDate(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
          })
          
        })
        
    }
    const filterOnlyDateHandler = async ()=>{
        setFilteredDate([])
        const stuRef = collection(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
        const q=query(stuRef,orderBy(`present_dates.${date}`))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          onSnapshot(q, (querySnapshots) => {
            setFilteredDate(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
          })
          
        })
        
    }
    const percentHandler = async()=>{
      let alldates = []
      let totalDates = 0;
      let presentDates= 0;
      const stuRef = collection(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
      const q = query(stuRef,where('std_name','==',name))
      const querySnapshot = await getDocs(q);
      
querySnapshot.forEach(async (attendances) => {
  setStData(attendances.data())
  Object.keys(attendances.data().present_dates).map(async (date)=>{
    console.log(date)
    alldates.push(date)
  
console.log(alldates)
   
  })
  totalDates =alldates.length


  
    })
    for(const presents of alldates){
      console.log(presents)
      const presentQ = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students/${name}`)
      const presentSnapshot = await getDoc(presentQ)
      presentSnapshot.data().present_dates[presents] === 'Present' ? presentDates += 1 : null
      
      
    
    }

    console.log(presentDates)
  
    console.log(totalDates)
    setPercent(Math.floor((presentDates/totalDates)*100))
        
    }
  return (
    <div className={styles.div1}>
         <input className={styles.inputbox} placeholder='Enter Year' onChange={(e)=>{setYear(e.currentTarget.value)}}/>
        <input className={styles.inputbox} placeholder='Enter Sem' onChange={(e)=>{setSem(e.currentTarget.value)}}/>

        <input className={styles.inputbox} placeholder='Enter Major' onChange={(e)=>{setMajor(e.currentTarget.value)}}/>
        <h2>By Date</h2>
        
                <input className={styles.inputbox} onChange={(e)=>setDate(e.currentTarget.value)}></input>
                <button className={styles.button} onClick={filterOnlyDateHandler}>Show all Students on Date</button>
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
<input className={styles.inputbox} placeholder='Enter Year Name' onChange={(e)=>{setYear(e.currentTarget.value)}}/>
<input className={styles.inputbox} placeholder='Enter Sem Name' onChange={(e)=>{setSem(e.currentTarget.value)}}/>
<input className={styles.inputbox} placeholder='Enter Major Name' onChange={(e)=>{setMajor(e.currentTarget.value)}}/>
<input className={styles.inputbox} placeholder='Enter Student Name' onChange={(e)=>{setName(e.currentTarget.value)}}/>
<button className={styles.button} onClick={()=>{
  setShowPercentTable(true)
  percentHandler()
}}>Show Percent</button>
{showPercentTable == true ? <table className="table table-striped table-dark">
<thead>
    <tr>
        
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Percent</th>
        
    </tr>
</thead>
<tbody>
    <tr>
      <td scope='row'>{stdata.std_name}</td>
      <td scope='row'>{stdata.std_email}</td>
      <td scope='row'>{percent}</td>
    </tr>

</tbody>
</table>
: null

}
<Link href={'/'}>Go Home</Link>
    </div>
  )
}
