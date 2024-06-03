<script setup>
import { ref, watch } from "vue";
const IPv4 = ref([]);
const IPv6 = ref([]);

const ConvertHandler = () => {
  IPv6.value[0] = (iP_decToHex(IPv4.value[0]) + iP_decToHex(IPv4.value[1]))
    .replace(/^0+/, "")
    .toUpperCase();
  IPv6.value[1] = (iP_decToHex(IPv4.value[2]) + iP_decToHex(IPv4.value[3]))
    .replace(/^0+/, "")
    .toUpperCase();
};

function iP_decToHex(num) {
  let temp = parseInt(num).toString(2).padStart(8, "0");
  let part1 = temp.slice(0, 4);
  let part2 = temp.slice(4);
  console.log(temp);
  return parseInt(part1, 2).toString(16) + parseInt(part2, 2).toString(16);
}
</script>

<template>
  <h1 class="text-3xl font-bold">IPv4轉IPv6</h1>
  <div
    class="flex flex-col items-center justify-start max-w-[100%] min-h-[100vh] flex-wrap mt-6"
  >
    <div class="w-[100%]">
      <div class="flex flex-row justify-start items-center w-[100%]">
        <button
          @click="ConvertHandler()"
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          轉換
        </button>
      </div>
      <div
        class="flex flex-row justify-center min-w-[100%] w-[600px] max-w-[100%] max-h-[400px] bg-cyan-950 rounded-lg"
      >
        <div class="flex flex-row" v-for="i in 4">
          <input
            class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 pl-2 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            v-model="IPv4[i - 1]"
            style="text-transform: uppercase"
            :class="{ 'mr-2': i == 4 }"
            inputmode="numeric"
            onkeyup="value=value.replace(/[^\d]/g,'') "
          />
          <p class="mx-2" v-if="i != 4">.</p>
        </div>
      </div>
      <div v-if="IPv6.length != 0">::{{ IPv6.join(":") }}</div>
    </div>
  </div>
</template>

<style scoped></style>
