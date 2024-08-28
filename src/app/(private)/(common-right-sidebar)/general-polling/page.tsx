'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'sonner';

import { firebaseAnalytics } from '@/lib/helper';

import Polls from '@/components/general-polling/polls';
import { Button } from '@/components/ui/button';

import { branchAtom } from '@/store/branch.atom';
import { userAtom } from '@/store/user.atom';

import MapIcon from '@/../public/svg/map.svg';
import { addAnswer, nextQuestion, pollAnalysis } from '@/apis/generalPolling';

const GeneralPolling = ({ searchParams }: any) => {
  const { pollId = null } = searchParams;
  const router = useRouter();

  const [, setUserState] = useRecoilState(userAtom);
  const [, setBranchState] = useRecoilState(branchAtom);

  const [poll, setPoll] = useState<any>({
    forceNext: null,
    question: {},
    choices: [],
    section: '',
    buttonText: 'Submit',
    selectedAnswer: '',
    hasSubmitted: false,
    pollId: '',
  });

  useQuery({
    queryKey: ['poll-analysis'],
    queryFn: () =>
      pollAnalysis({ questionId: pollId })
        .then((res: any) => {
          setPoll((prev: any) => ({
            ...prev,
            selectedAnswer: res.answer.answer,
            question: res.question,
            section: res.question.section,
            buttonText: 'Next',
            choices: res.choicePercentages,
            // choices: res.question.choices.map((choice: string) => ({
            //   choice: choice,
            //   percentage: null,
            // })),
          }));
        })
        .catch((_err) => {
          toast.error('sorry!');
        }),
    enabled: !!pollId,
  });

  const {
    mutate: getNextQuestion,
    isPending: questionIsPending,
    data: nextQuestionData,
  } = useMutation({
    mutationFn: async (data: any) => nextQuestion(data),
    onSuccess: (res: any) => {
      setPoll((prev: any) => ({
        ...prev,
        question: res.question,
        section: res.question.section,
        buttonText: 'Submit',
        choices: res.question.choices.map((choice: string) => ({
          choice: choice,
          percentage: null,
        })),
      }));
      router.replace('/general-polling');
    },
    onError(err: any) {
      toast(err.response.data.message);
    },
  });

  const { mutate: submitAnswer, isPending: addAnswerIsPending } = useMutation({
    mutationFn: async (data: any) => addAnswer(data),
    onSuccess: (res: any) => {
      setPoll((prev: any) => ({
        ...prev,
        buttonText: 'Next',
        choices: res.choicePercentages,
        hasSubmitted: true,
        pollId: res.question.id,
      }));
    },
    onError(err: any) {
      toast(err.response.data.message);
      getNextQuestion({ forceNext: true });
    },
  });

  const onSelectAnswer = (ans: string) => {
    if (poll.buttonText === 'Next') return;

    setPoll((prev: any) => ({
      ...prev,
      selectedAnswer: ans,
    }));
  };

  const onSubmitAnswer = () => {
    if (poll.buttonText === 'Next') {
      getNextQuestion({ forceNext: true });
      return;
    }

    submitAnswer({
      questionId: poll?.question?.id,
      answer: poll.selectedAnswer,
    });
  };

  useEffect(() => {
    setUserState((prev: any) => ({
      ...prev,
      currentPageName: 'General Polling',
    }));
    if (pollId) return;
    getNextQuestion({ forceNext: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setBranchState({
      page: 'GeneralPolling',
      entity: null,
      entityId: nextQuestionData?.question?.id || null,
      alias: '',
      androidUrl: '',
      iosUrl: '',
      campaign: 'bill_awareness',
      deepLinkPath: '/general-polling',
      desktopUrl: `${process.env.DESKTOP_URL}/general-polling`,
      description: poll.section,
      feature: 'general-polling',
    });
  }, [nextQuestionData?.question?.id, poll.section, setBranchState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  return (
    <div>
      <title>General Polling</title>
      <h3 className='mt-11 md:mt-0 font-semibold py-2 border-b border-gray-200 pl-4'>
        {poll.section}
      </h3>

      <p className='text-sm pl-4 pt-4'>{poll?.question?.question}</p>

      <div className='p-4'>
        <Polls
          polls={poll.choices}
          onSelectAnswer={onSelectAnswer}
          selectedAnswer={poll.selectedAnswer}
        />
      </div>

      <div className='pl-4 flex items-center gap-4'>
        <Button
          className='lg:w-[120px] rounded-full'
          type='button'
          onClick={onSubmitAnswer}
          disabled={
            addAnswerIsPending || questionIsPending || !poll.selectedAnswer
          }
          text={poll.buttonText}
          loading={addAnswerIsPending || questionIsPending}
        />
        {poll.buttonText === 'Next' && (
          <Link href={`/general-polling/map?pollId=${poll.pollId}`}>
            <Button
              variant='outline'
              className='rounded-full'
              text={
                <div className='flex justify-center items-center gap-2'>
                  <MapIcon className='h-6 w-6' />
                  <span>View Map</span>
                </div>
              }
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default GeneralPolling;
