import { db } from '@/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
export default function timeTableWithDate() {
    const [dates, setDates] = useState([])
    const [date, setDate] = useState('')
    const [year,setYear] = useState('')
    const [sem,setSem] = useState('')
    const [totalYears,setTotalYears] = useState([])
    const [showDates,setShowDates] = useState(false)
    const [majors,setMajors] = useState([])
    const [stData, setStData] = useState([])
    const [showTable,setShowTable] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const allYears = []
            const yearRef = collection(db, `AttendanceDB/Years/children`)
            const years = await getDocs(yearRef)
            years.forEach((year) => {
                allYears.push(year.data().name)
            })

            setTotalYears(allYears)
            
        }
        fetchData()
    }, [])

   const showDateHandler = async()=>{
    const allDates = []
    const datesRef = doc(db, `Dates/${year}/${sem}/All Dates`)
    const dates = await getDoc(datesRef)
    Object.keys(dates.data()).map((date) => {
        allDates.push(date)
    })
    setDates(allDates)
    setShowDates(true)
   }
  
   
    const tableHandler = async()=>{
        
        const day = date.split(' ')[0]
        console.log(day)
        const allStudents = []
        const allMajors = []
        const majorRef = collection(db,`TimeTable/${year}/${sem}/${day}/time`)
        const majors = await getDocs(majorRef)
        majors.forEach((major)=>{
            allMajors.push(major.data().major)
        })
        setMajors(allMajors)
        const stuRef = collection(db,`students`)
        const students = await getDocs(stuRef)
        students.forEach((student)=>{
            if(student.data().year === year){
                allStudents.push({ ...student.data(), id: student.id, timestamp: student.data().timestamp?.toDate().getTime() })
            }
        })
        setStData(allStudents)
        setShowTable(true)

        stData.map((st)=>{
            console.log(st[`Cs-4110 attendance_dates`][date][1])
        })
        
  
    }
   
    return (
        <div>
            <select onChange={(e) => setYear(e.currentTarget.value)} class="mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Choose Year</option>
                        {totalYears.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSem(e.currentTarget.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Choose sem</option>
                        <option value="sem1">sem1</option>
                        <option value="sem2">sem2</option>
                    </select>
                    <button className={styles.button} onClick={()=>{
                        showDateHandler()
                    }}>Show Dates</button>
            {showDates == true && <>
                <select onChange={(e) => setDate(e.currentTarget.value)} class="mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected>Choose date</option>
                {dates.map((date) => (
                    <option value={date}>{date}</option>
                ))}
            </select>
                    <button className={styles.button} onClick={()=>tableHandler()}>Show Table</button>
            </>
                

            
        }
        {showTable == true && <>
            <table className="table table-striped table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    {majors.map((major, index)=>(
                        <th scope='col' key={index}>{major}</th>
                    ))}
                    
                </tr>
            </thead>
            <tbody>
                {stData.map(st => <>
                    <tr key={st.id}>
                        <th scope='row'>{st.id}</th>
                        <td>{st.std_name}</td>
                        {majors.map((major,index)=>(
                            <td key={index}>
                               {st[`${major} attendance_dates`][date][index+1] === 'Present' ? <p>present</p> : <p>absent</p>}
                                </td>
                        ))}
                        
                        
                    </tr></>)}

            </tbody>
        </table>
        </>
        
        }
        </div>
    )

    }