import { db } from "@/firebase";
import styles from "./tailwind.module.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";

export default function UpdateData() {
  const [updateId, setUpdateId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const updatedData = { std_name: updatedName, timestamp: serverTimestamp() };

  async function updateHandler() {
    
    const yearRef = collection(db, "AttendanceDB/Years/children");
    const years = await getDocs(yearRef);
    years.forEach(async (year) => {
      const semRef = collection(
        db,
        `AttendanceDB/Years/children/${year.id}/semesters`
      )
      const sems = await getDocs(semRef)
      sems.forEach(async (sem) => {
        const majorRef = collection(
          db,
          `AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors`
        )
       const majors = await getDocs(majorRef)
        majors.forEach(async (major) => {
          const studentRef = collection(
            db,
            `AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors/${major.id}/Students`
          )
          const students = await getDocs(studentRef)
          students.forEach(async (student) => {
            if (student.id === updateId) {
              const studentRef = doc(db,`AttendanceDB/Years/children/${year.id}/semesters/${sem.id}/majors/${major.id}/Students/${student.id}`)
              await updateDoc(studentRef, updatedData)
            }
          });
        });
      });
    });

    const docRef = doc(db, "students", updateId);

    updateDoc(docRef, updatedData);
  }
  return (
    <div className={styles.div1}>
      <pre>{JSON.stringify(updateId)}</pre>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter id"
        onChange={(e) => {
          setUpdateId(e.currentTarget.value);
        }}
      ></input>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter name to change"
        onChange={(e) => setUpdatedName(e.currentTarget.value)}
      ></input>

      <button onClick={updateHandler} className={styles.button}>
        Update
      </button>
    </div>
  );
}
