import { useEffect, useRef, useState } from 'react';
import { signInWithGoogle, signOut } from '../../firebase/firebase';
import Styles from './sign-in.module.css';
import { User } from 'firebase/auth';
import userP from "../../../public/avatar.png"


interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {

  const [open, setOpen] = useState(false);
  const menuRef: any = useRef(null);
  console.log(user);
  console.log(user?.email);

  useEffect(() => {
    let handler = (e: any) => {
      if(menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return() => {
      document.removeEventListener("mousedown", handler);
    }

  }, []);
  
  return (
    <div>
      {user ? (
        <section>
          <div className={Styles.menu__container} ref={menuRef}>
            <div className={Styles.menu__trigger} onClick={()=>{setOpen(!open);}}>
              <img src={user?.photoURL || userP.src} />
            </div>

            <div className={`${Styles.dropdown__menu} ${open ? Styles.active : Styles.inactive}`}>
              <ul>
                <li className={Styles.dropdownItem}> <p>My Profile</p> </li>
                <li className={Styles.dropdownItem}> <p>Settings</p> </li>
                <li className={Styles.dropdownItem} onClick={signOut}> <p>Sign Out</p> </li>
              </ul>
            </div>
          </div>
        </section>
      ) : (
        // If user is not signed in, show sign-in button
        <button className={Styles.signin} onClick={signInWithGoogle}>
          Sign in
        </button>
      )}
    </div>
  );
}

function DropdownItem(props: any){
  return(
    <li className = 'dropdownItem'>
      <img src={props.img}></img>
      <a> {props.text} </a>
    </li>
  );
}