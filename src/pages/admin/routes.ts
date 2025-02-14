import AdminEventStream from '../../components/admin/AdminEventStream.vue';
import AdminOrganization from './AdminOrganization.vue';
import AdminPage from './Index.vue';
import AdminCms from './AdminCms.vue';
import AdminDashboard from './AdminDashboard.vue';
import AdminTicketDashboard from './AdminTicketDashboard.vue';
// import AdminEvents from '@/pages/admin/AdminEvents.vue';
// import AdminCosts from '@/pages/admin/AdminCosts.vue';
import AdminIncidentWizard from './AdminIncidentWizard.vue';
import AdminLocalizations from '@/pages/admin/AdminLocalizations.vue';

const routes = [
  {
    path: '/admin',
    component: AdminPage,
    name: 'nav.admin',
    meta: {
      layout: 'authenticated',
      admin: true,
    },
    children: [
      {
        path: 'home',
        name: 'nav.admin_dashboard',
        component: AdminDashboard,
        alias: '',
      },
      {
        path: 'organization/:organization_id',
        name: 'nav.admin_organization',
        component: AdminOrganization,
      },
      // {
      //   path: 'events',
      //   name: 'nav.admin_events',
      //   component: AdminEvents,
      // },
      {
        path: 'event_stream',
        name: 'nav.admin_event_stream',
        component: AdminEventStream,
      },
      {
        path: 'Tickets',
        name: 'nav.admin_ticket_dashboard',
        component: AdminTicketDashboard,
      },
      // {
      //   path: 'costs',
      //   name: 'nav.costs',
      //   component: AdminCosts,
      // },
      {
        path: 'cms',
        name: 'nav.cms',
        component: AdminCms,
      },
      {
        path: 'localizations',
        name: 'nav.localizations',
        component: AdminLocalizations,
      },
      {
        path: 'incident_wizard',
        name: 'nav.incident_wizard',
        component: AdminIncidentWizard,
      },
      {
        path: 'incident_wizard/:incident_id',
        name: 'nav.incident_wizard_detail',
        component: AdminIncidentWizard,
      },
    ],
  },
];

export default routes;
