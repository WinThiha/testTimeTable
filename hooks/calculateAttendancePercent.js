import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React from 'react'

export default function useCalculateAttendancePercent() {
    const majorPercent = async(year,sem,updateId,major)=>{
        let alldates = []
      let totalDates = 0;
      let presentDates= 0;
      const stuRef = collection(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students`)
      const q = query(stuRef,where('std_id','==',updateId))
      const querySnapshot = await getDocs(q);
      
querySnapshot.forEach(async (attendances) => {if(attendances.data().attendance_dates){
  Object.keys(attendances.data().attendance_dates).map(async (date)=>{
   
    alldates.push(date)
  })
  console.log(alldates)
  totalDates =alldates.length
}
  
    })
    for(const presents of alldates){
      console.log(presents)
      const presentQ = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students/${updateId}`)
      const presentSnapshot = await getDoc(presentQ)
      presentSnapshot.data().attendance_dates[presents] === 'Present' ? presentDates += 1 : null

    }
    console.log(totalDates)
    console.log(presentDates)
    console.log(presentDates/totalDates)
    if(totalDates !== 0){
      const percent = (Math.floor((presentDates/totalDates)*100) ) === NaN ? 0 : Math.floor((presentDates/totalDates)*100)
    await setDoc(doc(db,`students/${updateId}`),{
        [`${major} attendance-percent`] : percent},{merge : true})
    }
    
        
    }
    const totalPercent = async(year,sem,updateId)=>{
        const majorRef = collection(
            db,
            `AttendanceDB/Years/children/${year}/semesters/${sem}/majors`
          )
        const majors = await getDocs(majorRef)
        majors.forEach(async (major) => {
          const studentRef = collection(
            db,
            `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major.id}/Students`
          )
          const students = await getDocs(studentRef)
          students.forEach(async (student) => {
            if (student.id === updateId) {
              const studentRef = doc(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major.id}/Students/${student.id}`)
              console.log(student.attendance_dates)
            }
          });
        });
    }
    
  return {majorPercent,totalPercent}
}
