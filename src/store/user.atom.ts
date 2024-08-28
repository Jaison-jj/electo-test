import { atom } from 'recoil';

type TDefaultValues = {
  state: any;
  id?: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  image: string;
  currentPageName: string;
  selectedOfficial?: any;
  consentGiven?: boolean;
  selectedBillVote?: string | null;
  score?: number;
};

const defaultValues: TDefaultValues = {
  id: '',
  email: 'test@gmail.com',
  userName: 'test',
  firstName: '',
  lastName: '',
  image: '',
  currentPageName: '',
  selectedOfficial: {},
  consentGiven: false,
  selectedBillVote: null,
  state: null,
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

export const userAtom = atom({
  key: 'userState',
  default: defaultValues,
  effects: [localStorageEffect('userDetails')],
});
