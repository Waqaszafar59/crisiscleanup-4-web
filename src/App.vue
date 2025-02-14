<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import axios from 'axios';
import { useStore } from 'vuex';
import { DialogWrapper } from 'vue3-promise-dialog';
import { cachedGet, hash } from './utils/promise';
import { AuthService } from './services/auth.service';

export default defineComponent({
  name: 'App',
  components: {
    DialogWrapper,
  },
  setup() {
    const route = useRoute();
    const defaultLayout = 'authenticated';
    const layout = computed(
      () => `${route.meta?.layout || defaultLayout}-layout`,
    );
    const { t, locale } = useI18n();
    const store = useStore();

    const eventsInterval = ref<any | null>(null);

    async function pushCurrentEvents(): Promise<void> {
      if (store.getters['auth/isLoggedIn']) {
        await store.dispatch('events/pushEvents');
      }
    }

    async function getEnums(): Promise<void> {
      const enums = await hash({
        statuses: cachedGet(
          `${import.meta.env.VITE_APP_API_BASE_URL}/statuses`,
          {
            headers: {
              Authorization: null,
            },
          },
          `statuses:${locale.value}`,
        ),
        workTypes: axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/work_types`,
          {
            headers: {
              Authorization: null,
            },
          },
        ),
        phases: cachedGet(
          `${import.meta.env.VITE_APP_API_BASE_URL}/incidents_phases`,
          {
            headers: {
              Authorization: null,
            },
          },
          `incidents_phases:${locale.value}`,
        ),
        locationTypes: cachedGet(
          `${import.meta.env.VITE_APP_API_BASE_URL}/location_types`,
          {
            headers: {
              Authorization: null,
            },
          },
          `location_types:${locale.value}`,
        ),
        portal: cachedGet(
          `${import.meta.env.VITE_APP_API_BASE_URL}/portals/current`,
          {
            headers: {
              Authorization: null,
            },
          },
          `portal:${locale.value}`,
        ),
      });
      store.commit('enums/setStatuses', enums.statuses.data.results);
      store.commit('enums/setWorkTypes', enums.workTypes.data.results);
      store.commit('enums/setLocationTypes', enums.locationTypes.data.results);
      store.commit('enums/setPhases', enums.phases.data.results);
      store.commit('enums/setPortal', enums.portal.data);
    }

    watch(
      () => route.name,
      (n) => {
        const newTitle = `${t(n.toString() || '')}: Crisis Cleanup`;
        if (document.title !== newTitle) {
          document.title = newTitle;
        }
      },
      { immediate: true },
    );

    onMounted(async () => {
      if (moment().isAfter(AuthService.getExpiry())) {
        AuthService.removeUser();
      }

      if (import.meta.env.NODE_ENV === 'development') {
        eventsInterval.value = setInterval(pushCurrentEvents, 2000);
      }

      axios.interceptors.request.use((config) => {
        if (config.headers) {
          config.headers.CCU_PORTAL_KEY = import.meta.env.VITE_APP_PORTAL_KEY;
          config.headers.CCU_WEB_URL = window.location.href;
          return config;
        }
      });
      // Intercept and handle unauthenticated requests
      axios.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error) {
          if (error.response && error.response.status === 401) {
            store.commit('auth/setShowLoginModal', true);
          }

          return Promise.reject(error);
        },
      );
      await getEnums();
    });

    return {
      layout,
    };
  },
});
</script>

<template>
  <component :is="layout">
    <router-view />
    <DialogWrapper :transition-attrs="{ name: 'dialog' }" />
  </component>
</template>

<style lang="scss">
$dp__input_padding: 11px 12px !default;
@import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
.crisiscleanup-map-marker svg {
  width: 40px;
  height: 40px;
}
</style>
