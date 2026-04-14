import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import ToastContainerBar from '@/components/ToastContainer';
import Footer from '@/components/Footer';
import initializeChartJS from '@/utils/initialize_chartJs';

function App({ Component, pageProps }: AppProps) {
  initializeChartJS();

  return (
    <>
      <Component {...pageProps} />
      <Footer />
      <ToastContainerBar />
    </>
  );
}

export default App;
