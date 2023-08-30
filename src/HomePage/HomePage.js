import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/stream_line_blue.png'
import './HomePage.css'

export default function HomePage() {
    return (
        <div className='homepage_wrraper'>
            <div className='center'>
                <img className='logo' src={Logo} />
                <Link to={'../qr-creation'}>
                    <button className='rounded_button'>Lets Create Sample QR</button>
                </Link>
            </div>
        </div>
    )
}