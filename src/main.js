import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./assets/style/index.css";
import router from "./router";
import naive from "naive-ui";
import { InstallCodemirro } from "codemirror-editor-vue3";
createApp(App).use(router).use(InstallCodemirro).use(naive).mount("#app");
