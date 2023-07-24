import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
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
  totalDates =alldates.length
}
  
    })
    for(const presents of alldates){
      const presentQ = doc(db, `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students/${updateId}`)
      const presentSnapshot = await getDoc(presentQ)
      presentSnapshot.data().attendance_dates[presents] === 'Present' ? presentDates += 1 : null

    }
    if(totalDates !== 0){
      const percent = (Math.floor((presentDates/totalDates)*100) ) === NaN ? 0 : Math.floor((presentDates/totalDates)*100)
    await setDoc(doc(db,`students/${updateId}`),{
        [`${major} attendance-percent`] : percent},{merge : true},
        )
        await setDoc(doc(db,`students/${updateId}`),{
          [`${major} present-times`] : presentDates},{merge : true},
          )
        
    }
    
        
    }
    const totalForOne = async(updateId,year,sem)=>{
      let totalTimes = 0 ;
      let presentTimes = 0;
      let allMajors = []
      const dateRef = collection(db,'Dates')
      const dates = await getDocs(dateRef)
      dates.forEach((date)=>{
        totalTimes += (Object.keys(date.data()).length) 
      })

        const colRef = collection(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors`)
      const q = query(colRef,orderBy('name'))
      const majors = await getDocs(q)
      majors.forEach(async (mj)=>{
       if(mj.data().name){
        allMajors.push(mj.data().name)
        }
      })
     
          const stuRef = doc(db, `students/${updateId}`);
          const student = await getDoc(stuRef);
        
          
          
          for (const major of allMajors) {
            const majorPresentTimes = student.data()[`${major} present-times`] || 0;
            presentTimes += majorPresentTimes;
          }
        
          console.log(`${updateId} : ${presentTimes}`);
        
          const percent = Number.isNaN(presentTimes / (totalTimes - 1)) ? 0 : Math.floor((presentTimes / (totalTimes - 1)) * 100);
        
          await setDoc(stuRef, {
            total_percent: percent,
          }, { merge: true });
        
    }
    const totalForAll = async(year,sem,stData)=>{
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
  
          const colRef = collection(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors`)
        const q = query(colRef,orderBy('name'))
        const majors = await getDocs(q)
        majors.forEach(async (mj)=>{
         if(mj.data().name){
          allMajors.push(mj.data().name)
          }
        })
        stData.forEach(async (st) => {
            const stuRef = doc(db, `students/${st.id}`);
            const student = await getDoc(stuRef);
          
            let presentTimes = 0;
            
            for (const major of allMajors) {
              const majorPresentTimes = student.data()[`${major} present-times`] || 0;
              presentTimes += majorPresentTimes;
            }
          
            console.log(`${st.id} : ${presentTimes} / ${totalTimes-1} = ${(presentTimes/(totalTimes-1)) * 100}`);
          
            const percent = Number.isNaN(presentTimes / (totalTimes - 1)) ? 0 : Math.floor((presentTimes / (totalTimes - 1)) * 100);
          
            await setDoc(stuRef, {
              total_percent: percent,
            }, { merge: true });
          });
    }
  return {majorPercent,totalForOne , totalForAll}
}
