<template>
  <div
    class="profile-menu flex items-center header-item overflow-hidden h-full"
    :class="invert && '--invert'"
  >
    <v-popover
      popper-class="menu-popover"
      placement="bottom-end"
      data-cy="auth.userprofile"
    >
      <div class="profile-menu__body flex cursor-pointer items-center">
        <Avatar
          :initials="currentUser ? currentUser.first_name : undefined"
          :url="currentUser && currentUser.profilePictureUrl"
          class="p-1"
          size="small"
        />
        <base-text variant="h3" class="p-3" regular :class="[...styles.title]">
          <span
            class="font-h3 text-h3 font-normal subpixel-antialiased"
            :class="styles.title"
            >{{ currentUser && currentUser.full_name }}
            <font-awesome-icon class="cursor-pointer" icon="caret-down" />
          </span>
        </base-text>
      </div>
      <template #popper>
        <div class="flex flex-col">
          <base-button
            data-cy="auth.userprofile.profile"
            class="text-base p-2 hover:bg-crisiscleanup-light-grey cursor-pointer"
            :text="$t('nav.profile')"
            :action="
              () => {
                $router.push(`/profile`);
              }
            "
          />
          <base-button
            data-cy="auth.userprofile.downloads"
            class="text-base p-2 hover:bg-crisiscleanup-light-grey cursor-pointer"
            :text="$t('nav.downloads')"
            :action="
              () => {
                $router.push(`/downloads`);
              }
            "
          />
          <base-button
            data-cy="auth.userprofile.logout"
            class="text-base p-2 hover:bg-crisiscleanup-light-grey cursor-pointer"
            :text="$t('actions.logout')"
            :action="() => $emit('auth:logout')"
          />
        </div>
      </template>
    </v-popover>
  </div>
</template>
<script lang="ts">
import { computed } from 'vue';
import Avatar from '../Avatar.vue';
import User from '@/models/User';

export default defineComponent({
  name: 'UserProfileMenu',
  components: { Avatar },
  props: {
    invert: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const currentUser = computed(() => {
      return User.find(store.getters['auth/userId']) as User;
    });

    const styles = computed(() => ({
      title:
        props.invert === true
          ? ['text-white']
          : ['text-crisiscleanup-dark-300'],
    }));

    return {
      styles,
      currentUser,
    };
  },
});
</script>

<style scoped lang="postcss"></style>
