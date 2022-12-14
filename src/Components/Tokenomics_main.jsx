import React from 'react';
import { Link } from "react-router-dom";
import Footer  from '../Components/Footer/Footer';
import Tokenomics from './Tokenomics/Tokenomics';
import Header from '../Components/Header/Header'


function Tokenomics_main() {
  return (
    <div>
        <Header/>
        <section class="page-header-section style-1">
        <div class="container">
            <div class="page-header-content">
                <div class="page-header-inner">
                    <div class="page-title">
                        <h2>Tokenomics </h2>
                    </div>
                    <ol class="breadcrumb">
                        <li><Link to="/">Home</Link></li>
                        <li class="active">Tokenomics</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <Tokenomics />
    <Footer/>
    </div>
  )
}

export default Tokenomics_main