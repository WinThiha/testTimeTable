import { db } from '@/firebase';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import useCalculateAttendancePercent from '@/hooks/calculateAttendancePercent';
export default function attendanceWithTT() {
    const {majorPercent,totalPercent} = useCalculateAttendancePercent()

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
    const attendanceHandler = async(updateId,status,major)=>{
        
        
        const docRef = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`, updateId)
        const currentDate = new Date()
        const fieldName = currentDate.toString();
        status === 'Present' ? await setDoc(docRef, {
            'attendance_dates': {
                [fieldName] : 'Present'
            }
            
        }, { merge: true }
        
        ) : await setDoc(docRef, {
            'attendance_dates': {
                [fieldName] : 'Absent'
            }
            
        }, { merge: true }
        )
        
       majorPercent(year,sem,updateId,major)
        /* totalPercent(updateId) */
    }
    const dateHandler = async(major)=>{
        
        const currentDate = new Date().toString()
        const docRef = doc(db,`Dates/${major} Dates`)
        await setDoc(docRef,{[currentDate] : true },{merge : true})
        let totalTimes = 0 ;
        let presentTimes = 0;
        let allMajors = []
        const dateRef = collection(db,'Dates')
        const dates = await getDocs(dateRef)
        dates.forEach((date)=>{
          totalTimes += (Object.keys(date.data()).length) 
        })
          const totalRef = doc(db, 'Dates/Total Times')
          await setDoc(totalRef,{totalTimes : (totalTimes-1)})
  
          const colRef = collection(db,`AttendanceDB/Years/children/Fourth Year/semesters/sem2/majors`)
        const q = query(colRef,orderBy('name'))
        const majors = await getDocs(q)
        majors.forEach(async (mj)=>{
         if(mj.data().name){
          allMajors.push(mj.data().name)
          }
        })
        const stuRef = doc(db,`students/${updateId}`)
        const student = await getDoc(stuRef)
        for(const major of allMajors){
          presentTimes += student.data()[`${major} present-times`]
        }
        const percent = (Math.floor((presentTimes/(totalTimes-1))*100) ) === NaN ? 0 : Math.floor((presentTimes/(totalTimes-1))*100)
        await setDoc(stuRef,{
          total_percent : percent
        },{merge : true})
      
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
                    {majors.map((major)=>(
                        <th scope='col'>{major}<i onClick={async()=>{
                            await dateHandler(major)
                             
                             
                         }} className="fa-regular fa-circle-check"></i></th>
                    ))}
                    
                </tr>
            </thead>
            <tbody>
                {stData.map(st => <>
                    <tr key={st.id}>
                        <th scope='row'>{st.id}</th>
                        <td>{st.std_name}</td>
                        {majors.map((major)=>(
                            <td><i onClick={()=>{
                                attendanceHandler(st.id,'Present',major)
                                 
                                 
                             }} className="fa-regular fa-circle-check"></i></td>
                        ))}
                        {/* <td><i onClick={async()=>{
                           attendanceHandler(st.id,'Present')
                            
                            
                        }} className="fa-regular fa-circle-check"></i></td>
                        <td>
                        <i onClick={async ()=>{
                           attendanceHandler(st.id,'Absent')
                           
                            
                        }} className="fa-sharp fa-solid fa-xmark"></i>
                        </td> */}
                        
                    </tr></>)}

            </tbody>
        </table>
    </div>
  )
}
