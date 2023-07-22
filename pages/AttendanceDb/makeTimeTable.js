import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
export default function makeTimeTable() {
    const [times,setTimes] = useState(0);
    const [days,setDays] = useState([])
    const [day,setDay] = useState('')
    const timesHeader = []

    useEffect(() => {
        const fetchData = async () => {
          const timeDayColRef = collection(db, 'TimeTable/Fourth Year/sem2');
          const daysSnapshot = await getDocs(timeDayColRef);
          const daysData = daysSnapshot.docs.map((doc) => {if (doc.data().name) {
            return doc.id
          }});
      
          const totalTimesRef = doc(db, 'TimeTable/Fourth Year/sem2/totalTimesADay');
          const eTimes = await getDoc(totalTimesRef);
          if (eTimes.exists) {
            setTimes(eTimes.data().total);
          }
          
      
          setDays(daysData);
        };
      
        fetchData();
      }, []);
      for (let i = 1; i <= times; i++) {
        timesHeader.push(i);
      }
      console.log(timesHeader)
      
    console.log(times)
    console.log(days)
    const dayHandler = async()=>{
        if(day !== ''){
            setDays([...days,day])
            console.log(days)
            for(const eDay of days){
                console.log(eDay)
                const timeDayRef = doc(db,`TimeTable/Fourth Year/sem2/${eDay}`)
                await setDoc(timeDayRef,{
                    name : eDay
                })
            }
            setDay('')

        }
       
        
    }
    const timeHandler = async()=>{
        const timesRef = doc(db,`TimeTable/Fourth Year/sem2/totalTimesADay`)
        await setDoc(timesRef,{
            total : times
        })
        const timeDayColRef = collection(db,`TimeTable/Fourth Year/sem2`)
        const days = await getDocs(timeDayColRef)
        days.forEach(async(eDay)=>{
            for(let i=1 ; i<=times;i++){
            const timeDayRef = doc(db,`TimeTable/Fourth Year/sem2/${eDay.id}/time/${i}`)
            await setDoc(timeDayRef,{
                time : i
            })
            }
        })
        
    }
  return (
    <>
    <div>
        <input className={styles.inputbox} placeholder='Please Enter Days' onChange={(e)=>{setDay(e.currentTarget.value)}}></input>
        <button className={styles.button} onClick={dayHandler}>add day</button>
        <input className={styles.inputbox}placeholder='Please Enter times' onChange={(e)=>{setTimes(e.currentTarget.value)}}></input>
        <button className={styles.button} onClick={timeHandler} >Add times</button>
       
        <table class="table">
    <thead>
      <tr>
        <th scope="col">days</th>
       {timesHeader.map((time, index)=>(
        <th scope='col' key={index}>{time}</th>
       ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td colspan="2">Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table></div></>
  )
}
