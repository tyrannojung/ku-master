import { ethers } from 'ethers'; // ethers 라이브러리를 임포트합니다.
import Head from 'next/head';
import styles from '../styles/styles.module.css'; // CSS 모듈을 임포트합니다.
import { useRouter } from 'next/router';


const Detail = () => {

const router = useRouter();
const { tran } = router.query;

 const transaction = tran ? JSON.parse(tran) : null;

  const handleSendTransaction = async () => {
    const providerUrl = 'https://goerli.infura.io/v3/4c79c22d05294f9f81fbe2501462ac22';
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction(transaction);
    const receipt = await tx.wait();
    alert("성공")
    console.log('Transaction receipt:', receipt);

  };

  const handleClose = () => {
    window.close()
  };


  return (
    <>
      <Head>
        <title>Transaction Detail</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Transaction Data</h2>
          <pre>{JSON.stringify(transaction, null, 2)}</pre>

          {/* Send Transaction 버튼 */}
          <button 
            onClick={handleSendTransaction} 
            className={`${styles.button} ${styles.sendTransactionButton}`}
          >
            Send Transaction
          </button>

          {/* Close 버튼 */}
          <button 
            onClick={handleClose} 
            className={`${styles.button} ${styles.closeButton}`}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default Detail
