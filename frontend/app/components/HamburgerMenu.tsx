// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import styles from './HamburgerMenu.module.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (index: number) => {
    // Dispatch custom event to switch tabs
    window.dispatchEvent(new CustomEvent('switchTab', { detail: { index } }));
    setIsOpen(false); // Close menu after navigation
  };

  return (
    <div className={styles.container}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
      </div>
      <nav className={isOpen ? styles.menuOpen : styles.menu}>
        <ul>
          <li><a href="#tabs" onClick={() => handleTabClick(0)}>Tabs</a></li>
          <li><a href="#prelab" onClick={() => handleTabClick(1)}>Pre-lab Questions</a></li>
          <li><a href="#escape" onClick={() => handleTabClick(2)}>Escape Room</a></li>
          <li><a href="#races" onClick={() => handleTabClick(3)}>Coding Races</a></li>
          <li><a href="#about" onClick={() => handleTabClick(4)}>About</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;