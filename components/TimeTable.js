import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, doc, getDoc, getDocs, namedQuery, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Link from 'next/link';
export default function TimeTable(props) {
    const {year,sem} = props
    const [days, setDays] = useState([])
    const [times, setTimes] = useState(0)
    const [showTable, setShowTable] = useState(false)
    const timesHeader = []
    const timeTableData = []
    const [major, setMajor] = useState('')
    const majorObject = {}
    const [timeTableDataObject, setTimeTableDataObject] = useState({});
    const [edit, setEdit] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            const timeDayColRef = collection(db, `TimeTable/${year}/${sem}`);
            const daysSnapshot = await getDocs(timeDayColRef);
            for (const dayDoc of daysSnapshot.docs) {
                const day = dayDoc.id;
                const timeColRef = collection(db, `TimeTable/${year}/${sem}/${day}/time`);
                const timesSnapshot = await getDocs(timeColRef);

                for (const timeDoc of timesSnapshot.docs) {
                    const time = timeDoc.id;
                    const majorColRef = doc(db, `TimeTable/${year}/${sem}/${day}/time/${time}`);
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


            const totalTimesRef = doc(db, `TimeTable/${year}/${sem}/totalTimesADay`);
            const eTimes = await getDoc(totalTimesRef);
            if (eTimes.data()) {
                setTimes(eTimes.data().total);
            }




        }


        fetchData();






    }, []);




    Object.keys(timeTableDataObject).map((data) => {
        console.log(data)
    })




    const sortedDays = [...days].sort((a, b) => {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return weekDays.indexOf(a) - weekDays.indexOf(b);
    })
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
        const majorTimeRef = doc(db, `TimeTable/${year}/${sem}/${day}/time/${time}`);
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
        <div>
            {edit === true ? <table className="table">
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
            </table> : <table className="table">
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
                        sortedDays.map((day) => <>
                            <tr>

                                <th scope='row'>{day}</th>
                                {timesHeader.map((time) => <>
                                    <td className='select-none'>{timeTableDataObject[day][time]}</td>
                                </>)}
                            </tr>
                        </>)
                    }



                </tbody>
            </table>}

            {edit == false ? <button className={styles.button} onClick={() => setEdit(true)}>Edit</button> : <button className={styles.button} onClick={() => setEdit(false)}>Done</button>}


        </div>
    )
}
