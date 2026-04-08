import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  osynapticTxSidebar: [
    {
      type: 'category',
      label: 'OSynaptic-TX',
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
        '03-api-tiers',
        '04-wire-format',
        '05-configuration',
        '06-unit-validation',
      ],
    },
    {
      type: 'category',
      label: 'Platform Guides',
      collapsible: true,
      collapsed: true,
      items: [
        '07-mcu-deployment',
        '08-transport-selection',
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
