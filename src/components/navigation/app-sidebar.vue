<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { SidebarItem } from '../../common/interfaces/sidebar-item.interface'
import { Badge } from 'primevue'

const emit = defineEmits<{
  (e: 'menuitem-click', item: SidebarItem): void
}>()

withDefaults(defineProps<{ items: SidebarItem[]; root?: boolean }>(), {
  root: false,
})

const app = getCurrentInstance()
defineExpose({
  $primevue: app?.appContext.config.globalProperties.$primevue,
})

const activeIndex = ref<number | null>(-1)

const visible = (item: SidebarItem) => item.visible !== false

const onMenuItemClick = (item: SidebarItem, index: number) => {
  if (item.disabled) {
    return
  }
  activeIndex.value = index === activeIndex.value ? null : index

  emit('menuitem-click', item)
}
</script>
<template>
  <ul class="layout-menu">
    <template v-for="(item, i) of items">
      <li
        v-if="visible(item) && !item.separator"
        :key="item.label || i"
        :class="[
          { 'layout-menuitem-category': root, 'active-menuitem': activeIndex === i && !item.to && !item.disabled },
        ]"
        role="none"
      >
        <template v-if="root">
          <div class="layout-menuitem-root-text" :aria-label="item.label">{{ item.label }}</div>
          <app-sidebar :items="item.items ?? []" @menuitem-click="$emit('menuitem-click', $event)"></app-sidebar>
        </template>
        <template v-else>
          <router-link
            v-if="item.to"
            :to="item.to"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            :style="item.style"
            :target="item.target"
            :aria-label="item.label"
            exact
            role="menuitem"
            v-ripple
            @click="onMenuItemClick(item, i)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
            <Badge v-if="item.badge" :value="item.badge" />
          </router-link>
          <a
            v-if="!item.to"
            :href="item.url || '#'"
            :style="item.style"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            :target="item.target"
            :aria-label="item.label"
            role="menuitem"
            v-ripple
            @click="onMenuItemClick(item, i)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
            <Badge v-if="item.badge" :value="item.badge" />
          </a>
          <transition name="layout-submenu-wrapper">
            <app-sidebar
              v-show="activeIndex === i"
              :items="item.items ?? []"
              @menuitem-click="$emit('menuitem-click', $event)"
            ></app-sidebar>
          </transition>
        </template>
      </li>
      <li
        class="p-menu-separator"
        :style="item.style"
        v-if="visible(item) && item.separator"
        :key="'separator' + i"
        role="separator"
      ></li>
    </template>
  </ul>
</template>
