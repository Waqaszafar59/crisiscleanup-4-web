import { version } from '@/../package.json';
import { createApp } from 'vue';
import './style.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTagsInput from '@sipec/vue3-tags-input';
import Datepicker from '@vuepic/vue-datepicker';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Toast from 'vue-toastification';
import type { PluginOptions as VueToastificationPluginOptions } from 'vue-toastification';
import { createI18n } from 'vue-i18n';
import vSelect from 'vue-select';
import App from './App.vue';
import router from './router';
import BaseButton from './components/BaseButton.vue';
import BaseInput from './components/BaseInput.vue';
import BaseText from './components/BaseText.vue';
import Badge from './components/Badge.vue';
import Tag from './components/Tag.vue';
import FormSelect from './components/FormSelect.vue';
import Modal from './components/Modal.vue';
import Authenticated from './layouts/Authenticated.vue';

// Icons

import BaseIcon from './components/BaseIcon.vue';
import { store } from './store';

// Toast
import 'vue-toastification/dist/index.css';
import 'vue-select/dist/vue-select.css';

// Responsive
import { Vue3Mq } from 'vue3-mq';

// Popover
import { Dropdown, VTooltip, Menu } from 'floating-vue';
import 'floating-vue/dist/style.css';

// JSON
import JsonViewer from 'vue-json-viewer';
import BaseSelect from './components/BaseSelect.vue';
import Spinner from './components/Spinner.vue';
import BaseCheckbox from './components/BaseCheckbox.vue';
import FormTree from './components/form/FormTree.vue';
import Tab from './components/tabs/Tab.vue';
import Tabs from './components/tabs/Tabs.vue';
import BaseRadio from './components/BaseRadio.vue';
import Unauthenticated from './layouts/Unauthenticated.vue';
import BaseLink from './components/BaseLink.vue';
import { AuthService } from './services/auth.service';
import TreeMenu from '@/components/TreeMenu.vue';

library.add(fas);
// I18n
const getI18n = (messages = {}) => {
  return createI18n({
    legacy: false,
    formatFallbackMessages: true,
    silentFallbackWarn: false,
    locale: 'en',
    messages,
  });
};

export const i18n = getI18n();

if (AuthService.getUser()) {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common.Authorization = `Bearer ${AuthService.getToken()}`;
}

const app = createApp(App);
app.component('FontAwesomeIcon', FontAwesomeIcon as any);
app.component('CcuIcon', BaseIcon);
app.component('BaseButton', BaseButton);
app.component('BaseInput', BaseInput);
app.component('BaseText', BaseText);
app.component('BaseLink', BaseLink);
app.component('BaseRadio', BaseRadio);
app.component('Badge', Badge);
app.component('Tag', Tag);
app.component('TagInput', VueTagsInput);
app.component('VSelect', vSelect);
app.component('AuthenticatedLayout', Authenticated);
app.component('UnauthenticatedLayout', Unauthenticated);
app.component('FormSelect', FormSelect);
app.component('BaseSelect', BaseSelect);
app.component('BaseCheckbox', BaseCheckbox);
app.component('Modal', Modal);
app.component('VPopover', Dropdown);
app.component('VMenu', Menu);
app.component('Spinner', Spinner);
app.component('FormTree', FormTree);
app.component('TreeMenu', TreeMenu);
app.component('Tabs', Tabs);
app.component('Tab', Tab);
app.component('Datepicker', Datepicker);

app.directive('tooltip', VTooltip);

app.use(store);
// provide axios globally
app.provide('axios', axios);

app.use(Vue3Mq);
app.use(router);
app.use(i18n);
app.use(Toast, {
  timeout: 10_000,
} as VueToastificationPluginOptions);
app.use(JsonViewer);
app.config.devtools = true;

Sentry.init({
  dsn: 'https://33b5cc9258d64b5cb2a8084af5df4051@o317954.ingest.sentry.io/4504774609141760',
  release: `crisiscleanup-4-web@v${version}`,
  environment: import.meta.env.VITE_APP_STAGE,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: [
        'localhost',
        'app.staging.crisiscleanup.io',
        'crisiscleanup.org',
        /^\//,
      ],
    }),
  ],
});

// eslint-disable-next-line unicorn/prefer-top-level-await
router.isReady().then(() => {
  app.mount('#app');
});
