<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps(["RouterLink"]);
const RouterLink = props.RouterLink;
const selectClass =
  "bg-gradient-to-r from-sky-600/60 to-cyan-400/60 px-4 py-3 text-white text-teal-800";
const unselectClass = "bg-[#242424]/60 px-4 py-3 text-gray-600 text-slate-400";

const route = useRoute();

const path = ref(computed(() => route.path));

const sidebar_w = ref("size-[3.35rem]");
const sidebar_isOpen = ref(false);
const sidebar_w_handle = () => {
  sidebar_isOpen.value = !sidebar_isOpen.value;

  if (sidebar_isOpen.value) {
    sidebar_w.value = "w-40 min-h-screen border-r";
    return;
  }
  sidebar_w.value = "size-[3.35rem]";
};
</script>

<template>
  <div
    class="backdrop-blur-sm sidebar overflow-hidden hover:shadow-lg transition-all fixed top-0 left-0 right-0"
    :class="sidebar_w"
  >
    <div class="flex h-screen flex-col justify-between pt-2 pb-6">
      <div>
        <div class="w-max p-2.5">
          <img
            src="../assets/images/menu.png"
            alt="menu"
            class="size-[24px] cursor-pointer"
            @click="sidebar_w_handle"
          />
        </div>
        <ul class="mt-6 space-y-2 tracking-wide">
          <li class="min-w-max">
            <RouterLink to="/IPquiz">
              <a
                href="#"
                :class="path == '/IPquiz' ? selectClass : unselectClass"
                class="bg group flex items-center space-x-4 0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    class="fill-current text-gray-300 group-hover:text-cyan-300"
                    d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"
                  />
                  <path
                    class="fill-current text-gray-600 group-hover:text-cyan-600"
                    fill-rule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="group-hover:text-gray-700">IP出題</span>
              </a></RouterLink
            >
          </li>
          <li class="min-w-max">
            <RouterLink to="/IPv4ToIPv6">
              <a
                href="#"
                :class="path == '/IPv4ToIPv6' ? selectClass : unselectClass"
                class="bg group flex items-center space-x-4 0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    class="fill-current text-gray-300 group-hover:text-cyan-300"
                    d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"
                  />
                  <path
                    class="fill-current text-gray-600 group-hover:text-cyan-600"
                    fill-rule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="group-hover:text-gray-700">IPv4轉IPv6</span>
              </a></RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
