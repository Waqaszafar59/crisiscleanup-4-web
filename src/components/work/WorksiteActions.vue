<template>
  <div class="flex items-center worksite-actions" style="color: #4c4c4d">
    <div v-if="pdas && pdas.length > 0" class="mt-2">
      <base-checkbox
        class="pb-2"
        :model-value="showingHeatMap"
        @update:modelValue="
          showingHeatMap = $event;
          $emit('toggleHeatMap', $event ? pdas : null);
        "
      >
        <div class="flex">
          {{ $t('casesVue.show_damaged_areas') }}
          <img
            v-tooltip="{
              content: $t('casesVue.damage_assessment_help'),
              triggers: ['hover'],
              html: true,
              popperClass: 'interactive-tooltip w-72',
            }"
            class="w-5 h-5"
            src="../../assets/red-cross-logo.jpg"
          />
        </div>
      </base-checkbox>
    </div>
    <v-popover placement="bottom-start">
      <base-button
        slot="btn"
        variant="text"
        class="text-base font-thin mx-2"
        :text="$t('casesVue.layers')"
        :alt="$t('casesVue.layers')"
        ccu-icon="layers"
        icon-size="medium"
        icon-classes="w-4"
      />

      <template #popper>
        <div class="px-4 py-1 font-bold">
          {{ $t('casesVue.standard_layers') }}
        </div>

        <v-menu placement="right-start" trigger="hover" instant-move>
          <div class="menu-item">
            {{ $t('locationTypes.boundary_political_us_state') }}
          </div>

          <template #popper>
            <v-menu placement="right-start" trigger="hover" instant-move>
              <div class="locations-popover">
                <div v-for="state in usStates" :key="`${state.id}`">
                  <base-checkbox
                    :model-value="appliedLocations.has(state.id)"
                    :ccu-event="
                      appliedLocations.has(state.id)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(state.id, value);
                      }
                    "
                    >{{ state.name }}</base-checkbox
                  >
                </div>
              </div>
            </v-menu>
          </template>
        </v-menu>
        <v-menu placement="right-start" trigger="hover" instant-move>
          <div class="menu-item">
            {{ $t('locationTypes.boundary_political_us_congress') }}
          </div>

          <template #popper>
            <v-menu placement="right-start" trigger="hover" instant-move>
              <div class="locations-popover">
                <div v-for="district in districts" :key="`${district.id}`">
                  <base-checkbox
                    :model-value="appliedLocations.has(district.id)"
                    :ccu-event="
                      appliedLocations.has(district.id)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(district.id, value);
                      }
                    "
                    >{{ district.name }}</base-checkbox
                  >
                </div>
              </div>
            </v-menu>
          </template>
        </v-menu>
        <v-menu placement="right-start" trigger="hover" instant-move>
          <div class="menu-item">
            {{ $t('locationTypes.boundary_political_us_county') }}
          </div>

          <template #popper>
            <v-menu placement="right-start" trigger="hover" instant-move>
              <div class="locations-popover">
                <div v-for="county in counties" :key="`${county.id}`">
                  <base-checkbox
                    :model-value="appliedLocations.has(county.id)"
                    :ccu-event="
                      appliedLocations.has(county.id)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(county.id, value);
                      }
                    "
                    >{{ county.name }}</base-checkbox
                  >
                </div>
              </div>
            </v-menu>
          </template>
        </v-menu>
        <v-menu placement="right-start" trigger="hover" instant-move>
          <div class="menu-item">
            {{ $t('casesVue.incident') }}
          </div>

          <template #popper>
            <v-menu placement="right-start" trigger="hover" instant-move>
              <div class="locations-popover">
                <div
                  v-for="location in currentIncident.locationModels"
                  :key="location.id"
                >
                  <base-checkbox
                    :model-value="appliedLocations.has(location.id)"
                    :ccu-event="
                      appliedLocations.has(location.id)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(location.id, value);
                      }
                    "
                    >{{ location.name }}</base-checkbox
                  >
                </div>
                <div
                  v-if="
                    currentOrganization && currentOrganization.primary_location
                  "
                >
                  <base-checkbox
                    :model-value="
                      appliedLocations.has(currentOrganization.primary_location)
                    "
                    :ccu-event="
                      appliedLocations.has(currentOrganization.primary_location)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(
                          currentOrganization.primary_location,
                          value,
                        );
                      }
                    "
                    >{{ $t('casesVue.primary_response_area') }}</base-checkbox
                  >
                </div>
                <div
                  v-if="
                    currentOrganization &&
                    currentOrganization.secondary_location
                  "
                >
                  <base-checkbox
                    :model-value="
                      appliedLocations.has(
                        currentOrganization.secondary_location,
                      )
                    "
                    :ccu-event="
                      appliedLocations.has(
                        currentOrganization.secondary_location,
                      )
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(
                          currentOrganization.secondary_location,
                          value,
                        );
                      }
                    "
                    >{{ $t('casesVue.secondary_response_area') }}</base-checkbox
                  >
                </div>
              </div>
            </v-menu>
          </template>
        </v-menu>
        <v-menu placement="right-start" trigger="hover" instant-move>
          <div class="menu-item">
            {{ $t('casesVue.my_layers') }}
          </div>

          <template #popper>
            <v-menu placement="right-start" trigger="hover" instant-move>
              <div class="locations-popover">
                <div
                  v-for="location in organizationLocations"
                  :key="`${location.id}`"
                >
                  <base-checkbox
                    :model-value="appliedLocations.has(location.id)"
                    :ccu-event="
                      appliedLocations.has(location.id)
                        ? 'user_ui-turn-off_layer'
                        : 'user_ui-turn-on_layer'
                    "
                    @update:modelValue="
                      (value) => {
                        applyLocation(location.id, value);
                      }
                    "
                    >{{ location.name }}</base-checkbox
                  >
                </div>
              </div>
            </v-menu>
          </template>
        </v-menu>
      </template>
    </v-popover>
    <base-button
      class="text-base font-thin mx-2"
      ccu-icon="filters"
      icon-size="medium"
      icon-classes="w-4"
      :alt="$t('casesVue.filters')"
      :action="
        () => {
          showingFilters = true;
        }
      "
    >
      {{ $t('casesVue.filters') }}
      <span
        v-if="filtersCount > 0"
        class="rounded-full mx-2 px-1 bg-yellow-500 text-xs"
        >{{ filtersCount }}</span
      >
    </base-button>
    <WorksiteFilters
      ref="worksiteFilter"
      :show="showingFilters"
      :current-filters="initalFilters"
      :incident="currentIncident"
      :locations="organizationLocations"
      @closedFilters="showingFilters = false"
      @updatedFilters="handleFilters"
      @updateFiltersCount="filtersCount = $event"
    />
    <base-button
      class="text-base font-thin mx-2"
      ccu-icon="download"
      icon-size="medium"
      icon-classes="w-4"
      :alt="$t('actions.download')"
      :text="$t('actions.download')"
      :action="() => $emit('downloadCsv')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import LocationType from '../../models/LocationType';
import Team from '../../models/Team';
import Incident from '../../models/Incident';
import { getQueryString } from '../../utils/urls';
import User from '../../models/User';
import Organization from '../../models/Organization';
import WorksiteFilters from './WorksiteFilters.vue';

export default defineComponent({
  name: 'WorksiteActions',
  components: { WorksiteFilters },
  props: {
    initalFilters: { type: Object, default: null, required: false },
    map: { type: Object, default: null, required: false },
    currentIncidentId: { type: String, default: null, required: false },
  },
  setup(props, { emit }) {
    const store = useStore();
    const userId = computed(() => store.getters['auth/userId']);
    const currentIncidentId = computed(
      () => store.getters['incident/currentIncidentId'],
    );

    const currentUser = computed(() => User.find(userId.value));
    const currentOrganization = computed(() =>
      Organization.find(currentUser?.value?.organization?.id),
    );

    const showingFilters = ref<boolean>(false);
    const filtersCount = ref<number>(0);
    const filters = ref<any>({});
    const appliedFilters = ref<any>({});

    const appliedLocations = ref<Set<string>>(new Set());
    const locations = ref<any[] | null>(null);
    const usStates = ref<any[]>([]);
    const districts = ref<any[]>([]);
    const counties = ref<any[]>([]);
    const organizationLocations = ref<any[]>([]);
    const pdas = ref(null);
    const showingHeatMap = ref(false);

    const teams = computed(() => {
      return Team.all();
    });
    const currentIncident = computed(() => {
      return Incident.find(props.currentIncidentId);
    });

    async function applyLocation(locationId, value) {
      emit('applyLocation', {
        locationId,
        value,
      });
      if (value) {
        appliedLocations.value = new Set(
          appliedLocations.value.add(locationId),
        );
      } else {
        appliedLocations.value.delete(locationId);
        appliedLocations.value = new Set(appliedLocations.value);
      }
    }

    async function applyTeamGeoJson(team, value) {
      const { response } = await Team.api().getCasesArea(
        team.id,
        props.currentIncidentId,
      );
      const locationId = team.id;

      emit('applyTeamGeoJson', {
        teamId: team.id,
        value,
        geom: response.data,
      });

      if (value) {
        appliedLocations.value = new Set(
          appliedLocations.value.add(locationId),
        );
      } else {
        appliedLocations.value.delete(locationId);
        appliedLocations.value = new Set(appliedLocations.value);
      }
    }

    async function getLocations() {
      const locationParams = {
        limit: 200,
        fields: 'id,name,type',
        incident_area: props.currentIncidentId,
      };
      const promiseArray: any = [];

      const locationTypesMap = {
        boundary_political_us_congress: districts,
        boundary_political_us_state: usStates,
        boundary_political_us_county: counties,
      };

      for (const type of Object.keys(locationTypesMap)) {
        const promise = axios
          .get(`${import.meta.env.VITE_APP_API_BASE_URL}/locations`, {
            params: {
              ...locationParams,
              type__key: type,
            },
          })
          .then((response) => {
            locationTypesMap[type].value = response.data.results;
          });
        promiseArray.push(promise);
      }

      return Promise.any(promiseArray);
    }

    async function getOrganizationLocations() {
      const locationParams = {
        limit: 200,
        created_by__organization: currentUser?.value?.organization.id,
        fields: 'id,name,type',
      };
      const queryString = getQueryString(locationParams);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/locations?${queryString}`,
      );
      organizationLocations.value = response.data.results;
    }

    function handleFilters(f) {
      appliedFilters.value = {};
      filters.value = f.filters;
      Object.values(f.filters).forEach((filter: any) => {
        appliedFilters.value = {
          ...appliedFilters.value,
          ...filter.packFunction(),
        };
      });
      filtersCount.value = f.count;

      showingFilters.value = false;
      emit('updatedQuery', appliedFilters.value);
      emit('updatedFilters', filters.value);
      // this.updateUserState();
    }

    async function getPdas() {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/pdas`,
        {
          params: { incident: currentIncidentId.value },
        },
      );
      pdas.value = response.data
        .filter((p) => Boolean(p.location))
        .map((p) => [p.location.coordinates[1], p.location.coordinates[0]]);
    }

    onMounted(async () => {
      if (props.initalFilters) {
        filters.value = props.initalFilters;
      }

      await Promise.any([
        getLocations(),
        getOrganizationLocations(),
        LocationType.api().get('/location_types', {
          dataKey: 'results',
        }),
        Team.api().get('/teams', {
          dataKey: 'results',
        }),
        getPdas(),
      ]);
    });

    return {
      handleFilters,
      filters,
      currentIncident,
      currentOrganization,
      organizationLocations,
      showingFilters,
      usStates,
      districts,
      counties,
      applyLocation,
      applyTeamGeoJson,
      appliedLocations,
      teams,
      locations,
      filtersCount,
      pdas,
      showingHeatMap,
    };
  },
});
</script>

<style scoped>
.locations-popover {
  @apply h-64 overflow-auto p-3 w-64;
}

.menu-item {
  @apply cursor-pointer px-4 py-2 hover:bg-crisiscleanup-light-grey;
}
</style>
