import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import useCalculateAttendancePercent from '@/hooks/calculateAttendancePercent';
export default function attendanceWithTT() {
    const {majorPercent,totalForAll} = useCalculateAttendancePercent()

    const [year, setYear] = useState('')
    const [sem, setSem] = useState('')
    const [day,setDay] = useState('')
    const [days,setDays] = useState([])
    const [totalYears,setTotalYears] = useState([])
    const [showDays,setShowDays] = useState(false)
    const [stData,setStData] = useState([])
    const [majors,setMajors] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const allYears = []
            const yearRef = collection(db, `AttendanceDB/Years/children`)
            const years = await getDocs(yearRef)
            years.forEach((year) => {
                allYears.push(year.data().name)
            })

            await setTotalYears(allYears)





        }

        fetchData();
    }, []);
    const daysHandler = async ()=>{
        const allDays = []
setShowDays(true)
const daysRef = collection(db,`TimeTable/${year}/${sem}`)
const days = await getDocs(daysRef)
days.forEach((day)=>{
allDays.push(day.data().name)
})
setDays(allDays)

    }
    const sortedDays = [...days].sort((a, b) => {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return weekDays.indexOf(a) - weekDays.indexOf(b);
    })

    const tableHandler = async()=>{
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
    }
    const attendanceHandler = async(updateId,status,major,index)=>{
        
        const docRef = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`, updateId)
        const currentDate = new Date()
        const fieldName = currentDate.toDateString();
        status === 'Present' ? await setDoc(docRef, {
            'attendance_dates': {
                [fieldName]: {
                    [index+1] : 'Present'
                }
            }
            
        }, { merge: true }
        
        ) : await setDoc(docRef, {
            'attendance_dates': {
                [fieldName]: {
                    [index+1] : 'Present'
                }
            }
            
        }, { merge: true }
        )
        
       majorPercent(year,sem,updateId,major)
       totalForAll(year,sem,stData)
    }
    const dateHandler = async(major, index)=>{
        const currentDate = new Date().toDateString()
        const docRef = doc(db,`Dates/${major} Dates/Dates/${currentDate}`)
        await setDoc(docRef,{[index+1] : true },{merge : true})
        
          
        totalForAll(year,sem,stData)
        
       
      
    }

  return (
    <div>
        <div className='flex flex-row'>
                    

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
                    <button className={styles.button} onClick={()=>daysHandler()}>Show Days</button>
                </div>

                { showDays == true && <select onChange={(e) => setDay(e.currentTarget.value)} class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Choose a day</option>
                        {sortedDays.map((day)=>(
                            <option value={day}>{day}</option>
                        ))}
                    </select>}
                    <button className={styles.button} onClick={()=>tableHandler()}>Show Attendance Table</button>

                    <table className="table table-striped table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    {majors.map((major, index)=>(
                        <th scope='col' key={index}>{major}<i onClick={async()=>{
                            await dateHandler(major, index)
                             
                             
                         }} className="fa-regular fa-circle-check"></i></th>
                    ))}
                    
                </tr>
            </thead>
            <tbody>
                {stData.map(st => <>
                    <tr key={st.id}>
                        <th scope='row'>{st.id}</th>
                        <td>{st.std_name}</td>
                        {majors.map((major,index)=>(
                            <td key={index}><i onClick={()=>{
                                attendanceHandler(st.id,'Present',major,index)
                                 
                                 
                             }} className="fa-regular fa-circle-check"></i></td>
                        ))}
                        
                        
                    </tr></>)}

            </tbody>
        </table>
    </div>
  )
}
