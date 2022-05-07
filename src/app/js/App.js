import '../styles/components/App.scss';
import Auth from './Auth'
import Main from './Main';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'


function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <Main user={user}/> : <Auth />}
    </div>
  );
}

export default App;
