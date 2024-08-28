'use client';

import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import { userAtom } from '@/store/user.atom';

const AboutPage = () => {
  const [, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'About' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div className='p-2 md:p-4 flex flex-col gap-4 text-xs md:text-sm'>
      <title>About</title>
      <p>
        Electo was born out of a desire to make democracy more accessible,
        transparent, and responsive to the needs and voices of the people. We
        believe that an informed and engaged citizenry is the cornerstone of a
        thriving democracy, and we've made it our mission to empower individuals
        with the tools they need to actively participate in the legislative
        process.
      </p>
      <p>
        Our team, comprised of passionate innovators in the fields of
        technology, politics, and civic engagement, has worked tirelessly to
        create a platform that simplifies complex legislative information. We
        leverage artificial intelligence to translate dense legal texts into
        understandable language, making it easier than ever for users to stay
        informed about the issues that matter most to them.
      </p>
      <p>
        Beyond providing legislative summaries, Electo allows users to share
        their sentiments on active legislation and contribute to a rich database
        of voter sentiment. This feature aims to amplify the voices of citizens
        at all levels of government, from local to state and federal.
      </p>
      <p>
        In our commitment to transparency, we also offer detailed information
        about elected officials, including their biographies, positions on
        issues, funding sources, and campaign promises. Our goal is to enable
        citizens to hold their representatives accountable.
      </p>
      <p>
        Electo is more than a mobile application. It's a movement towards a more
        engaged, informed, and responsive democracy. We invite you to join us on
        this journey. Together, we can make a difference.
      </p>
    </div>
  );
};

export default AboutPage;
