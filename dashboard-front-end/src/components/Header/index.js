import React from 'react';
import './index.css';
import peakachu from '../../resources/peakachu.png';

const Header = (props) => {
  //const { currentTime } = props;
  return (
    <section className='Header'>
      <div className="name-and-logo">
        <img src={peakachu} alt="peakachu"/>
        <h1>PEAKachu</h1>
      </div>
      <h2>Junction 2018</h2>

    </section>
  )
}

export default Header;