import { Skeleton } from '@/components/ui/skeleton';

const BillCardSkeleton = () => {
  return (
    <div className='flex items-start space-x-4 p-2 md:p-4 '>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2 w-full'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
};

export default BillCardSkeleton;
