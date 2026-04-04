import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Start Here',
      collapsible: true,
      collapsed: false,
      items: ['intro', 'Home', 'Navigation', 'INDEX', 'QUICK_START'],
    },
    {
      type: 'category',
      label: 'Core Docs',
      collapsible: true,
      collapsed: true,
      items: [
        'ARCHITECTURE',
        'API',
        'CORE_API',
        'CONFIG_SCHEMA',
        'ID_LEASE_SYSTEM',
        'ID_LEASE_CONFIG_REFERENCE',
        'PYCORE_RUST_API',
        'RSCORE_API',
        'TRANSPORTER_PLUGIN',
      ],
    },
    {
      type: 'category',
      label: 'Other Docs',
      collapsible: true,
      collapsed: true,
      items: [
        'COMPLETION_REPORT',
        'DOCUMENT_ORGANIZATION',
        'DOCUMENTATION_ORGANIZATION_FINAL',
        'ROOT_CLEANUP_COMPLETE',
        'MULTI_LANGUAGE_GUIDE',
        'I18N',
      ],
    },
  ],
};

export default sidebars;
