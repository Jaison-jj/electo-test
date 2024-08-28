import React, { useEffect } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';

import 'react-phone-number-input/style.css';

import { cn } from '@/lib/utils';

const PhoneInputWithCountrySelect = React.forwardRef((props: any, ref: any) => {
  const { className, setHasOtherFormErrors, showError = true } = props;

  useEffect(() => {
    setHasOtherFormErrors &&
      props.value &&
      setHasOtherFormErrors(!isPossiblePhoneNumber(props.value));
  }, [props.value, setHasOtherFormErrors]);

  return (
    <div className={cn('PhoneInputWithCountrySelect', className)}>
      <span className='block text-sm text-muted-foreground mb-1'>
        Phone Number<span className='text-red-500'>*</span>
      </span>
      <PhoneInput
        // international={false}
        // countrySelectProps={{ unicodeFlags: false }}
        defaultCountry='US'
        value={props.value}
        onChange={props.onChange}
        ref={ref}
        autoComplete='password'
        {...props}
      />
      {props.value && showError && !isPossiblePhoneNumber(props.value) && (
        <span className='block text-xs text-red-500 text-muted-foreground mt-1'>
          Invalid Phone number format
        </span>
      )}
    </div>
  );
});

export default PhoneInputWithCountrySelect;
