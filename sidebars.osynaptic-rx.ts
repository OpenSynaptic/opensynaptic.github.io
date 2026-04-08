import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  osynapticRxSidebar: [
    {
      type: 'category',
      label: 'OSynaptic-RX',
      collapsible: false,
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        '01-quick-start',
        '02-installation',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsible: true,
      collapsed: false,
      items: [
        '03-decode-paths',
        '04-wire-format',
        '05-configuration',
      ],
    },
    {
      type: 'category',
      label: 'Platform Guides',
      collapsible: true,
      collapsed: true,
      items: [
        '06-mcu-deployment',
        '07-transport-selection',
        '08-flash-optimization',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsible: true,
      collapsed: true,
      items: ['09-api-reference'],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsible: true,
      collapsed: true,
      items: ['10-examples'],
    },
  ],
};

export default sidebars;
