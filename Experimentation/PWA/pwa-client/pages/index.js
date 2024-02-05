import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';


const Home = () => {
  const router = useRouter();
  const { pubk, sub } = router.query;
  const subObject = sub ? JSON.parse(decodeURIComponent(sub)) : null;
  console.log(pubk)
  console.log(subObject)


  const sendTransaction = async () => {
    // 버튼을 클릭할 때 메시지를 보내는 로직을 추가
    const subscription = subObject

    const transaction = {
      from: "0x84207aCCB87EC578Bef5f836aeC875979C1ABA85",
      to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      value: ethers.utils.parseEther("0"),
      data: "0x68656c6c6f"
    };

    const dataArray = [subscription, transaction];


    await fetch('http://localhost:3000/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        dataArray
      )
    
    })
  };

  const pwaWalletLogin = async () => {
    router.push('http://localhost:3000/');
  };

  return (
    <div className={styles.container}>
      <img 
        src="/images/ontherinc.png" 
        alt="Company Logo" 
        className={styles.logo}
      />
      <h1 className={styles.title}>Oauth PWA Wallet</h1>
      <button 
        onClick={pwaWalletLogin} 
        className={`${styles.button} ${styles.loginButton}`}
      >
        PWA Wallet Login
      </button>
      <button 
        onClick={sendTransaction} 
        className={`${styles.button} ${styles.transactionButton}`}
      >
        Send Transaction
      </button>
      {pubk && (
        <div className={styles.dataDisplay}>
          <h2>Login Complete</h2>
          <p>public key : {pubk}</p>
        </div>
      )}
    </div>
  );
};

export default Home;