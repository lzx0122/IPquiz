<script setup>
import { ref, watch } from "vue";
const IPv4 = ref([]);
const IPv6 = ref([]);

const hideExplanation = ref(true);

const ConvertHandler = () => {

  hideExplanation.value = false;
  IPv6.value[0] = (iP_decToHex(IPv4.value[0]) + iP_decToHex(IPv4.value[1]))
    .replace(/^0+/, "");
  IPv6.value[1] = (iP_decToHex(IPv4.value[2]) + iP_decToHex(IPv4.value[3]))
    .replace(/^0+/, "");
};

const iP_decToHex_Html = (num) => { 
  let temp = parseInt(num).toString(2).padStart(8, "0");
  let part1 = parseInt(temp.slice(0, 4), 2).toString(16).toUpperCase();
  let part2 = parseInt(temp.slice(4), 2).toString(16).toUpperCase();
  


  return `<div class="flex flex-row justify-around">
            <div class="text-emerald-500">${part1}</div>
            <div class="text-red-600">${part2}</div>
          </div>`
}

const keydownHandler = () => { 
  hideExplanation.value = true;


}

function iP_decToHex(num) {
  let temp = parseInt(num).toString(2).padStart(8, "0");
  let part1 = temp.slice(0, 4);
  let part2 = temp.slice(4);
  return (parseInt(part1, 2).toString(16) + parseInt(part2, 2).toString(16)).toUpperCase();
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
            @keydown="keydownHandler()"
          />
          <p class="mx-2" v-if="i != 4">.</p>
        </div>
      </div>
      <h4>手機使用者建議 橫向畫面</h4>
      <div class="flex flex-row justify-center min-w-[100%] w-[600px] max-w-[100%] max-h-[400px]" v-if="!hideExplanation">

        <div class="flex flex-row"v-for="(i, key) in IPv4" :key="key">
          <div class="flex flex-col">
            <div class="flex flex-row ">
                <div class="border-2 px-1" 
                    v-for="(j, key2) in parseInt(i).toString(2).padStart(8, '0').split('')"
                    :class="{'border-emerald-500': key2 < 4, 'border-red-600': key2 >= 4}"
              >
                {{ j }}
              </div>

            </div>
             
            <div v-html="iP_decToHex_Html(i)">
              
            </div>
          </div>
          
          <div class="mx-1" v-if="key != 3"><div>.</div> <div v-if="key == 1">:</div></div>
          
        </div>
        
      </div>
      <div v-if="!hideExplanation">
        <div class="mt-2">記得最簡表示： 把最左邊的 0 都去掉</div>
        <div class="mt-2" v-if="IPv6.length != 0">::{{ IPv6.join(":") }}</div>
      </div>
     
    </div>
  </div>
</template>

<style scoped></style>
