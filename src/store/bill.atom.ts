import { atom } from 'recoil';

type TDefaultValues = {
  billType: string;
  bills: any[];
};

const defaultValues: TDefaultValues = {
  billType: 'federal',
  bills: [],
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

export const billState = atom({
  key: 'billState',
  default: defaultValues,
  effects: [localStorageEffect('billDetails')],
});
