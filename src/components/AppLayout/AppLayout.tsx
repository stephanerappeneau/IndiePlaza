import React from 'react';
import { AppBar } from './AppBar';
import Head from 'next/head';

export default function AppLayout({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description?: string;
  path?: any;
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>
      <AppBar />
      <div className="mx-auto">{children}</div>
    </React.Fragment>
  );
}
