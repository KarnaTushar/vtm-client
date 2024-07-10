import React from 'react';
import Link from 'next/link';

const Home = () => (
  <div>
    <h1>Welcome to the Vehicle Management System</h1>
    <nav>
      <ul>
        <li><Link href="/drivers">Drivers</Link></li>
        <li><Link href="/vehicles">Vehicles</Link></li>
      </ul>
    </nav>
    <Link href="/transfers">Transfers</Link>
  </div>
);

export default Home;
