import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";


const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID!; // Ambil dari env
const rpcTarget = "https://ethereum-sepolia.publicnode.com"; // Gunakan Sepolia

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Chain ID Sepolia
  rpcTarget,
  displayName: "Ethereum Sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://ethereum.org/static/6b22807c5254f69f858f65e6a2823e3a/69b62/eth-diamond-purple.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3Auth = new Web3Auth({
  clientId,
  web3AuthNetwork: "testnet",
  privateKeyProvider,
  sessionTime: 0,
});

export const connectWeb3Auth = async () => {
  await web3Auth.initModal();
  const provider = web3Auth.provider;
  if (!provider) throw new Error("Provider tidak tersedia");


  return provider;
};

export const logoutWeb3Auth = async () => {
  if (web3Auth) {
    await web3Auth.logout();
    await web3Auth.clearCache(); // Pastikan cache dihapus
  }
};


