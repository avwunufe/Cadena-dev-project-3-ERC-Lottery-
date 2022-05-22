import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./contracts/Lottery.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [inputValue, setInputValue] = React.useState( "" );
  const [feeValue, setFeeValue] = React.useState( "" );
  const [isLotteryOwner, setIsLotteryOwner] = React.useState(false);
  const [userBalance, setUserBalance] = React.useState(null);
  const contractAddress = '0x7D0D5676E4Ca443F5BaA1be7723bc5AF885b7759';
  const contractABI = abi.abi;

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  const handleFeeChange = (event) => {
    setFeeValue(event.target.value);
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getLotteryOwnerHandler = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object not found, install Metamask.");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await lotteryContract.getOwner();

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsLotteryOwner(true);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const enterLotteryHandler = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object not found, install Metamask.");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await lotteryContract.enterLottery({ value: ethers.utils.parseUnits(inputValue, 18) });
        console.log("Deposting money...");
        await txn.wait();
        console.log("You are now in the lottery! Goodluck!", txn.hash);
      }
    } catch (error) {
      console.log(error)
    }
  }
  const userBalanceHandler = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object not found, install Metamask.");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

        let balance = await lotteryContract.getBalance();
        setUserBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeFeeHandler = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object not found, install Metamask.");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await lotteryContract.setEntryFee(ethers.utils.parseUnits(feeValue, 18));
        console.log("Setting fee...");
        await txn.wait();
        console.log("Fee set successfully!", txn.hash);
      }
    } catch (error) {
      console.log(error)
    }
  }



  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected();
    getLotteryOwnerHandler();
    userBalanceHandler();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there! Ready to play for high stakes?
        </div>

        <div className="bio">
        Welcome to the lottery! Click below to enter and stand a chance to win 100 lottery tokens! Each entry costs 0.02 ETH. Make your deposit, refresh your balance to see if you've won! 
        (Rinkeby testnet).
        <p> You can play once every 30 seconds (Patience is a virtue :) )</p>
        </div>

      </div>
      <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="deposit"
              placeholder="0.0000 ETH"
              value={inputValue.deposit}
            />
            <button
              className="waveButton"
              onClick={enterLotteryHandler}>Deposit Money In ETH</button>
            
          </form>
          {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div className="mt-5">
          <p><span className="font-bold">User Balance: </span>{userBalance}</p>
        </div>
        {
        isLotteryOwner && (
          <section className="bank-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Owner only</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleFeeChange}
                  name="bankName"
                  placeholder="0.00ETH"
                  value={feeValue}
                />
                <button
                  className="btn-grey"
                  onClick={changeFeeHandler}>
                  Set Lottery Fee
                </button>
              </form>
            </div>
          </section>
        )
      }
        </div>
    </div>
  );
}
