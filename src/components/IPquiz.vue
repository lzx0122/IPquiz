<script setup>
import { ref, watch } from "vue";
// 0: 等級化 , 1: 非等級化
const currentMode = ref(0);
const subnetMask = ref(null);
const qIP = ref([]);
const subnetMaskIP = ref([]);
const networkAddress = ref([]);
const broadcastAddress = ref([]);
const isOpenExplanation = ref(false);
const hideExplanation = ref(true);
const submitForm = ref({
  class: "",
  SM: [],
  NA: [],
  BA: [],
});

const submitResult = ref({
  class: false,
  SM: false,
  NA: false,
  BA: false,
});

const isSubmit = ref(false);

const ProduceHandler = (m) => {
  isSubmit.value = false;
  submitForm.value = {
    class: "",
    SM: [],
    NA: [],
    BA: [],
  };

  if (m == 0) {
    subnetMask.value = null;
    let randomClass = Math.floor(Math.random() * 3) + 1;

    if (randomClass == 1)
      qIP.value[0] = Math.floor(Math.random() * 128).toString();
    else if (randomClass == 2)
      qIP.value[0] = (
        Math.floor(Math.random() * (191 - 128 + 1)) + 128
      ).toString();
    else if (randomClass == 3)
      qIP.value[0] = (
        Math.floor(Math.random() * (223 - 192 + 1)) + 192
      ).toString();

    qIP.value[0] = Math.floor(Math.random() * 224).toString();
    for (let i = 1; i < 4; i++) {
      qIP.value[i] = Math.floor(Math.random() * 256).toString();
    }

    if (currentMode.value == "1") {
      subnetMask.value = Math.floor(Math.random() * 31) + 1;
      return;
    }
  }
};

const openExplanationHandler = () => {
  isOpenExplanation.value = !isOpenExplanation.value;
};

const SubmitHandler = () => {
  isSubmit.value = true;
  isOpenExplanation.value = false;
  hideExplanation.value = false;
  submitForm.value.SM = submitForm.value.SM.map((item) => parseInt(item));
  submitForm.value.NA = submitForm.value.NA.map((item) => parseInt(item));
  submitForm.value.BA = submitForm.value.BA.map((item) => parseInt(item));

  submitForm.value.class = submitForm.value.class.toUpperCase();
  if (currentMode.value == "0")
    submitResult.value.class =
      getIPClass(qIP.value[0]) == submitForm.value.class;

  submitResult.value.SM = checkSM();

  submitResult.value.NA = checkNA();
  submitResult.value.BA = checkBA();
};

function checkSM() {
  let byte = Math.floor(subnetMask.value / 8);
  let bit = subnetMask.value % 8;
  let result = true;
  for (let i = 0; i < byte; i++) {
    subnetMaskIP.value[i] = 255;
    if (submitForm.value.SM[i] != 255) result = false;
  }

  if (
    submitForm.value.SM[byte] !=
    parseInt("1".repeat(bit) + "0".repeat(8 - bit), 2)
  )
    result = false;

  subnetMaskIP.value[byte] = parseInt("1".repeat(bit) + "0".repeat(8 - bit), 2);

  for (let i = byte + 1; i < 4; i++) {
    subnetMaskIP.value[i] = 0;
    if (submitForm.value.SM[i] != 0) result = false;
  }

  return result;
}

function checkNA() {
  let result = true;
  for (let i = 0; i < 4; i++) {
    networkAddress.value[i] = qIP.value[i] & subnetMaskIP.value[i];
    if (networkAddress.value[i] != submitForm.value.NA[i]) result = false;
  }
  return result;
}

function checkBA() {
  let byte = Math.floor(subnetMask.value / 8);
  let bit = subnetMask.value % 8;
  let temp = "0".repeat(bit) + "1".repeat(8 - bit);
  let result = true;
  for (let i = 0; i < byte; i++) {
    broadcastAddress.value[i] = qIP.value[i];
    if (broadcastAddress.value[i] != submitForm.value.BA[i]) result = false;
  }

  broadcastAddress.value[byte] = qIP.value[byte] | parseInt(temp, 2);
  if (broadcastAddress.value[byte] != submitForm.value.BA[byte]) result = false;
  for (let i = byte + 1; i < 4; i++) {
    broadcastAddress.value[i] = qIP.value[i] | 255;
    if (broadcastAddress.value[i] != submitForm.value.BA[i]) result = false;
  }

  return result;
}

function getIPClass(ip) {
  let firstOctet = parseInt(ip);

  if (firstOctet >= 0 && firstOctet <= 127) {
    subnetMask.value = 8;
    return "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    subnetMask.value = 16;
    return "B";
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    subnetMask.value = 24;
    return "C";
  } else {
    return null;
  }
}

const inputHandler = (e) => {
  hideExplanation.value = true;
};

watch(currentMode, () => {
  qIP.value = [];
  subnetMask.value = null;
  isSubmit.value = false;
});

watch(qIP, () => {
  subnetMaskIP.value = [];
  networkAddress.value = [];
  broadcastAddress.value = [];
  getIPClass(qIP.value);
  checkSM();
  checkNA();
  checkBA();
});
</script>

<template>
  <h1 class="text-3xl font-bold">IP出題</h1>
  <div
    class="flex flex-col items-center justify-start max-w-[100%] min-h-[100vh] flex-wrap mt-6"
  >
    <div class="w-[100%]">
      <div class="flex flex-row justify-start items-center w-[100%]">
        <p class="text-left text-lg mr-6 px-5 py-1 me-2 mb-2">選擇模式</p>
        <select
          class="rounded-lg w-[110px] p-1 mr-6 px-2 py-1 me-2 mb-2 dark:bg-[#3B3B3B]"
          v-model="currentMode"
        >
          <option value="0" selected>等級化</option>
          <option value="1">非等級化</option>
        </select>

        <button
          @click="ProduceHandler(0)"
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          產生
        </button>
        <button
          @click="ProduceHandler(1)"
          type="button"
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          自填
        </button>
      </div>
      <div
        class="flex flex-row justify-center min-w-[100%] w-[600px] max-w-[100%] max-h-[400px] bg-cyan-950 rounded-lg"
      >
        <div class="flex flex-row" v-for="i in 4">
          <input
            class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 pl-2 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            v-model="qIP[i - 1]"
            style="text-transform: uppercase"
            :class="{ 'mr-2': i == 4 }"
            inputmode="numeric"
            onkeyup="value=value.replace(/[^\d]/g,'') "
            @keydown="inputHandler($event)"
          />
          <p class="mx-2" v-if="i != 4">.</p>
        </div>

        <div v-if="currentMode == '1'">
          /<input
            class="my-2 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            v-model="subnetMask"
            style="text-transform: uppercase"
            inputmode="numeric"
            onkeyup="value=value.replace(/[^\d]/g,'') "
          />
        </div>
      </div>
      <div
        v-if="qIP.length != 0"
        class="flex mt-5 min-w-[100%] w-[600px] max-w-[100%] max-h-[400px]"
      >
        <div v-if="currentMode != null" class="justify-start">
          <div
            v-if="currentMode == '0'"
            class="flex flex-row items-center rounded-md px-1"
            :class="{
              'bg-green-300 opacity-25': submitResult.class && isSubmit,
              'bg-red-300 opacity-25': !submitResult.class && isSubmit,
            }"
          >
            <label class="mr-5 font-bold"> Class? </label>
            <input
              class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              v-model="submitForm.class"
              style="text-transform: uppercase"
              :disabled="isSubmit"
            />
          </div>
          <div
            class="flex flex-row flex-wrap items-center mt-3 rounded-md px-1"
            :class="{
              'bg-green-300 opacity-25': submitResult.SM && isSubmit,
              'bg-red-300 opacity-25': !submitResult.SM && isSubmit,
            }"
          >
            <label class="min-w-[80px] mr-5 font-bold"> 網路遮罩? </label>
            <div class="flex flex-row w-full">
              <div class="flex flex-row" v-for="i in 4">
                <input
                  class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  v-model="submitForm.SM[i - 1]"
                  style="text-transform: uppercase"
                  :disabled="isSubmit"
                  inputmode="numeric"
                  onkeyup="value=value.replace(/[^\d]/g,'') "
                />
                <p class="mx-2" v-if="i != 4">.</p>
              </div>
            </div>
          </div>

          <div
            class="flex flex-row flex-wrap items-center mt-3 rounded-md px-1"
            :class="{
              'bg-green-300 opacity-25': submitResult.NA && isSubmit,
              'bg-red-300 opacity-25': !submitResult.NA && isSubmit,
            }"
          >
            <label class="min-w-[80px] mr-5 font-bold"> 網路位址? </label>
            <div class="flex flex-row w-full">
              <div class="flex flex-row" v-for="i in 4">
                <input
                  class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  v-model="submitForm.NA[i - 1]"
                  style="text-transform: uppercase"
                  :disabled="isSubmit"
                  inputmode="numeric"
                  onkeyup="value=value.replace(/[^\d]/g,'') "
                />
                <p class="mx-2" v-if="i != 4">.</p>
              </div>
            </div>
          </div>

          <div
            class="flex flex-row flex-wrap items-center mt-3 rounded-md px-1"
            :class="{
              'bg-green-300 opacity-25': submitResult.BA && isSubmit,
              'bg-red-300 opacity-25': !submitResult.BA && isSubmit,
            }"
          >
            <label class="min-w-[110px] mr-5 font-bold"> 網路廣播位址? </label>
            <div class="flex flex-row w-full">
              <div class="flex flex-row" v-for="i in 4">
                <input
                  class="my-1 bg-slate-950 w-full max-w-[80px] shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  v-model="submitForm.BA[i - 1]"
                  style="text-transform: uppercase"
                  :disabled="isSubmit"
                  inputmode="numeric"
                  onkeyup="value=value.replace(/[^\d]/g,'') "
                />
                <p class="mx-2" v-if="i != 4">.</p>
              </div>
            </div>
          </div>

          <button
            v-if="!isSubmit"
            @click="SubmitHandler()"
            type="button"
            class="mt-3 block focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            提交
          </button>
        </div>
      </div>
      <!-- 詳解 -->

      <div v-if="isSubmit && !hideExplanation" class="transition mt-5">
        <div class="flex cursor-pointer" @click="openExplanationHandler()">
          <h4 class="h-[30px] mr-2" style="line-height: 20px">
            詳解 : 手機畫面太小，建議"橫向"
          </h4>
          <div class="w-[20px]" :class="{ 'rotate-90': isOpenExplanation }">
            <img src="../assets/images/right-arrow.png" alt="" />
          </div>
        </div>
        <hr />

        <div v-if="isOpenExplanation" class="mt-2">
          <div class="mt-5">
            IP: 二進制
            <div class="flex justify-center">
              <div class="flex" v-for="(j, key2) in qIP" :key="key2">
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="key"
                >
                  <div class="border-2 border-green-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>
                <div v-if="key2 < 3" class="mx-1">.</div>
              </div>
            </div>
          </div>
          <!-- Class -->
          <div
            class="flex flex-col justify-center mt-5"
            v-if="currentMode == '0'"
          >
            Class: {{ getIPClass(qIP) }}
            <img
              v-if="getIPClass(qIP) == 'A'"
              src="../assets/images/A_Class.png"
            />
            <img
              v-if="getIPClass(qIP) == 'B'"
              src="../assets/images/B_Class.png"
            />
            <img
              v-if="getIPClass(qIP) == 'C'"
              src="../assets/images/C_Class.png"
            />

            <div class="flex mt-2 max-w-full justify-center">
              <div
                v-for="(i, key) in parseInt(qIP[0])
                  .toString(2)
                  .padStart(8, '0')
                  .split('')"
                :key="i"
              >
                <div
                  :class="{
                    'border-2 border-orange-800 px-[3px] w-[19px]':
                      getIPClass(qIP[0]) == 'A'
                        ? key == 0
                        : getIPClass(qIP) == 'B'
                        ? key == 0 || key == 1
                        : key == 0 || key == 1 || key == 2,
                    'border-2 border-green-800 px-[3px] w-[19px]':
                      getIPClass(qIP) == 'A'
                        ? !(key == 0)
                        : getIPClass(qIP) == 'B'
                        ? !(key == 0 || key == 1)
                        : !(key == 0 || key == 1 || key == 2),
                  }"
                >
                  {{ i }}
                </div>
              </div>

              <div class="mx-1">.</div>
              <div
                class="flex"
                v-for="(j, key2) in qIP.slice(1, 4)"
                :key="key2"
              >
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-green-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>
                <div class="mx-1" v-if="key2 != 2">.</div>
              </div>
            </div>
          </div>

          <!-- SM -->

          <div class="mt-5">
            SM:
            <div class="flex justify-center">
              <div
                class="flex"
                v-for="(j, key2) in subnetMaskIP.slice(
                  0,
                  Math.floor(subnetMask / 8)
                )"
                :key="key2"
              >
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-orange-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>
                <div class="mx-1">.</div>
              </div>

              <div v-if="subnetMask % 8 != 0" class="flex">
                <div
                  v-for="(i, key) in subnetMaskIP[Math.floor(subnetMask / 8)]
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div
                    class="border-2 px-[3px] w-[19px]"
                    :class="{
                      'border-orange-800': subnetMask % 8 > key,
                      'border-green-800': subnetMask % 8 <= key,
                    }"
                  >
                    {{ i }}
                  </div>
                </div>
                <div v-if="Math.floor(subnetMask / 8) != 3" class="mx-1">.</div>
              </div>

              <div
                class="flex"
                v-for="(j, key2) in subnetMaskIP.slice(
                  subnetMask % 8 == 0
                    ? Math.floor(subnetMask / 8)
                    : Math.floor(subnetMask / 8) + 1,
                  4
                )"
                :key="key2"
              >
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-green-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>

                <div
                  class="mx-1"
                  v-if="
                    key2 <
                    4 -
                      (subnetMask % 8 == 0
                        ? Math.floor(subnetMask / 8) + 1
                        : Math.floor(subnetMask / 8) + 2)
                  "
                >
                  .
                </div>
              </div>
            </div>
            {{ subnetMaskIP.join(".") }}
          </div>
          <!-- NA -->

          <div class="mt-5">
            NA: 用 IP 跟 SM 做 AND運算
            <div class="flex justify-center">
              <div class="flex" v-for="(j, key2) in networkAddress" :key="key2">
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-green-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>
                <div v-if="key2 < 3" class="mx-1">.</div>
              </div>
            </div>
            {{ networkAddress.join(".") }}
          </div>

          <!-- BA -->
          <div class="mt-5">
            BA: 將遮罩後面的位元全改1
            <div class="flex justify-center">
              <div
                class="flex"
                v-for="(j, key2) in broadcastAddress.slice(
                  0,
                  Math.floor(subnetMask / 8)
                )"
                :key="key2"
              >
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-green-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>
                <div class="mx-1">.</div>
              </div>

              <div v-if="subnetMask % 8 != 0" class="flex">
                <div
                  v-for="(i, key) in broadcastAddress[
                    Math.floor(subnetMask / 8)
                  ]
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div
                    class="border-2 px-[3px] w-[19px]"
                    :class="{
                      'border-green-800': subnetMask % 8 > key,
                      'border-orange-800': subnetMask % 8 <= key,
                    }"
                  >
                    {{ i }}
                  </div>
                </div>
                <div v-if="Math.floor(subnetMask / 8) != 3" class="mx-1">.</div>
              </div>

              <div
                class="flex"
                v-for="(j, key2) in broadcastAddress.slice(
                  subnetMask % 8 == 0
                    ? Math.floor(subnetMask / 8)
                    : Math.floor(subnetMask / 8) + 1,
                  4
                )"
                :key="key2"
              >
                <div
                  v-for="(i, key) in parseInt(j)
                    .toString(2)
                    .padStart(8, '0')
                    .split('')"
                  :key="i"
                >
                  <div class="border-2 border-orange-800 px-[3px] w-[19px]">
                    {{ i }}
                  </div>
                </div>

                <div
                  class="mx-1"
                  v-if="
                    key2 <
                    4 -
                      (subnetMask % 8 == 0
                        ? Math.floor(subnetMask / 8) + 1
                        : Math.floor(subnetMask / 8) + 2)
                  "
                >
                  .
                </div>
              </div>
            </div>
            {{ broadcastAddress.join(".") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
