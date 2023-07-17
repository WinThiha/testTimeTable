import { db } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import React,{useRef} from 'react'

export default function useDeleteData() {
    const deleteHandler = async(id,path, e)=>{
        e.stopPropagation();
        const docRef = doc(db, path, id)
        await deleteDoc(docRef)
        
          }
  return {deleteHandler}
}
