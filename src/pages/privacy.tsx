import React from 'react';
import Head from 'next/head';
import UrlPaths from '@/data/urlPathsConstants';
import AppLayout from '@/components/AppLayout/AppLayout';

/**
 * Privacy Page
 * @constructor
 */
const PrivacyPage: React.FC = () => {
  return (
    <AppLayout
      title="Indie plaza Where Ideas Meet Opportunity"
      description="Indie Plaza Project is a one-stop shop to support european indies in their financing quest. Access our database of hundreds of financing solutions and experts in video games studio creation and funding. The Indie Plaza project has been granted funding by the Creative Europe Business Innovation Program"
      path={[
        {
          label: 'Privacy and policy',
          href: UrlPaths.PRIVACY,
          last: false,
        },
      ]}
    >
      <Head>
        <title>Privacy and policy</title>
      </Head>
      <div className="container mx-auto mt-16 p-6 text-sm lg:text-lg font-thin sm:shadow-xl">
        <div className="mb-4">
          At Indie-Plaza, we highly value your privacy and are committed to
          ensuring that your personal information is protected. We have
          implemented a comprehensive Privacy Policy that governs how we
          collect, use, and safeguard your data.
        </div>
        <div className="my-4">
          When you visit our website, we may utilize cookies to enhance your
          browsing experience and provide personalized features. Cookies are
          small text files that are stored on your device and allow us to
          recognize you as a unique user. They enable us to remember your
          preferences, such as your language and currency settings, and help us
          tailor our services to better suit your needs.
        </div>
        <div className="my-4">
          These cookies also assist us in analyzing website traffic and
          gathering valuable insights to improve our platform. We use this
          information to enhance the performance, functionality, and security of
          our website. Rest assured, the data collected through cookies is
          anonymized and does not personally identify you.
        </div>
        <div className="my-4">
          By using Indie-Plaza, you consent to the placement of cookies on your
          device. However, you have the option to manage and control cookies
          through your browser settings. You can choose to accept or reject
          cookies, delete existing ones, or receive notifications when cookies
          are being sent.
        </div>
        <div className="my-4">
          It&apos;s important to note that disabling or rejecting cookies may
          limit certain features and functionalities of our website. We
          encourage you to review our full Privacy Policy to understand how we
          handle your personal information and the measures we take to protect
          your privacy.
        </div>
      </div>
    </AppLayout>
  );
};

export default PrivacyPage;
