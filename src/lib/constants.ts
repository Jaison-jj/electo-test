import {
  BarChart2,
  Gift,
  Home,
  MessagesSquare,
  NotepadText,
  PenTool,
  Presentation,
  Settings,
  SquareUserRound,
} from 'lucide-react';

export const interests = [
  'Healthcare',
  'Education',
  'Military',
  'Trade',
  'Privacy',
  'Energy',
  'Labor',
  'Economics',
  'Infrastructure',
  'Campaign Finance Reform',
  'Criminal Justice Reform',
  'Environmental Policy',
  'Technology',
  'Fiscal Policy',
  'Transportation',
  'Monetary Policy',
  'Foreign Policy',
  'Cyber Security',
  'Aerospace',
  'Gun Reform',
  'Immigration',
  'Election Integrity',
  'Race Relations',
  'Social Welfare',
  'Housing',
  'National Security',
  'Health and Safety',
  'Science and Innovation',
  'Consumer Protection',
];

export const SIDE_NAV_ITEMS: any[] = [
  {
    title: 'Home',
    path: '/bills',
    icon: Home,
  },
  {
    title: 'Directory',
    path: '/directory',
    icon: SquareUserRound,
    submenu: true,
    children: [
      {
        title: 'My Officials',
        path: '/my-officials',
        submenu: true,
        children: [
          {
            title: 'Federal',
            path: '/my-officials-federal',
            submenu: true,
            children: [
              {
                title: 'House of Representatives',
                path: '/directory/my-officials?locale=federal&type=house',
                textColor: '#63667B',
              },
              {
                title: 'Senate',
                path: '/directory/my-officials?locale=federal&type=senate',
                textColor: '#63667B',
              },
            ],
          },
          {
            title: 'State',
            path: '/my-officials-state',
            submenu: true,
            children: [
              {
                title: 'House of Representatives',
                path: '/directory/my-officials?locale=state&type=house',
                textColor: '#63667B',
              },
              {
                title: 'Senate',
                path: '/directory/my-officials?locale=state&type=senate',
                textColor: '#63667B',
              },
            ],
          },
        ],
      },
      {
        title: 'Officials',
        path: '/officials',
        submenu: true,
        children: [
          {
            title: 'Federal',
            path: '/officials-federal',
            submenu: true,
            children: [
              {
                title: 'House of Representatives',
                path: '/directory/officials?locale=federal&type=house',
                textColor: '#63667B',
              },
              {
                title: 'Senate',
                path: '/directory/officials?locale=federal&type=senate',
                textColor: '#63667B',
              },
            ],
          },
          {
            title: 'State',
            path: '/officials-state',
            submenu: true,
            children: [
              {
                title: 'House of Representatives',
                path: '/directory/officials?locale=state&type=house',
                textColor: '#63667B',
              },
              {
                title: 'Senate',
                path: '/directory/officials?locale=state&type=senete',
                textColor: '#63667B',
              },
            ],
          },
        ],
      },
      { title: 'Candidates', path: '/directory/candidates' },
    ],
  },
  {
    title: 'Leader board',
    path: '/leader-board',
    icon: BarChart2,
  },
  {
    title: 'Take Action',
    path: '/take-action',
    icon: PenTool,
  },
  {
    title: 'Election Center',
    path: '/election-center',
    icon: NotepadText,
  },
  {
    title: 'Trends',
    path: '/trends',
    icon: Presentation,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
  },
  {
    title: 'FAQs',
    path: '/faq',
    icon: MessagesSquare,
  },
  {
    title: 'Support us',
    path: '/payment',
    icon: Gift,
  },
];

export const faqs = [
  {
    question: 'What is Electo?',
    answer:
      'Electo is a civic engagement app designed to help users stay informed about legislative bills, vote on them, and see how their representatives align with their preferences. Our goal is to empower citizens and enhance transparency in the legislative process.',
  },
  {
    question: 'How does Electo work?',
    answer:
      "Users can view legislative bills, vote on them, and track their representatives' votes. The app calculates an Electo Score for each representative based on how often their votes align with the majority of their constituents' votes.",
  },
  {
    question: 'How do I vote on a bill?',
    answer:
      'To vote on a bill, navigate to the bill\'s page in the app, read the summary and details, and select either "Yay" or "Nay." Your vote will be counted towards the majority opinion for that bill.',
  },
  {
    question: "Can I change my vote once it's submitted?",
    answer:
      'Yes, you can change your vote on a bill at any time after submitting it. Please ensure you review the bill information carefully before voting.',
  },
  {
    question: 'How do I sign a petition?',
    answer:
      'After voting on a bill, you will have the option to sign a petition related to that bill. Simply follow the prompts on the screen to add your electronic signature.',
  },
  {
    question: 'What is the Electo Score?',
    answer:
      "The Electo Score reflects how often a representative's votes align with the majority of their constituents' votes. It measures the representative's responsiveness to their constituents' preferences.",
  },
  {
    question: 'How is the Electo Score calculated?',
    answer:
      "The Electo Score becomes active after at least 10 bills have been voted on by users and the representative. It is the percentage of times the representative's vote aligns with the majority of constituent votes, multiplied by 100, and rounded to the nearest whole digit if applicable.",
  },
  {
    question: "Why is my representative's Electo Score not visible?",
    answer:
      'The Electo Score is hidden until the representative has voted on at least 10 bills that have also been voted on by constituents. This ensures the score is based on sufficient data.',
  },
  {
    question: 'How do I provide consent for electronic signatures?',
    answer:
      'When you select "sign petition," you will be prompted to provide consent for us to use your electronic signature. Read the consent statement and select "I Agree" to grant permission.',
  },
  {
    question: 'Can I revoke my consent for electronic signatures?',
    answer:
      'Yes, you can revoke your consent at any time by contacting our support team and providing written notice.',
  },
  {
    question: 'How is my personal information handled?',
    answer:
      'Your personal information and electronic signature are handled securely and used solely for the purposes stated in the consent agreement. We prioritize your privacy and data security.',
  },
  {
    question: 'How can I contact Electo support?',
    answer:
      'If you have any questions or need assistance, please contact our support team at info@electoai.com.',
  },
];
