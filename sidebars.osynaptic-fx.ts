import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebarsOSynapticFx: SidebarsConfig = {
  osynapticFxSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Overview & Architecture',
      collapsible: true,
      collapsed: false,
      items: [
        'overview',
        'architecture',
        'api-index',
      ],
    },
    {
      type: 'category',
      label: 'Plugin & CLI',
      collapsible: true,
      collapsed: false,
      items: [
        'plugin-scope-and-commands',
        'port-forwarder',
        'cli',
      ],
    },
    {
      type: 'category',
      label: 'Quality & Release',
      collapsible: true,
      collapsed: true,
      items: [
        'quality-gate-and-compiler-matrix',
        'release-notes',
        'mirror-coverage-report',
        'acceptance-checklist',
      ],
    },
    {
      type: 'category',
      label: 'Configuration & Performance',
      collapsible: true,
      collapsed: true,
      items: [
        'benchmark-method',
        'config-quick-reference',
        'performance-summary',
        'troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Release & Examples',
      collapsible: true,
      collapsed: true,
      items: [
        'release-playbook',
        'examples-cookbook',
        'glue-step-by-step',
      ],
    },
    {
      type: 'category',
      label: 'Data & Standards',
      collapsible: true,
      collapsed: true,
      items: [
        'data-format-specification',
        'standardized-units',
        'input-specification',
        'arduino-easy-api',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsible: true,
      collapsed: true,
      items: [
        'CHANGELOG',
        'README',
        'SUMMARY',
      ],
    },
  ],
};

export default sidebarsOSynapticFx;

