import TimeTable from '@/components/TimeTable'
import React, { useEffect, useState } from 'react'
import styles from '@/components/tailwind.module.css'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import Link from 'next/link'
export default function chooseTimeTable() {
    const [year, setYear] = useState('')
    const [sem, setSem] = useState('')
    const [showTable, setShowTable] = useState(false)
    const [totalYears, setTotalYears] = useState([])

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
    return (
        <div>
            <div className='flex flex-row'>


                <select onChange={(e) => {setYear(e.currentTarget.value)
                setShowTable(false)}} class="mr-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Choose Year</option>
                    {totalYears.map((year) => (
                        <option value={year}>{year}</option>
                    ))}
                </select>

                <select onChange={(e) => {setSem(e.currentTarget.value) 
                    setShowTable(false)}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max[40ch] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Choose sem</option>
                    <option value="sem1">sem1</option>
                    <option value="sem2">sem2</option>
                </select>
            </div>
            <button className={styles.button} onClick={() => setShowTable(true)}>Show</button>
            {showTable == true && <TimeTable year={year} sem={sem}></TimeTable>}
            <Link href={'./createTimeTable'}>Create New</Link>
        </div>
    )
}
