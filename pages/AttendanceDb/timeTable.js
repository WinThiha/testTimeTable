import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDoc, getDocs, namedQuery, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Link from 'next/link';
export default function timeTable() {
    const [days, setDays] = useState([])
    const [times, setTimes] = useState(0)
    const [showTable, setShowTable] = useState(false)
    const timesHeader = []
    const timeTableData = []
    const [major, setMajor] = useState('')
    const majorObject = {}
    const [timeTableDataObject,setTimeTableDataObject] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            const timeDayColRef = collection(db, 'TimeTable/Fourth Year/sem2');
            const daysSnapshot = await getDocs(timeDayColRef);
            for (const dayDoc of daysSnapshot.docs) {
                const day = dayDoc.id;
                const timeColRef = collection(db, `TimeTable/Fourth Year/sem2/${day}/time`);
                const timesSnapshot = await getDocs(timeColRef);

                for (const timeDoc of timesSnapshot.docs) {
                    const time = timeDoc.id;
                    const majorColRef = doc(db, `TimeTable/Fourth Year/sem2/${day}/time/${time}`);
                    const majorsSnapshot = await getDoc(majorColRef);

                    
                        if (!timeTableDataObject[day]) {
                            timeTableDataObject[day] = {};
                          }
                  
                        
                            timeTableDataObject[day][time] = majorsSnapshot.data().major;
                         

                    
                }
                setTimeTableDataObject(timeTableDataObject)
            }



            const daysData = daysSnapshot.docs.map((doc) => {
                if (doc.data().name) {
                    return doc.id
                }
            }).filter((day) => day !== undefined);;


            setDays(daysData);


            const totalTimesRef = doc(db, 'TimeTable/Fourth Year/sem2/totalTimesADay');
            const eTimes = await getDoc(totalTimesRef);
            if (eTimes.data()) {
                setTimes(eTimes.data().total);
            }




        }


        fetchData();






    }, []);





    Object.keys(timeTableDataObject).map((data)=>{
        console.log(data)
    })




    const sortedDays = [...days].sort((a, b) => {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return weekDays.indexOf(a) - weekDays.indexOf(b);
    })
    for (let i = 1; i <= times; i++) {
        timesHeader.push(i);
    }


    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">days</th>
                        {timesHeader.map((time, index) => (
                            <th scope='col' key={index}>{time}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedDays.map((day)=><>
                            <tr>

                                <th scope='row'>{day}</th>
                                {timesHeader.map((time)=><>
                                    <td>{timeTableDataObject[day][time]}</td>
                                </>)}
                            </tr>
                        </>)
                    }
                    
                   
                    
                </tbody>
            </table>
            <Link href={'./makeTimeTable'}><p>Go edit the timeTable</p></Link>
            </div>
    )
}
