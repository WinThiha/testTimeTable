import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import React from 'react'

export default function useCalculateAttendancePercent() {
    const majorPercent = async(year,sem,updateId,major)=>{
      let allDates = []
        let allTimes = []
      let totalTimes = 0;
      let presentDates= 0;
      const datesRef = collection(db, `/Dates/${major} Dates/Dates`)
      const dates = await getDocs(datesRef)
      dates.forEach(async (date)=>{
        allDates.push(date.id)
        const timesRef = doc(datesRef,date.id)
        const times = await getDoc(timesRef)
        Object.keys(times.data()).map(async (time)=>{
   
          allTimes.push(time)
        })
        
      })
      for(const date of allDates){
        const stuDateRef = doc(db,`AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${major}/Students/${updateId}`)
      const stuDates = await getDoc(stuDateRef)
      Object.keys(stuDates.data().attendance_dates).map((stDate)=>{
        for(const time of allTimes){
          if(stDate === date){
            stuDates.data().attendance_dates[stDate][time] === 'Present' ? presentDates+=1 : console.log(stuDates.data().attendance_dates[stDate][time])
          }
        }
      })
      }
      
      
 
      setTimeout(async () => {
        console.log(allTimes);
        totalTimes =allTimes.length
        console.log(totalTimes)
        console.log(presentDates)
        if(totalTimes !== 0){
          const percent = (Math.floor((presentDates/totalTimes)*100) ) === NaN ? 0 : Math.floor((presentDates/totalTimes)*100)
        await setDoc(doc(db,`students/${updateId}`),{
            [`${major} attendance-percent`] : percent},{merge : true},
            )
            await setDoc(doc(db,`students/${updateId}`),{
              [`${major} present-times`] : presentDates},{merge : true},
              )
            
        } 
      }, 2000);
 
 
    
    
        
    }
    /* const totalForOne = async(updateId,year,sem)=>{
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
        
    } */
    const totalForAll = async(year,sem,stData)=>{
      let totalTimes = 0 ;
        let presentTimes = 0;
        let allMajors = []
        const dateRef = collection(db,'Dates')
        const dates = await getDocs(dateRef)
        
        dates.forEach(async (date) => {
          if (date.id !== 'Total Times') {
            const timesRef = collection(db, `Dates/${date.id}/Dates`);
            const times = await getDocs(timesRef);
        
            times.forEach(async (time) => {
              const totalTimesRef = doc(db, `Dates/${date.id}/Dates/${time.id}`);
              const total_Times = await getDoc(totalTimesRef);
              totalTimes += Object.keys(total_Times.data()).length;
            });
          }
        });
        
        setTimeout(async () => {
          const totalRef = doc(db, 'Dates/Total Times')
          await setDoc(totalRef,{totalTimes : (totalTimes)})
        }, 2000);
        
          
  
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
          
          
            const percent = Number.isNaN(presentTimes / (totalTimes)) ? 0 : Math.floor((presentTimes / (totalTimes)) * 100);
          
            await setDoc(stuRef, {
              total_percent: percent,
            }, { merge: true });
          });
    }
  return {majorPercent, totalForAll}
}
