/* import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Link from 'next/link';
export default function makeTimeTable() {
  const [times, setTimes] = useState(0);
  const [days, setDays] = useState([])
  const [day, setDay] = useState('')
  const [major, setMajor] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [table, setTable] = useState({})
  const timesHeader = []
  const [timeTableDataObject, setTimeTableDataObject] = useState({});
  const [edit, setEdit] = useState(false)


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

      if (days.indexOf(daysData) === -1) {
        setDays(daysData);
      }

      const totalTimesRef = doc(db, 'TimeTable/Fourth Year/sem2/totalTimesADay');
      const eTimes = await getDoc(totalTimesRef);
      if (eTimes.data()) {
        setTimes(eTimes.data().total);
      }




    };

    fetchData();
  }, []);

  const handleEdit = () => {
    setEdit(true)
  }
  const handleDoneEdit = () => {
    setEdit(false)
  }

  const sortedDays = [...days].sort((a, b) => {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekDays.indexOf(a) - weekDays.indexOf(b);
  })


  const dayHandler = async () => {
    if (day !== '') {
      days.push(day)
      console.log(days)
      for (const eDay of days) {
        console.log(eDay)
        const timeDayRef = doc(db, `TimeTable/Fourth Year/sem2/${eDay}`)
        await setDoc(timeDayRef, {
          name: eDay
        })
      }
      setDay('')

    }


  }
  const timeHandler = async () => {
    const timesRef = doc(db, `TimeTable/Fourth Year/sem2/totalTimesADay`)
    await setDoc(timesRef, {
      total: times
    })
    const timeDayColRef = collection(db, `TimeTable/Fourth Year/sem2`)
    const days = await getDocs(timeDayColRef)
    days.forEach(async (eDay) => {
      for (let i = 1; i <= times; i++) {
        const timeDayRef = doc(db, `TimeTable/Fourth Year/sem2/${eDay.id}/time/${i}`)
        await setDoc(timeDayRef, {
          time: i
        })
      }
    })

    console.log(timesHeader)
  }
  for (let i = 1; i <= times; i++) {
    timesHeader.push(i);
  }
 
  const handleCellChange = (day, time, newValue) => {
    // Create a copy of the timeTableDataObject to avoid mutating the state directly
    const newData = { ...timeTableDataObject };
  
    // Update the value in the newData object
    if (!newData[day]) {
      newData[day] = {};
    }
    newData[day][time] = newValue;
  
    // Update the state with the new data
    setTimeTableDataObject(newData);
    const majorTimeRef = doc(db, `TimeTable/Fourth Year/sem2/${day}/time/${time}`);
    setDoc(majorTimeRef, { major: newValue })
      .then(() => {
        console.log('Data successfully updated in the database.');
      })
      .catch((error) => {
        console.error('Error updating data in the database:', error);
      });
  
  };
  
  const showCell = (day, time) => {
    if (timeTableDataObject[day] && timeTableDataObject[day][time]) {
      // If the cell has data, display the value inside the input field
      return (
        <td>
          <input
            type="text"
            value={timeTableDataObject[day][time]}
            onChange={(e) => handleCellChange(day, time, e.target.value)}
          />
        </td>
      );
    } else {
      // If the cell is empty, show an empty input field to add new data
      return (
        <td>
          <input
            type="text"
            value=""
            onChange={async (e) => {
              handleCellChange(day, time, e.target.value)
              
            }}
          />
        </td>
      );
    }
  }
    
  




  return (
    <>
      <div>

        {JSON.stringify(days)}
        <select onChange={(e) => setDay(e.currentTarget.value)} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>Choose a day</option>
          <option value="Mon">Mon</option>
          <option value="Tue">Tue</option>
          <option value="Wed">Wed</option>
          <option value="Thu">Thu</option>
          <option value="Fri">Fri</option>
          <option value="Sat">Sat</option>
          <option value="Sun">Sun</option>
        </select>

        <button className={styles.button} onClick={dayHandler}>add day</button>
        <input className={styles.inputbox} placeholder='Please Enter times' onChange={(e) => { setTimes(e.currentTarget.value) }}></input>
        <button className={styles.button} onClick={() => {
          timeHandler()
          setShowTable(true)
        }} >Add times</button>

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
            {sortedDays.map((day, index) => (
              <tr key={index}>
                <th scope='row'>{day}</th>
                {timesHeader.map((time, timeIndex) => <>
                  {showCell(day, time)}
                </>

                )}
              </tr>
            ))}

          </tbody>
        </table>
                  <Link href={'./timeTable'}><p>Go back</p></Link>
      </div>
    </>
  )
}
 */