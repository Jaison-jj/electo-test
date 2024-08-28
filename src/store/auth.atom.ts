import { atom } from 'recoil';

type TDefaultValues = {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  dob?: null | Date;
  gender?: string;
  phone?: string | any;
  email?: string;
  password?: string;
  confirmPassword?: string;
  zipCode?: string;
  isRegisteredVoter?: boolean;
  isPrivacyPolicyRead?: undefined | boolean;
  image?: File | null;
  maritalStatus?: string;
  children?: number;
  employmentStatus?: string;
  levelOfEducation?: string;
  jobIndustry?: string;
  race?: string;
  veteran?: string;
  politicalViews?: string;
  interests?: string[] | any;
  isNewUser?: boolean;
  verification?: 'not-verified' | 'verified' | '' | string;
  isSocialAuth?: boolean;
  socialSignOnMode?: string;
  socialSignOnLoading?: boolean;

  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  streetNumber: string;
  streetName: string;
  latitude: string;
  longitude: string;
};

const defaultValues: TDefaultValues = {
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  dob: null as any,
  gender: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  zipCode: '',
  isRegisteredVoter: false,
  isPrivacyPolicyRead: false,
  image: null,
  maritalStatus: '',
  children: 0,
  employmentStatus: '',
  levelOfEducation: '',
  jobIndustry: '',
  race: '',
  veteran: '',
  politicalViews: '',
  interests: [],
  isNewUser: false,
  verification: '',
  isSocialAuth: false,
  socialSignOnMode: '',
  socialSignOnLoading: false,

  streetAddress: '',
  apartment: '',
  city: '',
  state: '',
  streetNumber: '',
  streetName: '',
  latitude: '',
  longitude: '',
};

export const localStorageEffect =
  (key: string) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  ({ setSelf, onSet }: { setSelf: Function; onSet: Function }) => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue: unknown, _: unknown, isReset: unknown) => {
        // eslint-disable-next-line no-unused-expressions
        isReset
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const authState = atom({
  key: 'authState',
  default: defaultValues,
  effects: [localStorageEffect('authDetails')],
});
