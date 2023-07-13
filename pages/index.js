import Image from 'next/image'
import { Inter } from 'next/font/google'
import DataTable from '@/components/DataTable'
import AddData from '@/components/AddData'
import UpdateData from '@/components/UpdateData'
import DeleteData from '@/components/DeleteData'
import Link from 'next/link'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
    <DataTable></DataTable>
    <AddData></AddData>
    <UpdateData></UpdateData>
    <DeleteData></DeleteData>
    <Link href={'./students/studentAttendance'}>
<p>TEST</p>
    </Link>
    </div>
  )
}
