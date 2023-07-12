import { db } from '@/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState, useRef, useEffect } from 'react'

export default function useFetchData() {
    const [stdata, setStdata] = useState([])
    useEffect(() => {
        const collectionRef = collection(db, 'Students')
        const q = query(collectionRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshots) => {
            setStdata(querySnapshots.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })
        return unsubscribe
        
    }, [])
  return {stdata, setStdata}
}
