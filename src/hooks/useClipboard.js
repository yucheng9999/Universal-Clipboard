import { useState, useEffect } from 'react'
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const getDocRef = (uid) => doc(db, 'users', uid, 'clipboard', 'content')

export function useRealtimeClipboard(uid) {
  const [clipboard, setClipboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return

    const unsub = onSnapshot(getDocRef(uid), (snap) => {
      if (snap.exists()) {
        setClipboard(snap.data().text || '')
      } else {
        setClipboard('')
      }
      setLoading(false)
    })

    return () => unsub()
  }, [uid])

  return { clipboard, loading }
}

export async function uploadClipboard(uid, text) {
  await setDoc(getDocRef(uid), {
    text,
    updatedAt: Date.now(),
  })
}

export async function clearClipboard(uid) {
  await deleteDoc(getDocRef(uid))
}
