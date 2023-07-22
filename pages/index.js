import Image from 'next/image'
import { Inter } from 'next/font/google'
import DataTable from '@/components/DataTable'
import AddData from '@/components/AddData'
import UpdateData from '@/components/UpdateData'
import DeleteData from '@/components/DeleteData'
import Link from 'next/link'
import AddYear from '@/components/AddYear'
import AddMajors from '@/components/AddMajors'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
    <DataTable></DataTable>
    <AddYear></AddYear>
    <AddMajors></AddMajors>
    <AddData></AddData>
    <UpdateData></UpdateData>
    <DeleteData></DeleteData>
    <Link href={'./students/studentAttendance'}>
<p>TEST</p>
    </Link>
    <Link href={'./AttendanceDb/test'}>
    <p>Test Attendance Db</p>
    </Link>
    <Link href={'./AttendanceDb/makeTimeTable'}>
    <p>test timetable</p></Link>
    </div>
  )
}
