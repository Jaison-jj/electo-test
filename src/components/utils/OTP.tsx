import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

type OTPProps = {
  onChange?: (newValue: string) => unknown;
  onComplete?: (...args: any[]) => unknown;
  value: string;
  name?: string;
};

function OTP(props: OTPProps) {
  const { onChange, value, onComplete, name } = props;
  return (
    <InputOTP
      onChange={onChange}
      value={value}
      onComplete={onComplete}
      maxLength={6}
      name={name}
      render={({ slots }) => (
        <>
          <InputOTPGroup>
            {slots.slice(0, 6).map((slot, index) => (
              <InputOTPSlot
                key={index}
                {...slot}
                className='mx-1.5 border border-gray-300 rounded-md'
              />
            ))}{' '}
          </InputOTPGroup>
        </>
      )}
    />
  );
}

export default OTP;
