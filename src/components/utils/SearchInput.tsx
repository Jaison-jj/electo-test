'use client';

import { CircleUserRound, ScrollText, Search } from 'lucide-react';
import { useRouter as useNpRouter } from 'next-nprogress-bar';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';

import { searchEntity } from '@/apis/user';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const debouncedPromiseOptions = debounce(
  (inputValue: string, callback: (options: SelectOption[]) => void) => {
    searchEntity({ keyword: inputValue })
      .then((res) => {
        const federalBills = res.federalBills.map((bill: any) => ({
          value: bill.billId,
          label: bill.billTitle,
          bill_type: 'federal',
          entity: 'bills',
          icon: <ScrollText className='w-5 h-5 text-gray-400' />,
        }));
        const stateBills = res.stateBills.map((bill: any) => ({
          value: bill?.billId,
          label: bill?.billTitle,
          bill_type: 'state',
          entity: 'bills',
          icon: <ScrollText className='w-5 h-5 text-gray-400' />,
        }));

        const reps = res.representatives.map((rep: any) => ({
          value: rep?.id,
          label: rep?.firstName + ' ' + rep.lastName,
          entity: 'representatives',
          icon: <CircleUserRound className='w-5 h-5 text-gray-400' />,
        }));

        const result = [...federalBills, ...stateBills, ...reps];
        callback(result);
      })
      .catch((_error) => {
        toast.error('Unable to fetch search results!');
        callback([]);
      });
  },
  300, // Debounce delay
);

const promiseOptions = (inputValue: string) =>
  new Promise<SelectOption[]>((resolve) => {
    debouncedPromiseOptions(inputValue, resolve);
  });

const CustomOption = ({ innerRef, innerProps, data }: any) => (
  <div
    ref={innerRef}
    {...innerProps}
    className='flex items-center p-2 cursor-pointer hover:bg-gray-200'
  >
    <div className='mr-2'>{data.icon}</div>
    <div>{data.label}</div>
  </div>
);

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const SearchInput = (props: SearchInputProps) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { placeholder } = props;

  const router = useNpRouter();

  const onSelectOption = (option: any) => {
    if (option === null) return;
    if (option?.entity === 'bills') {
      return router.push(
        `/bills/${option.value}?bill_type=${option.bill_type}`,
      );
    }
    return router.push(`/account?name=${option?.label}&id=${option?.value}`);
  };

  const onkeydown = (event: any) => {
    if (event.key === 'Enter') event.preventDefault();
  };

  return (
    <div className='relative w-full'>
      <AsyncSelect
        onChange={onSelectOption}
        isClearable
        instanceId='suppressHydrationError'
        onKeyDown={onkeydown}
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        className='search-bar'
        placeholder={placeholder}
        components={{ Option: CustomOption }}
        styles={{
          menu: menuStyles,
          menuList: menuStyles,
          control: containerStyles,
          dropdownIndicator: dropdownIndicatorStyles,
          indicatorSeparator: dropdownIndicatorStyles,
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#e5e7eb',
            primary50: '#e5e7eb',
          },
        })}
      />
      <Search className='w-5 h-5 absolute top-2 right-2 bg-[#f7f7f7] text-[##65677c]' />
    </div>
  );
};
SearchInput.displayName = 'SearchInput';

export default SearchInput;

const dropdownIndicatorStyles = (base: any) => {
  const changes = {
    display: 'none',
  };
  return Object.assign(base, changes);
};

const containerStyles = (base: any) => {
  const changes = {
    color: 'red',
    boxShadow: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    backgroundColor: '#f7f7f8',
  };
  return Object.assign(base, changes);
};

const menuStyles = (base: any) => {
  const changes = {
    borderRadius: '20px',
  };
  return Object.assign(base, changes);
};
