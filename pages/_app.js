import { useState } from "react";
import "../styles/globals.scss";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/layout/layout";
import Head from "next/head";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import LayoutSeller from "../components/layout/layout-seller";
import { useRouter } from "next/router";
///import Moralis from 'moralis'
const queryClient = new QueryClient();

//const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server"
//const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd"
//Moralis.start({ serverUrl, appId });

function MyApp({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState("");

  const router = useRouter();
  const sellerPages = router.pathname.split("/");
  const isSellerPages = sellerPages.length > 0 && sellerPages[1] === "seller" ? true : false;

  return (
    <QueryClientProvider client={queryClient}>
      {isSellerPages ? (
        <LayoutSeller
          currentAccount={currentAccount}
          setCurrentAccount={setCurrentAccount}
        >
          <Head>
            <title>Jobzura</title>
            <meta name="description" content="Create trust with anonymity" />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="512x512"
              href="/favicon.png"
            />
            <meta name="theme-color" content="#ffffff"></meta>
          </Head>

          <MoralisProvider
            // ETH Server
            //const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server"
            //const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd"

            // Matic Server
            serverUrl="https://gbmvbywfzibe.usemoralis.com:2053/server"
            appId="6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR"
          >
            <Component currentAccount={currentAccount} {...pageProps} />
          </MoralisProvider>
        </LayoutSeller>
      ) : (
        <Layout
          currentAccount={currentAccount}
          setCurrentAccount={setCurrentAccount}
        >
          <Head>
            <title>Jobzura</title>
            <meta name="description" content="Create trust with anonymity" />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="512x512"
              href="/favicon.png"
            />
            <meta name="theme-color" content="#ffffff"></meta>
          </Head>

          <MoralisProvider
            // ETH Server
            //const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server"
            //const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd"

            // Matic Server
            serverUrl="https://gbmvbywfzibe.usemoralis.com:2053/server"
            appId="6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR"
          >
            <Component currentAccount={currentAccount} {...pageProps} />
          </MoralisProvider>
        </Layout>
      )}
    </QueryClientProvider>
  );
}

export default MyApp;
