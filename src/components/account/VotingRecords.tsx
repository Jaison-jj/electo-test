'use client';

import { intlFormatDistance } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import BillCard from '@/components/bills/BillCard';
import BillCardSkeleton from '@/components/utils/BillCardSkeleton';

import { getRepresentativeVotingRecords } from '@/apis/bills';

const VotingRecords = (props: any) => {
  const { representativeId } = props;

  const { ref, inView } = useInView();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [records, setRecords] = useState<any[]>([]);

  const getBills = async () => {
    setLoading(true);
    try {
      await getRepresentativeVotingRecords({
        pageNumber: currentPage,
        representativeId,
      }).then(async (response: any) => {
        setRecords((prev: any) => [...prev, ...response.votes]);
        setLoading(false);
      });
    } catch (error) {
      toast.error('Something went wrong with fetching voting records!');
      setLoading(false);
    }
  };

  const newBills =
    records.map((vote: any, index: number) => {
      const isLastItem = index === records.length - 3;
      const _ref = isLastItem ? ref : null;

      const time = intlFormatDistance(
        new Date(vote.bill.createdAt),
        new Date(),
      );

      return (
        <div key={index} ref={_ref}>
          <BillCard
            description={vote.bill.billText}
            type='votingRecords'
            authors={vote.bill?.authors || []}
            time={time}
            agreeVotes={vote.bill.agreeVotes || 0}
            comments={vote.bill.comments || 0}
            shares={vote.bill.shares || 0}
            id={vote.bill.billId}
            voted={vote.voteType === 'agree'}
            billType={null}
          />
        </div>
      );
    }) || [];

  useEffect(() => {
    getBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (inView && records.length > 0) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div>
      {!records.length && !isLoading && (
        <p className='py-4 text-sm text-center text-muted-foreground'>
          No data to display!
        </p>
      )}
      {newBills}
      {isLoading && (
        <>
          <BillCardSkeleton />
          <BillCardSkeleton />
          <BillCardSkeleton />
        </>
      )}
    </div>
  );
};

export default VotingRecords;
