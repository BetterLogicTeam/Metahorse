import React from 'react';
import { FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { loadWeb3 } from "../api.js";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenAddress, tokenAbi } from '../Utils/token'
import { contractAddress, contractAbi } from '../Utils/contract'
import { Spinner } from './';
import { toast } from 'react-toastify';
import { wireNftContractAbi, wireNftContractAddress } from '../utilies/constant.js';
function Register_main({ notify }) {
    const [loader, setloader] = useState(false)
    const navigate = useNavigate();
    let [matic, setmatic] = useState(0)
    let [ule, setule] = useState(0)
    let [uid, setuid] = useState("");
    const [address, setaddress] = useState('');
    const [connected, setconnected] = useState('MetaMask is not connected..!..Wait...')

    const callapi = async (position, sellCall) => {
        setloader(true)

        console.log("position", position);
        let res = await axios.post('https://ulematic-api.herokuapp.com/registration',
            {
                sid: uid,
                accountnumber: address,
                position: position,
                amount: 10,
                traxn: sellCall
                // traxn: "0x2636a0fa8327fdad7c0441b038838749cec83211bdbe955d278fbc58e1d1bace"

            });
        console.log("reg_Api", res)
        if (res.data.data == 'Accountnumber already exists in joinnow_temp !!') {
            toast.error('Account Already Resgistered with this ID')
            navigate('/Login_main')

        }
        else if (res.data.success == true) {
            console.log(res.data)
            toast.success('Registered Successfully')
            // localStorage.setItem('user_Id', uid)

            setTimeout(() => {
                callLoginApi()
            }, 50000);

        }
        setloader(false)
    }
    const callLoginApi = async () => {
        setloader(true)
        console.log("address", address)
        let res = await axios.get(`https://ulematic-api.herokuapp.com/login?id='${address}'`);
        console.log("login_data", res)
        if (res.data.data !== 0) {

            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("user", JSON.stringify(res.data.data));
            toast.success('Login Successfully')

            navigate('/Dashboard/Home')
        }
        else {
            toast.error("Something went wrong ! ");

        }
        setloader(false)
    }
    const ConnectToMetaMask = async () => {
        let acc = await loadWeb3();
        if (acc == 'No Wallet') {
            notify('No Wallet')
        }
        else if (acc == 'Wrong Network') {
            notify('Wrong Network')
        }
        else {
            setaddress(acc)
            setconnected('MetaMask is connected... Ready To Register')
        }

    }
    const cotractCall = async (position) => {
        setloader(true)
        let acc = await loadWeb3();
        if (acc == 'No Wallet') {
            toast.error('No Wallet')
        }
        else if (acc == 'Wrong Network') {
            toast.error('Wrong Network')
        }
        else {
            setaddress(acc)
            setconnected('MetaMask is connected... Ready To Register')

            ule = ule.toString()
            ule = window.web3.utils.toWei(ule)
            matic = matic.toString()
            matic = window.web3.utils.toWei(matic)
            try {
                let contract = await new window.web3.eth.Contract(wireNftContractAbi, wireNftContractAddress)
                let token = await new window.web3.eth.Contract(tokenAbi, tokenAddress)
                let approveCall = await token.methods.approve(wireNftContractAddress, ule).send({ from: acc });
                toast.success('Approved')
                let sellCall = await contract.methods.sell(ule).send({ from: acc, value: matic });
                toast.success('Transection Succesfull')
                sellCall = sellCall.transactionHash
                callapi(position, sellCall)
            }
            catch (err) {
                console.log("error while calling fuction sell", err)
            }

        }
        setloader(false)
    }
    const callMaticUrliApi = async () => {
        let res = await axios.get(`https://ulematic.herokuapp.com/live_rate_matic`);
        setmatic((Number(res.data.data[0].usdperunit) * 10))


    }
    const callUleApi = async () => {
        let res = await axios.get(`https://ulematic.herokuapp.com/live_rate`);
        setule((Number(res.data.data[0].usdperunit) * 10))
        console.log(Number(res.data.data[0].usdperunit) * 10)

    }

    useEffect(() => {
        setloader(true)
        ConnectToMetaMask();
        callUleApi();
        callMaticUrliApi();

        setloader(false)
    }, [])

    return (

        // <div className='row m-0 justify-content-center align-items-center' style={{height:'100vh'}}>
        //     { loader == true ? <Spinner /> : <></>}
        //     <div className=' col-md-5 col-lg-3 bg-white  mainForm'>
        //     <div className="main_form p-5">
        //                         <h2 className='hh mb-3'>Registration</h2>
        //                         <p className='peera'>Automatic login if you have MetaMask wallet:</p>

        //                         <img src="favicon.png" width="150px" alt="" />
        //         { connected=='MetaMask is not connected..!..Wait...' ? <p className='peera2 pt-3' style={{color:'red'}}>{connected}</p> : <p className='peera2 pt-3' style={{color:'green'}}>{connected}</p>}


        //                         <div className="batan">
        //                             <button className="btn log_batan" onClick={() => {
        //                                 let modelRegister = document.querySelector('.modelRegister')
        //                                 modelRegister.classList.remove('d-none')
        //                                 modelRegister.classList.add('d-flex')
        //                             }}>Register</button>

        //                             <div className=' w-100 h-100 d-none justify-content-center align-items-center  position-absolute  modelRegister'>
        //                                 <div className=' bg-white bord border-dark py-3 px-5 flex-column justify-content-center align-items-center d-flex'>
        //                                     <h4 className=' text-dark fs-5 my-3'>Enter Upline ID</h4>
        //                                     <input type={'number'} className="boxset" 
        //                                      onChange={(e) => {
        //                                         setuid(e.target.value)
        //                                     }} />
        //                                     <div className=' mt-4'>
        //                                         <button className="btn bt loginbtn px-3 mx-2" onClick={() => {
        //                                             if(uid.length>0)
        //                                             {
        //                                                 let modelRegister = document.querySelector('.bordd')
        //                                             let modelRegisterR = document.querySelector('.bord')

        //                                             modelRegister.classList.remove('d-none')
        //                                             modelRegister.classList.add('d-flex')
        //                                             modelRegisterR.classList.remove('d-flex')
        //                                             modelRegisterR.classList.add('d-none')
        //                                             }
        //                                         }}>OK</button>
        //                                         <button className="btn bt loginbtn px-3 mx-2 " onClick={() => {
        //                                 let modelRegister = document.querySelector('.modelRegister')
        //                                 modelRegister.classList.remove('d-flex')
        //                                 modelRegister.classList.add('d-none')
        //                             }}>Close</button>
        //                                     </div>
        //                                 </div>
        //                                 <div className=' bg-white bordd border-dark py-3 px-5 flex-column justify-content-center align-items-center d-none'>
        //                                     <h4 className=' text-dark fs-5 my-3'>Referral Confirmation</h4>
        //                                     <p>Your Current Referral ID is {uid}</p>
        //                                     <div className=' d-flex flex-row align-items-center justify-content-center my-2'>
        //                                         <p className=' p-0  m-0'>Matic</p> <input className='input1 mx-2' defaultValue={matic} value={matic} disabled type={'number'} />
        //                                         <p className=' p-0  m-0'>ULE</p> <input className='input1 mx-2' defaultValue={ule} value={ule} disabled type={'number'} />
        //                                     </div>
        //                                     <select className="boxset" name='position'>
        //                                         <option value={1}>Left</option>
        //                                         <option value={2}>Right</option>
        //                                     </select>
        //                                     <div className=' mt-4'>
        //                                         <button className="btn bt loginbtn px-3 mx-2" onClick={async () => {
        //                                             let position = document.getElementsByName('position')[0].value;
        //                                             await cotractCall(position)

        //                                             let modelRegister = document.querySelector('.modelRegister')
        //                                             let modelRegisterR = document.querySelector('.bord')
        //                                             modelRegisterR.classList.remove('d-none')
        //                                             modelRegisterR.classList.add('d-flex')

        //                                             let modelRegisterRR = document.querySelector('.bordd')
        //                                             modelRegisterRR.classList.remove('d-flex')
        //                                             modelRegisterRR.classList.add('d-none')



        //                                             modelRegister.classList.remove('d-flex')
        //                                             modelRegister.classList.add('d-none')

        //                                         }}>Proceed</button>
        //                                         <button className="btn bt loginbtn px-3 mx-2 " onClick={()=>{
        //                                             let modelRegister = document.querySelector('.bordd')
        //                                             let modelRegisterR = document.querySelector('.bord')

        //                                             modelRegister.classList.remove('d-flex')
        //                                             modelRegister.classList.add('d-none')
        //                                             modelRegisterR.classList.remove('d-none')
        //                                             modelRegisterR.classList.add('d-flex')
        //                                         }}>No I want to change ID</button>
        //                                     </div>

        //                                 </div>
        //                             </div>
        //                             <input className="btn log_batan" placeholder='Please enter ID or Metamask address' onChange={(e) => {
        //                                 setuid(e.target.value)
        //                             }} />
        //                             <div className="btn log_batan" onClick={() => {
        //                                 callLoginApi()
        //                             }}>Connect to Wallet</div>
        //                             <button className="btn log_batan" onClick={() => {
        //                                 navigate('/Login_main')
        //                             }}>Login</button>
        //                         </div>
        //                     </div>
        //     </div>
        // </div>












        <div class="wrapper " style={{ marginTop: "0px", height: '115vh' }}>
            <section class="login-content">
                <div class="container h-100">
                    <div class="row align-items-center justify-content-center h-100">
                        <div class="col-12">
                            <div class="row align-items-center">
                                <div class="col-lg-6 ">
                                    <div class="back_login">
                                        <h2 class="mb-2">Sign Up</h2>
                                        <p>Enter your personal details and start journey with us.</p>
                                        <div id="error-msg"></div>
                                        <form action="#" class="login-signup-form form-signin" method="post">  <div class="alert alert-block alert-danger error-login-t" id="ajax_message" style={{ display: "none" }}>

                                        </div>
                                            <div class="form-group">
                                                <div id="ajax_loading" align="center"></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="form-control" data-val="true" data-val-length="The field sponser_id must be a string with a minimum length of 4 and a maximum length of 12." data-val-length-max="12" data-val-length-min="4" data-val-required="Sponser Id is required" id="sponser_id" maxlength="6" name="sponser_id" oninput="return numbervalidation(this)" placeholder="Enter Sponsor Id" required="required" type="text" value="" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="form-control floating-input" id="sponsername" name="sponsername" placeholder="Sponsor Name" readonly="true" type="text" value="" />
                                                    </div>
                                                </div>

                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="form-control" data-val="true" data-val-length="The field User name must be a string with a minimum length of 1 and a maximum length of 50." data-val-length-max="50" data-val-length-min="1" data-val-required="The User name field is required." id="f_name" name="f_name" oninput="return namevalidation(this)" placeholder="User Name" required="required" type="text" value="" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="floating-input form-control" data-val="true" data-val-required="Mobile number is required" id="mobile" maxlength="10" name="mobile" oninput="return numbervalidation(this)" placeholder="Mobile Number" required="required" type="text" value="" />
                                                    </div>
                                                </div>

                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="form-control input-log-cls" data-val="true" data-val-email="Invalid Email Address" id="email" name="email" placeholder="example@gmail.com" required="required" type="text" value="" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="row">
                                                        <div class="col-md-12 col-lg-12" id="sendbtndiv">
                                                            <button type="button" id="sendotpbtn" class="btn btn-success mb-2 btn-md">Send OTP For Email Verification</button>
                                                        </div>
                                                        <div class="col-md-6" id="resendbtndiv" style={{ display: "none" }}>
                                                            <button type="button" id="resendotpbtn" class="btn btn-success btn-md">Resend OTP</button>
                                                        </div>
                                                        <div class="col-md-6" id="otpdiv" style={{ display: "none" }}>
                                                            <div class="floating-label form-group">
                                                                <input class="floating-input form-control" id="otp" maxlength="8" name="otp" oninput="return numbervalidation(this)" placeholder="Enter OTP" type="text" value="" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="floating-input form-control" data-val="true" data-val-length="Enter minimum 5 character" data-val-length-max="50" data-val-length-min="5" data-val-required="The password field is required." id="password" name="password" placeholder="Password" required="required" type="password" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <div class="floating-label form-group">
                                                        <input class="floating-input form-control" data-val="true" data-val-equalto="The password and confirmation password do not match." data-val-equalto-other="*.password" data-val-required="The confirmpassword field is required." id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" required="required" type="password" />
                                                    </div>
                                                </div>
                                                <div class="col-lg-12">
                                                    <div class="custom-control custom-checkbox mb-3">
                                                        <input class="" data-val="true" data-val-required="The TermsAndConditions field is required." id="TermsAndConditions" name="TermsAndConditions" type="checkbox" value="true" /><input name="TermsAndConditions" type="hidden" value="false" />
                                                        <label class="" for="customCheck1">I Agree Your <a href="#" className='text-prim'>Terms and Conditions</a></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-prim">Sign Up</button>
                                            <p class="mt-3">
                                                Already have an Account <Link to="/Login_main"><a href="login.html" class="text-primary">Sign In</a></Link>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-lg-6 mb-lg-0 mb-4 mt-lg-0 mt-4">
                                    <img src="1.webp" class="img-fluid w-80" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>









        // <div className='log_main'>
        //     <div className="log">
        //         <div className="container log_con">
        //             <div className="row ">
        //                 <div className="col-md-2"></div>
        //                 <div className="col-md-4 hvr">

        //                 </div>

        //                 <div className="col-md-4 hvr">
        //                     <div className="main_form2">
        //                         <div className="for_emg">
        //                             <img src="favicon.png" className='hh mb-3'></img>
        //                         </div>
        //                         <p className='peera'>Follow us on Telegram</p>
        //                         <div className="icn_tele">
        //                             <FaTelegram></FaTelegram>
        //                         </div>
        //                         <div className='query pb-3'>Any query you can get support:</div>

        //                         {/* <img src="metamask.png" width="70px" alt="" />
        //                 <p className='peera2'>MetaMask is not connected..!..Wait...</p> */}

        //                         <div className="batan2">
        //                             <div className="btn toll">Support Toll-Free 1800-120-4099</div>
        //                             {/* <div className="btn log_batan">Please enter ID or Metamask address</div> */}
        //                             <Link to="/">  <div className="btn log_batan hom">Go To Home</div></Link>

        //                             {connected == 'MetaMask is not connected..!..Wait...' ? <p className='peera2 pt-3'>Please Install MetaMask!</p> : <></>}

        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Register_main