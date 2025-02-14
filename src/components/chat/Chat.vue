<template>
  <div class="flex-1 p-2 sm:p-3 flex flex-col w-full">
    <div class="flex sm:items-center py-1 border-b border-gray-200">
      <div class="text-lg">{{ chat.name }}</div>
    </div>
    <tabs tab-details-classes="">
      <tab :name="$t('chat.chat')">
        <div class="message-container">
          <div
            id="messages"
            ref="messagesBox"
            class="flex flex-col flex-grow py-2 space-y-5 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            @wheel="handleWheel"
            @ontouchmove="handleWheel"
          >
            <ChatMessage
              v-for="message in sortedMessages"
              :key="message.id"
              :message="message"
              @onFavorite="(message: any) => toggleFavorite(message, true)"
              @onUnfavorite="(message: any) => toggleFavorite(message, false)"
            />
          </div>
          <div
            class="border-t-2 pt-1 sm:mb-0"
            :class="
              urgent ? 'border-crisiscleanup-chat-red' : 'border-gray-200'
            "
          >
            <div
              v-if="urgent"
              class="text-crisiscleanup-chat-red flex items-center mb-1"
            >
              <ccu-icon
                :alt="$t('chat.urgent')"
                size="small"
                type="attention-red"
                class="mr-1"
              />
              {{ $t('chat.urgent') }}
            </div>
            <div class="flex flex-col">
              <base-input
                v-model="currentMessage"
                text-area
                class=""
                @enter="sendMessage"
              />
              <div class="flex items-center justify-between py-2">
                <base-checkbox v-model="urgent">
                  {{ $t('chat.urgent') }}
                </base-checkbox>
                <span class="italic cursor-pointer" @click="focusNewsTab">{{
                  $t('chat.read_faq_first')
                }}</span>
                <div class="flex">
                  <base-button
                    class="h-8 w-8 bg-crisiscleanup-dark-blue"
                    :disabled="!Boolean(currentMessage)"
                    ccu-icon="plane"
                    :action="sendMessage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab>
      <tab :name="$t('chat.favorites')">
        <div class="flex flex-col h-84">
          <div
            class="flex flex-col flex-grow py-2 space-y-5 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            <ChatMessage
              v-for="favorite in favorites"
              :key="favorite.id"
              :message="favorite"
            />
          </div>
        </div>
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import axios from 'axios';
import moment from 'moment';
import { useToast } from 'vue-toastification';
import { getQueryString } from '../../utils/urls';
import { getErrorMessage } from '../../utils/errors';
import useCurrentUser from '../../hooks/useCurrentUser';
import User from '../../models/User';
import { useWebSockets } from '../../hooks/useWebSockets';
import ChatMessage from './ChatMessage.vue';
import type { Message } from '@/models/types';

export default defineComponent({
  name: 'Chat',
  components: { ChatMessage },
  props: {
    chat: {
      type: Object,
      default: () => ({}),
    },
    stateKey: {
      type: String,
      default: 'chat_last_seen',
    },
  },
  setup(props, { emit }) {
    const socket = ref<WebSocket | null>(null);
    const currentMessage = ref('');
    const messages = ref<Message[]>([]);
    const favorites = ref<Message[]>([]);
    const urgent = ref(false);
    const loadingMessages = ref(false);
    let sendToWebsocket: (data: Partial<Message>) => void;
    const messagesBox = ref<HTMLDivElement | null>(null);
    const { currentUser } = useCurrentUser();
    const $toasted = useToast();

    const sortedMessages = computed(() => {
      const currentMessages = [...messages.value];
      currentMessages.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
      return _.uniqWith(currentMessages, _.isEqual);
    });

    function handleWheel() {
      if (
        messagesBox?.value?.scrollTop === 0 &&
        sortedMessages.value.length > 0 &&
        !loadingMessages.value
      ) {
        getMessages(sortedMessages.value[0].created_at, false);
      }
    }

    async function getMessages(before: string | null = null, scroll = true) {
      loadingMessages.value = true;
      const parameters = {
        message_group: props.chat.id,
        limit: 5,
      } as Record<string, any>;
      if (before && messages.value.length > 0) {
        parameters.created_at__lte = before;
      }

      const queryString = getQueryString(parameters);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/chat_messages?${queryString}`,
      );
      messages.value = [...messages.value, ...response.data.results];
      if (scroll) {
        nextTick(() => {
          if (messagesBox.value) {
            messagesBox.value.scrollTop = messagesBox.value.scrollHeight;
          }
        });
      }

      loadingMessages.value = false;
    }

    async function getFavorites() {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/chat_groups/${
          props.chat.id
        }/my_favorites`,
      );
      favorites.value = response.data;
    }

    async function getUnreadMessagesCount() {
      loadingMessages.value = true;
      const parameters = {
        message_group: props.chat.id,
        limit: 1,
        is_urgent: false,
      } as Record<string, any>;
      if (currentUser?.states[props.stateKey]) {
        parameters.created_at__gte = currentUser.states[props.stateKey];
      }

      const queryString = getQueryString(parameters);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/chat_messages?${queryString}`,
      );
      emit('unreadCount', response.data.count);
    }

    async function getUnreadUrgentMessagesCount() {
      loadingMessages.value = true;
      const parameters = {
        message_group: props.chat.id,
        limit: 1,
        is_urgent: true,
      } as Record<string, any>;
      if (currentUser?.states[props.stateKey]) {
        parameters.created_at__gte = currentUser.states[props.stateKey];
      }

      const queryString = getQueryString(parameters);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/chat_messages?${queryString}`,
      );
      emit('unreadUrgentCount', response.data.count);
    }

    function sendMessage() {
      sendToWebsocket({
        content: currentMessage.value,
        is_urgent: urgent.value,
      });
      currentMessage.value = '';
      urgent.value = false;
      User.api().updateUserState(
        { [props.stateKey]: moment().toISOString() },
        {},
      );
    }

    async function toggleFavorite(
      message: { id: any; is_favorite: boolean },
      state: any,
    ) {
      try {
        if (state) {
          await axios.post(
            `${import.meta.env.VITE_APP_API_BASE_URL}/chat_messages/${
              message.id
            }/favorite`,
          );
          message.is_favorite = true;
        } else {
          await axios.post(
            `${import.meta.env.VITE_APP_API_BASE_URL}/chat_messages/${
              message.id
            }/unfavorite`,
          );
          message.is_favorite = false;
        }

        await getFavorites();
      } catch (error) {
        await $toasted.error(getErrorMessage(error));
      }
    }

    function focusNewsTab() {
      emit('focusNewsTab');
    }

    onBeforeMount(() => {
      const { socket: s, send } = useWebSockets(
        `/ws/chat/${props.chat.id}`,
        'chat',
        (data: Message) => {
          messages.value = [data, ...messages.value];
          if (String(data.created_by) !== String(currentUser?.id)) {
            if (data.is_urgent) {
              emit('onNewUrgentMessage');
            } else {
              emit('onNewMessage');
            }
          }

          nextTick(() => {
            if (messagesBox.value) {
              messagesBox.value.scrollTop = messagesBox.value.scrollHeight;
            }
          });
        },
      );

      socket.value = s;
      sendToWebsocket = send;
    });

    onMounted(async () => {
      await getUnreadMessagesCount();
      await getUnreadUrgentMessagesCount();
      await getMessages();
      await getFavorites();
    });

    onBeforeUnmount(() => {
      socket?.value?.close();
    });

    return {
      socket,
      messages,
      favorites,
      currentMessage,
      urgent,
      loadingMessages,
      sortedMessages,
      messagesBox,
      handleWheel,
      sendMessage,
      toggleFavorite,
      focusNewsTab,
    };
  },
});
</script>

<style scoped>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
.message-container {
  @apply flex flex-col;
  height: 60vh;
}
</style>
