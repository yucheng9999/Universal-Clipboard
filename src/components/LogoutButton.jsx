import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function LogoutButton() {
  return (
    <button className="logout-btn" onClick={() => signOut(auth)}>
      Log Out
    </button>
  )
}
