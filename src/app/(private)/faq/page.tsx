'use client';
import React from 'react';

import { firebaseAnalytics } from '@/lib/helper';

import FAQs from '@/components/faq/FAQs';

const FAQsPage = () => {
  React.useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);
  return (
    <>
      <title>FAQs</title>
      <FAQs />;
    </>
  );
};

export default FAQsPage;
