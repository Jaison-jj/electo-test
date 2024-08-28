'use client';

import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { faqs } from '@/lib/constants';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { userAtom } from '@/store/user.atom';

const FAQs = () => {
  const [, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'FAQs' }));
  }, [setUserState]);

  return (
    <div className='w-full p-2 md:p-4'>
      <p className='text-xs md:text-sm'>
        Welcome to the Electo App FAQ page! Here, you will find answers to
        common questions about using our app, understanding the Electo Score,
        and participating in legislative advocacy. If you have any other
        questions, please feel free to contact our support team.
      </p>
      <Accordion
        type='single'
        collapsible
        className='w-full text-xs md:text-sm'
      >
        {faqs.map((f, i) => (
          <AccordionItem value={f.question} key={i} className=''>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent className='text-xs'>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;
