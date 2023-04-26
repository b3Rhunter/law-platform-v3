import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ABI from './ABI.json';

function App() {

  const [connected, setConnected] = useState(false);
  const [contract, setContract] = useState();
  const [rewardPoolAmount, setRewardPoolAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [pointsToDistribute, setPointsToDistribute] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  const [userAddress, setUserAddress] = useState('0x0000');
  const [pointBalance, setPointBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    if (connected && contract) {
      fetchBalances();
    }
  }, [connected, contract]);

  const fetchBalances = async () => {
    try {
      const user = await contract.users(userAddress);
      const tokenBal = await contract.balanceOf(userAddress);
  
      setPointBalance(user.points.toString());
      setTokenBalance(ethers.utils.formatUnits(tokenBal, 0));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };  

  const connect = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const address = "0x6adcC06F46586F645929A18A13e9C5Dead03cC10"
      const getContract = new ethers.Contract(address, ABI, signer);
      setContract(getContract)
      const userAddr = await signer.getAddress();
      setUserAddress(userAddr);
      await signer.signMessage("Welcome Law-yers!");
      setConnected(true)
    } catch (error) {
      setConnected(false)
      console.log(error.message)
    }
  }

  const joinPlatform = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinPlatform();
      await tx.wait();
      console.log("Successfully joined the platform!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createRewardPool = async () => {
    if (!contract) return;
    try {
      const amount = ethers.utils.parseUnits(rewardPoolAmount, 18);
      const tx = await contract.createRewardPool(amount);
      await tx.wait();
      console.log("Successfully created a reward pool!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const distributePoints = async () => {
    if (!contract) return;
    try {
      const tx = await contract.distributePoints(recipientAddress, pointsToDistribute);
      await tx.wait();
      console.log("Successfully distributed points!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const redeemPoints = async () => {
    if (!contract) return;
    try {
      const tx = await contract.redeemPoints(pointsToRedeem);
      await tx.wait();
      console.log("Successfully redeemed points!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className='connect' onClick={connect}>
          {!connected && <p>connect</p>}
          {connected && <p>connected</p>}
        </button>
        
          <div className='user'>
            <h2>User Address: {userAddress.substr(0, 6) + "..."}</h2>
            <h2>Point Balance: {pointBalance}</h2>
            <h2>Token Balance: {tokenBalance}</h2>
          </div>
   
        <div>
          <h1>Law Token Allocation</h1>
          <button className='join' onClick={joinPlatform}>Join Platform</button>
          <div className='mainCont'>
          <div className='cont'>
          <input
            type="text"
            value={rewardPoolAmount}
            onChange={(e) => setRewardPoolAmount(e.target.value)}
            placeholder="Set Starting Points"
          />
          <br />
          <button onClick={createRewardPool}>Start Round</button>
          </div>
          <div className='cont'>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Recipient Address"
          />
          <br />
          <input
            type="text"
            value={pointsToDistribute}
            onChange={(e) => setPointsToDistribute(e.target.value)}
            placeholder="Points to Distribute"
          />
          <br />
          <button onClick={distributePoints}>Distribute</button>
          </div>
          <div className='cont'>
          <input
            type="text"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(e.target.value)}
            placeholder="Points to Redeem"
          />
          <br />
          <button onClick={redeemPoints}>Redeem</button>
          </div>
        </div>
        </div>
      </header>
    </div>
  );
}

export default App;
