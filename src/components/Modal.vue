<template>
  <transition name="modal" class="absolute">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div
          class="modal-container bg-white flex flex-col justify-between"
          :class="modalClasses"
          :style="modalStyle"
        >
          <div class="modal-header flex-shrink">
            <slot name="header">
              <div
                v-if="title"
                class="title p-3 flex items-center justify-between border-b"
              >
                <span class="text-base font-bold">{{ title }}</span>
                <ccu-icon
                  :alt="$t('actions.cancel')"
                  size="xs"
                  type="cancel"
                  @click.native="
                    () => {
                      $emit('close');
                      $emit('cancel');
                    }
                  "
                />
              </div>
            </slot>
          </div>

          <div class="modal-body">
            <ccu-icon
              v-if="closeable && !title"
              :alt="$t('actions.cancel')"
              size="xs"
              type="cancel"
              class="absolute right-0 p-2"
              @click.native="
                () => {
                  $emit('close');
                  $emit('cancel');
                }
              "
            />
            <div :class="modalBodyClasses">
              <slot></slot>
            </div>
          </div>

          <div class="modal-footer flex-shrink bg-white">
            <slot name="footer">
              <div class="flex items-center justify-center py-2 border-t">
                <base-button
                  :alt="$t('actions.ok')"
                  variant="solid"
                  class="px-6 p-3"
                  :action="
                    () => {
                      $emit('ok');
                      $emit('close');
                    }
                  "
                >
                  {{ $t('actions.ok') }}
                </base-button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    modalClasses: {
      type: null,
      default: null,
    },
    modalBodyClasses: {
      type: null,
      default: null,
    },
    modalStyle: {
      type: null,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    closeable: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="postcss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0 auto;
  transition: all 0.3s ease;
}

.modal-default-button {
  float: right;
}

/*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-body {
  @apply flex-grow;
}

@media only screen and (max-width: 1223px) and (orientation: landscape) {
  .modal-container {
    height: 95vh;
  }
  .modal-footer {
    @apply -mt-16;
  }
  .modal-body {
    @apply h-full;
  }
}
</style>
