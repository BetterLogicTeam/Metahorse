// import React from 'react'
// import { Link } from "react-router-dom";
import Header from '../Header/Header'
import Footer from '../Footer/Footer';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Mint.css'
// import { getWallet, NftData } from '../../../redux/redux/actions/actions'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from "react-toastify";
import { loadWeb3 } from '../../api';
// import Spinner from '../../Loading_Spinner/Spinner';
import axios from 'axios';
// import { useMoralis, useMoralisFile } from 'react-moralis'


// import { Moralis } from 'moralis'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
// import zan from '../../../Assest/gameplay-thumbnail2.png'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import horse from '../../assets/zan.png'
import { wireNftContractAbi, wireNftContractAddress, wireTokenAbi, wireTokenAddress } from '../../utilies/constant';
import { MintingContractAddress, MintingContract_ABI } from '../../Utils/contract';
// import { MintingContractAddress, MintingContract_ABI } from '../../../utilies/Contract';

export default function Minting({ setModalShow, btnTxt }) {
    let dispatch = useDispatch();
    // let { acc } = useSelector(state => state.connectWallet);
    const [userid, setuserid] = useState()
    let [Array_NFT, setArray_NFT] = useState([])


    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '0', name: 'NFT Name', description: '' })
    const [nftImage, setNftImage] = useState("")
    let [getInpiut, setGetInput] = useState({ first: "", second: "", third: "", image: "" })
    const [copyTest, setcopyTest] = useState(false)
    const [RefID, setRefID] = useState()

    let [addressacc, setaddressacc] = useState();
    let [isSpinner, setIsSpinner] = useState(false)
    let [myUrl, setMyUrl] = useState()
    // const { saveFile, moralisFile } = useMoralisFile()
    // const { authenticate, isAuthenticated, isAuthenticating, user, account, logout, initialize } = useMoralis();

    let [value, setValue] = useState(1)
    let [point, setPoint] = useState(0);
    let [mintPriceBnb, setMintPriceBnb] = useState(0);
    let [mintPriceBUSD, setMintPriceBUSD] = useState(0);
    let [mintPriceWire, setmintPriceWire] = useState(0);
    let [btnOne, setButtonOne] = useState("Mint With BNB");
    let [btnTwo, setButtonTwo] = useState("Mint With Wire");
    let [btnThree, setButtonThree] = useState("Mint With Busd")

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const increaseValue = () => {
        if (value < 5) {
            setValue(++value)
            console.log("setValue", value)
        }

    }
    const decreaseValue = () => {
        if (value > 1) {
            setValue(--value)
            console.log("setValue", value)
        }

    }
    console.log('what is user id', userid)

    let wiregetvalue = async () => {
        try {
            const web3 = window.web3;
            let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);
            // let mintingWirePrice = await nftContractOf.methods.ValueinULE().call()
            let mintingWirePrice = await nftContractOf.methods.ValueinULE().call()

            mintingWirePrice = web3.utils.fromWei(mintingWirePrice);
            mintingWirePrice = parseFloat(mintingWirePrice)
            mintingWirePrice = mintingWirePrice;
            console.log("Dattattaa", (mintingWirePrice));
            setmintPriceWire(mintingWirePrice);

        } catch (e) {
            console.log("Error while caling wireValu", e);
        }
    }
    const myMintWire = async () => {
        let acc = await loadWeb3();
        // console.log("ACC=",acc)
        if (acc == "No Wallet") {
            toast.error("No Wallet Connected")
        }
        else if (acc == "Wrong Network") {
            toast.error("Wrong Newtwork please connect to test net")
        } else {
            try {
                setButtonTwo("Please Wait While Processing")
                console.log("mintFor Wire", acc);
                const web3 = window.web3;
                let nftContractOf = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress);
                let wireContractOf = new web3.eth.Contract(wireTokenAbi, wireTokenAddress);

                let userBusdBalance = await wireContractOf.methods.balanceOf(acc).call();
                console.log("maxSupply", userBusdBalance);
                userBusdBalance = web3.utils.fromWei(userBusdBalance)
                let maxSupply = await nftContractOf.methods.maxsupply().call();
                let ttlSupply = await nftContractOf.methods.totalSupply().call();
                let paused = await nftContractOf.methods.paused().call();
                let maxLimitprTransaction = await nftContractOf.methods.MaxLimitPerTransaction().call();
                let mintingWirePrice = await nftContractOf.methods.ValueinULE().call()
                mintingWirePrice = web3.utils.fromWei(mintingWirePrice);
                mintingWirePrice = parseFloat(mintingWirePrice)
                console.log('what is minting price', mintingWirePrice)
                setmintPriceWire(mintingWirePrice);
                let totalMintingPriceWire = value * mintingWirePrice


                // let llisted_check = await nftContractOf.methods.iswhitelist(acc).call()
                // console.log("iswhitelist", llisted_check);


                // if (llisted_check == 'true') {

                if (parseInt(ttlSupply) < parseInt(maxSupply)) {
                    console.log("mintingWirePrice", paused);
                    if (paused == false) {
                        if (value < parseInt(maxLimitprTransaction)) {
                            if (parseFloat(userBusdBalance) >= totalMintingPriceWire) {


                                totalMintingPriceWire = web3.utils.toWei(totalMintingPriceWire.toString())
                                console.log("totalMintingPriceWire", totalMintingPriceWire);

                                // await wireContractOf.methods.approve(wireNftContractAddress, totalMintingPriceWire).send({
                                //     from: acc
                                // })
                                // toast.success("Transaction Approved")
                                setButtonTwo("Please Wait for Second Confirmation")
                                let totalMintingPriceWirereponce = await nftContractOf.methods.mint_with_token(value, totalMintingPriceWire.toString()).send({
                                    from: acc,
                                })
                                let ress = await axios.post('https://metahorse.herokuapp.com/buynfttoken', {
                                    sid: userid,
                                    address: acc,
                                    nft: value,
                                    token: '100',
                                    txn: totalMintingPriceWirereponce.transactionHash

                                })
                                console.log("REsponse", ress);

                                toast.success("Transaction Successful")
                                setButtonTwo("Mint With Wire")

                            } else {
                                toast.error("Out Of Balance")
                                setButtonTwo("Mint With Wire")

                            }

                        } else {
                            toast.error("No of Minting is Greater than maximum limit Per Transaction")
                            setButtonTwo("Mint With Wire")

                        }
                    } else {
                        toast.error("Paused is False")
                        setButtonTwo("Mint With Wire")

                    }

                } else {
                    toast.error("Max Supply is Greater than total Supply")
                    setButtonTwo("Mint With Wire")

                }

                // }
                // else {

                //     let BusdPrice = await nftContractOf.methods.WhitelistMinitngPricein_MMX().call();
                //     totalMintingPriceWire = web3.utils.toWei(totalMintingPriceWire.toString())
                //     await wireContractOf.methods.approve(wireNftContractAddress, totalMintingPriceWire).send({
                //         from: acc
                //     })

                //     let a = web3.utils.fromWei(BusdPrice);
                //     a = parseFloat(a)
                //     let b = a * value;
                //     let c = web3.utils.toWei(b.toString());

                //     await nftContractOf.methods.mint_with_MMX(value, c).send({
                //         from: acc,
                //     })


                //     setButtonTwo("Mint With Wire")


                // }


            } catch (e) {
                console.log("Error while minting ", e)
                toast.error("Transaction failed")
                setButtonTwo("Mint With Wire")

            }

        }
    }

    const CheckSponserid = async () => {
        console.log('what is user id inside function', userid)
        handleClose()
        let res = await axios.get(`https://metahorse.herokuapp.com/checkuser?id=${userid}`);
        console.log("res", res.data.data);
        if (res.data.data == 1) {
            myMintWire()
        }
        else {
            toast.error("user is not exsist")
        }
    }


    const Nft_Collection = async () => {
        let acc = await loadWeb3();
        try {
            const web3 = window.web3
            let Data_Array = []
            let contractOf_Own = new web3.eth.Contract(wireNftContractAbi, wireNftContractAddress)
            console.log('metamaskadress', acc)
            let WalletOwnOf = await contractOf_Own.methods.walletOfOwner(acc).call();
            let wallet_Length = WalletOwnOf.length
            console.log("walletOfOwner", WalletOwnOf);
            let Wallet_URI
            for (let i = 0; i < wallet_Length; i++) {
                console.log("WalletOwnOf", WalletOwnOf[i]);
                let ArryData = WalletOwnOf[i]
                if (WalletOwnOf[i] > 11) {
                    Wallet_URI = await axios.get(`https://gateway.pinata.cloud/ipfs/QmXjHodoKqNz8kUAqh8b6xGreZTWfYDeD9X1ipJXo4vm5c/${WalletOwnOf[i]}.png`);

                } else {

                    Wallet_URI = await axios.get(`https://gateway.pinata.cloud/ipfs/QmXjHodoKqNz8kUAqh8b6xGreZTWfYDeD9X1ipJXo4vm5c/${WalletOwnOf[i]}.jpeg`);
                }
                console.log("Image", Wallet_URI.config.url);
                // let res = await axios.get(Wallet_URI);
                // console.log("Res", res.data);
                let Image_Url = Wallet_URI.config.url
                // let NFT_Name = res.data.title

                Data_Array = [...Data_Array, { Tokenid: ArryData, Url: Image_Url, address: acc }]
                setArray_NFT(Data_Array)
            }
            // console.log("Wallet_URI",Wallet_URI);    

        } catch (e) {
            console.log("Erroe while Call My_cooletion Fuction", e);
        }


    }
    console.log('what is collection', Array_NFT)
    useEffect(() => {
        // wiregetvalue()
        Nft_Collection()


    }, []);
    useEffect(() => {
        wiregetvalue()



    });
    return (
        <div>
            <Header />
            <div className='main_div_app wallet-section' >
                <div class="container ">
                    <div class="bx-view ">
                        <div class="bx-full">

                            <div class="bx-content default  minting_hereeeee">
                                <div class="inner-content minting_page">
                                    {
                                        isSpinner ? (
                                            <>

                                                {/* <Spinner /> */}

                                            </>
                                        ) : (
                                            <div class="viewPega">
                                                <div className="innerdiv_mint">
                                                    <div className="row">
                                                        <div className="col-lg-5">
                                                            <div className="inner_first_div_img">
                                                                <img src={horse} alt="" width="100%" className='minting_img' />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-6 mt-4">
                                                            <div className="mint_div_main"> */}
                                                        <div class=" col-lg-7 mt-lg-5 col-md-12 d-flex flex-column justify-content-start align-items-flex-start">



                                                            <div className='d-flex flex-row justify-content-center pt-lg-5 pt-3'>
                                                                {/* <a style={{ cursor: "pointer" }}><img onClick={() => decreaseValue()} src="https://i.ibb.co/FswxxGJ/Group-187.png" width="60px" /></a> */}

                                                                <a href="#" class="default-btn move-right" onClick={() => decreaseValue()}>
                                                                    <span>-</span>{" "}
                                                                </a>
                                                                <div className=' mt-1 mx-4'>{value}</div>
                                                                <a href="#" class="default-btn move-right" onClick={() => increaseValue()}>
                                                                    <span>+</span>{" "}
                                                                </a>
                                                                {/* <a className='ms-4' style={{ cursor: "pointer" }}><img onClick={() => increaseValue()} src="https://i.ibb.co/ZGpn9P7/Group-188.png" width="60px" /></a> */}
                                                            </div>
                                                            <div class="btnallhere">

                                                                {/* <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                    <button
                                                                        onClick={() => myMintBNB()} 
                                                                        className='btn mintbtn firstbtn ms-4 '>{btnOne}</button>
                                                                    <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price : {mintPriceBnb} BNB</p>
                                                                </div> */}
                                                                <div className='d-flex justify-content-center align-items-center mt-lg-5 mt-3'>
                                                                    <a href="#" class="default-btn move-right" onClick={() => handleShow()}>
                                                                        <span>Mint with Oud NFT</span>{" "}
                                                                    </a>
                                                                    <p className='stakepageP text-white ms-4 mt-2 fs-5 fw-3'>Price : {mintPriceWire.toFixed(2)} OUD</p>
                                                                </div>


                                                            </div>

                                                            {/* <div className="main_div_reflink">
                                                                {copyTest ? <span style={{ color: 'red', marginLeft: '1rem' }}>Copied.</span> : null}

                                                                <input type="text" className='refdata' value={`http://localhost:3001/Items/Mint?referrallink=${RefID}`} />
                                                                <CopyToClipboard text={`http://localhost:3001/Items/Mint?referrallink=${RefID}`}
                                                                    onCopy={() => setcopyTest(true)}  >
                                                                    <div className='main_class_copy'>

                                                                        <button

                                                                            className='btn mintbtn copybtn ms-4 '>Copy</button>
                                                                    </div>
                                                                </CopyToClipboard>

                                                            </div> */}


                                                        </div>
                                                        {/* </div> */}





                                                    </div>

                                                </div>

                                                <Modal show={show} onHide={handleClose} className="" centered >
                                                    {/* <Modal.Header closeButton style={{ backgroundColor: "#3a1f05" }}>
                                                        <Modal.Title className='text-white'>Sponser ID</Modal.Title>
                                                    </Modal.Header> */}
                                                    <Modal.Body style={{ backgroundColor: "#3a1f05" }}>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Enter Id</Form.Label>
                                                            <Form.Control type="number" value={userid} onChange={(e) => setuserid(e.target.value)} className='' placeholder="Enter here" />

                                                        </Form.Group>

                                                        {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control type="text" className='text-white' placeholder="enter here" />
                                                        </Form.Group> */}
                                                        <a href="#" class="default-btn move-right" onClick={() => { CheckSponserid() }}>
                                                            <span>submit</span>{" "}
                                                        </a>

                                                    </Modal.Body>

                                                </Modal>

                                                <div class="list-pick"></div>
                                            </div>
                                        )

                                    }

                                </div>
                            </div>


                        </div>
                    </div>
                    <div class="row justify-content-center gx-4 gy-3 mt-3">
                        {
                            Array_NFT.map((items, idex) => {
                                let index = idex + 1;
                                return (
                                    <>

                                        <div class="col-xl-4 col-lg-4 col-sm-6">
                                            <div class="nft-item">
                                                <div class="nft-inner">
                                                    <div class="nft-item-top d-flex justify-content-between align-items-center">
                                                        <div class="author-part">
                                                            <ul class="author-list d-flex">
                                                                <li class="single-author d-flex align-items-center">
                                                                    <a href="#" class="veryfied"><img loading="lazy"
                                                                        src="1.png" alt="author-img" /></a>
                                                                    <h5><a href="#">MetaHorse NFT {items.Tokenid}</a></h5>
                                                                </li>
                                                            </ul>
                                                            <img src={items.Url}></img>
                                                        </div>

                                                    </div>


                                                </div>
                                            </div>
                                        </div>






                                    </>)
                            })
                        }


                    </div>
                </div>

            </div>
            <Footer />


        </div>
    )
}
