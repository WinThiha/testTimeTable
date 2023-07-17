import React, { useState } from "react";
import styles from "./tailwind.module.css";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function AddData() {
  const [student, setStudent] = useState({
    std_name: "",
    std_email: "",
    std_id: "",
  });
  const [year, setYear] = useState("");
  const [sem, setSem] = useState("");

  const submitHandler = async () => {
    const docRef = collection(
      db,
      `AttendanceDB/Years/children/${year}/semesters/${sem}/majors`
    );

    const majorsSnapshot = await getDocs(docRef);
    majorsSnapshot.forEach(async (majors) => {
      const collectionRef = doc(
        db,
        `AttendanceDB/Years/children/${year}/semesters/${sem}/majors/${
          majors.data().name
        }/Students/${student.std_id}`
      );
      const dofRef = await setDoc(collectionRef, {
        ...student,
        timestamp: serverTimestamp(),
      });
    });
    const colRef = doc(db, `students/${student.std_id}`);
    await setDoc(colRef, { ...student, timestamp: serverTimestamp(),year : year });
  };
  return (
    <div className={styles.div1}>
      <pre>{JSON.stringify(student)}</pre>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter year"
        onChange={(e) => setYear(e.currentTarget.value)}
      ></input>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter sem"
        onChange={(e) => setSem(e.currentTarget.value)}
      ></input>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter id"
        onChange={(e) => setStudent({ ...student, std_id: e.currentTarget.value })}
      ></input>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter name"
        onChange={(e) =>
          setStudent({ ...student, std_name: e.currentTarget.value })
        }
      ></input>
      <input
        className={styles.inputbox}
        type="text"
        placeholder="enter email"
        onChange={(e) =>
          setStudent({ ...student, std_email: e.currentTarget.value })
        }
      ></input>

      <button onClick={submitHandler} className={styles.button}>
        Add
      </button>
    </div>
  );
}
