'use client';

import SignIn from "./sign-in";
import Link from "next/link";

import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../../firebase/firebase"; 
import { User } from "firebase/auth";
import Upload from "./upload";

function NavBar() {
  // Initialize user state
  const [user, setUser] = useState<User | null>(null);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [] /* No dependencies, never rerun */);


  return (
    <nav className={styles.nav}>
      <Link href="/" className="link-styles">
          <header className="site-title">
            <img width={50} height={30} src="/camera-logo.svg" alt="Camera Logo" />
          </header>
      </Link>
      <ul>
        <li>
          <Link href="/watch">
            My Reviews
          </Link>
        </li>
        <li>
          <Link href="/films">
            Films
          </Link>
        </li>
        <li>
          {
          user && <Upload />
          }
        </li>
        <li>
          <SignIn user={user} />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
