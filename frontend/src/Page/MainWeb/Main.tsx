import React, { useEffect, useState } from 'react';
//import { NavBar } from '../Component/NavBar';


//Floor
import market from "../../assets/icon/ForPage/MainIcon/Market.png"
import Food from "../../assets/icon/ForPage/MainIcon/FoodBar.png"
import Decorations from "../../assets/icon/ForPage/MainIcon/Home.png"
import Computer from "../../assets/icon/ForPage/MainIcon/LaptopSettings.png"
import './Main.css';
const Main: React.FC = () => {

    
    

      
    return(
        <>
            <div style={{height: '110px',zIndex: '0'}}></div>
            <div className='AdvertisingMain'>
               
                <span className='advertisingtext'>
                    <h1>Product advertising</h1>
                    loremLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse 
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt  
                    mollit anim id est laborum.
                </span>
            </div>
            {/* <div onClick={handleSubmit}>Gmail</div> */}
            {/* <div className='Floor'>
                <span className='subFloor'>
                    <img src={market} alt="market" />
                    <h4>NIGHT MARKET</h4>
                    <p>Lorem ipsum dolor sit amet, <br />consectetur adipiscing elit, sed <br />do eiusmod tempor incididunt <br />ut labore et dolore </p>
                </span>
                <span className='subFloor'>
                    <img src={Food} alt="Food" />
                    <h4>FOOD CENTER</h4>
                    <p>Lorem ipsum dolor sit amet, <br />consectetur adipiscing elit, sed <br />do eiusmod tempor incididunt <br />ut labore et dolore </p>
                </span>
                <span className='subFloor'>
                    <img src={Decorations} alt="Decorations" />
                    <h4>DECORATIONS</h4>
                    <p>Lorem ipsum dolor sit amet, <br />consectetur adipiscing elit, sed <br />do eiusmod tempor incididunt <br />ut labore et dolore </p>
                </span>
                <span className='subFloor'>
                    <img src={Computer} alt="Computer" />
                    <h4>COMPUTER EQUIPMENT</h4>
                    <p>Lorem ipsum dolor sit amet, <br />consectetur adipiscing elit, sed <br />do eiusmod tempor incididunt <br />ut labore et dolore </p>
                </span>
            </div> */}

           
          {/*<div className='NEWS'>
                <span></span>
                <p>NEWS</p>
                <span></span>
            </div>*/}  
            

           {/***********************************footer******************************************************/}
            <footer className="footer">
                <div className="waves">
                    <div className="wave" id="wave1"></div>
                    <div className="wave" id="wave2"></div>
                    <div className="wave" id="wave3"></div>
                    <div className="wave" id="wave4"></div>
                </div>
                <ul className="social-icon">
                    <li className="social-icon__item">
                    <a className="social-icon__link" href="#">
                        
                    </a>
                    </li>
                    <li className="social-icon__item">
                    <a className="social-icon__link" href="#">
                        
                    </a>
                    </li>
                    <li className="social-icon__item">
                    <a className="social-icon__link" href="#">
                        
                    </a>
                    </li>
                    <li className="social-icon__item">
                    <a className="social-icon__link" href="#">
                        
                    </a>
                    </li>
                </ul>
                <ul className="menu">
                    <li className="menu__item">
                    <a className="menu__link" href="#">Home</a>
                    </li>
                    <li className="menu__item">
                    <a className="menu__link" href="#">About</a>
                    </li>
                    <li className="menu__item">
                    <a className="menu__link" href="#">Services</a>
                    </li>
                    <li className="menu__item">
                    <a className="menu__link" href="#">Team</a>
                    </li>
                    <li className="menu__item">
                    <a className="menu__link" href="#">Contact</a>
                    </li>
                </ul>
                <p>&copy;2024 jakkapan jarcunsook | All Rights Reserved</p>
            </footer>


        </>
    );
};
export default Main;