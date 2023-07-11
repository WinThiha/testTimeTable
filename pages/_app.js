import Layout from '@/components/Layout'
import '@/styles/globals.css'
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function App({ Component, pageProps }) {
  useEffect(()=>{
    import("bootstrap/dist/js/bootstrap");
},[])
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
