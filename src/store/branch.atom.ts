import { atom } from 'recoil';

type TDefaultValues = {
  page: string;
  entity?: string | null;
  entityId?: string | null;
  campaign: string;
  alias: string;
  feature: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  desktopUrl: string;
  deepLinkPath: string;
  iosUrl: string;
  androidUrl: string;
};

const defaultValues: TDefaultValues = {
  page: 'BillVote',
  entity: null,
  entityId: null,
  campaign: 'bill_awareness',
  alias: 'electo-bill',
  feature: 'billSummary',
  title: '',
  description: '',
  imageUrl: '',
  desktopUrl: 'https://server.electoai.com/',
  deepLinkPath: '',
  iosUrl: '',
  androidUrl: '',
};

export const branchAtom = atom({
  key: 'branchState',
  default: defaultValues,
});
