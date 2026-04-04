import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebarsZh: SidebarsConfig = {
  tutorialSidebarZh: [
    {
      type: 'category',
      label: '开始阅读',
      collapsible: true,
      collapsed: false,
      items: ['intro', 'Home'],
    },
    {
      type: 'category',
      label: '导航',
      collapsible: true,
      collapsed: true,
      items: ['Navigation'],
    },
  ],
};

export default sidebarsZh;
