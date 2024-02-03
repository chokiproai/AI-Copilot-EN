<script setup lang="ts">
import { h, ref, onMounted } from 'vue';
import { NDropdown, type DropdownOption, NModal, NInput, NInputNumber, NButton, useMessage, NImage, NForm, NFormItem, NSwitch, NTag, NSelect, NConfigProvider, lightTheme, darkTheme } from 'naive-ui';
import settingSvgUrl from '@/assets/img/setting.svg?url';
import { usePromptStore } from '@/stores/modules/prompt';
import { storeToRefs } from 'pinia';
import ChatNavItem from './ChatNavItem.vue';
import type { Component } from 'vue';
import { isMobile } from '@/utils/utils';
import CreateImage from '@/components/CreateImage/CreateImage.vue';
import { useChatStore } from '@/stores/modules/chat';
import { useUserStore } from '@/stores/modules/user';

const isShowMore = ref(false);
const isShowSettingModal = ref(false);
const isShowAdvancedSettingModal = ref(false);
const isShowSetAboutModal = ref(false);
const userToken = ref('');
const userKievRPSSecAuth = ref('');
const userRwBf = ref('');
const userMUID = ref('');
const message = useMessage();
const promptStore = usePromptStore();
const { isShowPromptSotre } = storeToRefs(promptStore);
const isShowClearCacheModal = ref(false);
const isShowCreateImageModal = ref(false);
const chatStore = useChatStore();
const { isShowChatServiceSelectModal } = storeToRefs(chatStore);
const userStore = useUserStore();
const localVersion = __APP_INFO__.version;
const lastVersion = ref('...');
const { historyEnable, themeMode, fullCookiesEnable, cookiesStr, enterpriseEnable, customChatNum, gpt4tEnable, sydneyEnable, sydneyPrompt, passServer } = storeToRefs(userStore)
let cookiesEnable = ref(false);
let cookies = ref('');
let history = ref(true);
let themeModeSetting = ref('auto');
let theme = ref(lightTheme);
let settingIconStyle = ref({
  filter: 'invert(70%)',
})
let passingCFChallenge = ref(false);
const enterpriseSetting = ref(false);
const customChatNumSetting = ref(0);
const gpt4tSetting = ref(true);
const sydneySetting = ref(false);
const sydneyPromptSetting = ref('');
const passServerSetting = ref('');

const GetLastVersion = async () => {
  const res = await fetch('https://api.github.com/repos/chokiproai/AI-Copilot-EN/releases/latest');
  const json = await res.json();
  lastVersion.value = json.tag_name;
};

const navType = {
  github: 'github',
  chatService: 'chatService',
  promptStore: 'promptStore',
  setting: 'setting',
  compose: 'compose',
  createImage: 'createImage',
  advancedSetting: 'advancedSetting',
  reset: 'reset',
  about: 'about',
};
const navConfigs = [
  {
    key: navType.promptStore,
    label: 'Suggestion Store',
},
{
    key: navType.advancedSetting,
    label: 'Advanced Settings',
},
{
    key: navType.reset,
    label: 'Reset All',
},
{
    key: navType.about,
    label: 'About'
},
];

const themeModeOptions = ref([
{
    label: 'Light Color',
    value: 'light',
}, {
    label: 'Dark Color',
    value: 'dark',
}, {
    label: 'Follow System',
    value: 'auto',
}
]);

onMounted(() => {
  if (themeMode.value == 'light') {
    theme.value = lightTheme;
    settingIconStyle.value = { filter: 'invert(0%)' }
  } else if (themeMode.value == 'dark') {
    theme.value = darkTheme;
    settingIconStyle.value = { filter: 'invert(70%)' }
  } else if (themeMode.value == 'auto') {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme.value = darkTheme;
      settingIconStyle.value = { filter: 'invert(70%)' }
    } else {
      theme.value = lightTheme;
      settingIconStyle.value = { filter: 'invert(0%)' }
    }
  }
})

const renderDropdownLabel = (option: DropdownOption) => {
  return h(ChatNavItem as Component, { navConfig: option });
};

const handleSelect = (key: string) => {
  switch (key) {
    case navType.chatService:
      {
        isShowChatServiceSelectModal.value = true;
        chatStore.checkAllSydneyConfig();
      }
      break;
    case navType.promptStore:
      {
        isShowPromptSotre.value = true;
      }
      break;
    case navType.setting:
      {
        userToken.value = userStore.getUserToken();
        userKievRPSSecAuth.value = userStore.getUserKievRPSSecAuth();
        userRwBf.value = userStore.getUserRwBf();
        userMUID.value = userStore.getUserMUID();
        history.value = historyEnable.value;
        cookiesEnable.value = fullCookiesEnable.value;
        if (cookiesEnable.value) { cookies.value = cookiesStr.value; }
        themeModeSetting.value = themeMode.value;
        isShowSettingModal.value = true;
      }
      break;
    case navType.advancedSetting:
      {
        history.value = historyEnable.value;
        themeModeSetting.value = themeMode.value;
        enterpriseSetting.value = enterpriseEnable.value;
        customChatNumSetting.value = customChatNum.value;
        gpt4tSetting.value = gpt4tEnable.value;
        sydneySetting.value = sydneyEnable.value;
        sydneyPromptSetting.value = sydneyPrompt.value;
        isShowAdvancedSettingModal.value = true;
        passServerSetting.value = passServer.value;
      }
      break;
    case navType.createImage:
      {
        if (!userStore.sysConfig?.isSysCK && !userStore.getUserToken()) {
          message.warning('Need to log in first to experience the drawing function');
        }
        isShowCreateImageModal.value = true;
      }
      break;
    case navType.reset:
      {
        isShowClearCacheModal.value = true;
      }
      break;
    case navType.about:
      {
        isShowSetAboutModal.value = true;
        GetLastVersion();
      }
      break;
    default:
      break;
  }
};
const resetCache = async () => {
  isShowClearCacheModal.value = false;
  await userStore.resetCache();
  message.success('Cleanup completed');
  window.location.href = '/';
};

const saveSetting = () => {
  if (cookiesEnable.value) {
    userStore.saveCookies(cookies.value);
    cookiesStr.value = cookies.value;
  } else {
    if (!userToken.value) {
      message.warning('Please fill in the user _U Cookie first');
    } else {
      userStore.saveUserToken(userToken.value);
    }
    if (!userKievRPSSecAuth.value) {
      message.warning('Please fill in the user KievRPSSecAuth Cookie first');
    } else {
      userStore.saveUserKievRPSSecAuth(userKievRPSSecAuth.value);
    }
    if (!userRwBf.value) {
      message.warning('Please fill in the user _RwBf Cookie first');
    } else {
      userStore.saveUserRwBf(userRwBf.value);
    }
    if (!userMUID.value) {
      message.warning('Please fill in the user MUID Cookie first');
    } else {
      userStore.saveUserMUID(userMUID.value);
    }
  }
  fullCookiesEnable.value = cookiesEnable.value;
  isShowSettingModal.value = false;
};

const saveAdvancedSetting = () => {
  historyEnable.value = history.value;
  const tmpEnterpris = enterpriseEnable.value;
  enterpriseEnable.value = enterpriseSetting.value;
  customChatNum.value = customChatNumSetting.value;
  const tmpGpt4t = gpt4tEnable.value, tmpSydney = sydneyEnable.value;
  gpt4tEnable.value = gpt4tSetting.value;
  sydneyEnable.value = sydneySetting.value;
  sydneyPrompt.value = sydneyPromptSetting.value;
  userStore.setPassServer(passServerSetting.value)

  const serpEle = document.querySelector('cib-serp');
  const sidepanel = serpEle?.shadowRoot?.querySelector('cib-conversation')?.querySelector('cib-side-panel')?.shadowRoot?.querySelector('.main')
  const threadsHeader = sidepanel?.querySelector('.threads-header') as HTMLElement;
  const threadsContainer = sidepanel?.querySelector('.threads-container') as HTMLElement;
  if (history.value && userStore.getUserToken() && !enterpriseEnable.value) {
    threadsHeader.style.display = 'flex'
    threadsContainer.style.display = 'block'
  } else {
    threadsHeader.style.display = 'none'
    threadsContainer.style.display = 'none'
  }

  themeMode.value = themeModeSetting.value;
  if (themeModeSetting.value == 'light') {
    CIB.changeColorScheme(0);
    theme.value = lightTheme;
    settingIconStyle.value = { filter: 'invert(0%)' }
  } else if (themeModeSetting.value == 'dark') {
    CIB.changeColorScheme(1);
    theme.value = darkTheme;
    settingIconStyle.value = { filter: 'invert(70%)' }
  } else if (themeModeSetting.value == 'auto') {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      CIB.changeColorScheme(1);
      theme.value = darkTheme;
      settingIconStyle.value = { filter: 'invert(70%)' }
    } else {
      CIB.changeColorScheme(0);
      theme.value = lightTheme;
      settingIconStyle.value = { filter: 'invert(0%)' }
    }
  }
  isShowAdvancedSettingModal.value = false;
  if (tmpEnterpris != enterpriseSetting.value || tmpSydney != sydneySetting.value || tmpGpt4t != gpt4tSetting.value) {
    window.location.href = '/';
  }
}

const autoPassCFChallenge = async () => {
  passingCFChallenge.value = true;
  let resq = await fetch('/pass', {
    credentials: 'include',
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "url": passServer.value,
    }),
  }).then((res) => res.json())
  .catch(() => {
    message.error('Robot verification failed, please try again');
    passingCFChallenge.value = false;
  })
  if (resq['result'] != null && resq['result'] != undefined) {
    userStore.saveCookies(resq['result']['cookies']);
    cookiesStr.value = resq['result']['cookies'];
    message.success('Automatically bypass robot verification successful');
    passingCFChallenge.value = false;
    window.location.href = '/';
  } else {
    message.error('Robot verification failed, please try again');
    passingCFChallenge.value = false;
  }
}
</script>


<template>
  <NConfigProvider :theme="theme">
    <NDropdown v-if="isMobile()" class="select-none" :show="isShowMore" :options="navConfigs" :render-label="renderDropdownLabel" @select="handleSelect">
      <NImage class="fixed top-6 right-4 cursor-pointer z-50" :src="settingSvgUrl" alt="Setting menu" :preview-disabled="true" @click="isShowMore = !isShowMore" :style="settingIconStyle"></NImage>
    </NDropdown>
    <NDropdown v-else class="select-none" trigger="hover" :options="navConfigs" :render-label="renderDropdownLabel" @select="handleSelect">
      <NImage class="fixed top-6 right-6 cursor-pointer z-50" :src="settingSvgUrl" alt="Setting menu" :preview-disabled="true" :style="settingIconStyle"></NImage>
    </NDropdown>
    <NModal v-model:show="isShowSettingModal" preset="dialog" :show-icon="false">
      <template #header>
        <div class="text-3xl py-2">Settings</div>
      </template>
      <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" style="margin-top: 16px;">
        <NFormItem path="cookiesEnable" label="Automatic robot verification">
          <NButton type="info" :loading="passingCFChallenge" @click="autoPassCFChallenge">Start</NButton>
        </NFormItem>
        <NFormItem path="cookiesEnable" label="Complete Cookie">
  <NSwitch v-model:value="cookiesEnable" />
  </NFormItem>
  <NFormItem v-show="!cookiesEnable" path="token" label="Token">
    <NInput size="large" v-model:value="userToken" type="text" placeholder="User Cookie, just need the value of _U" />
  </NFormItem>
  <NFormItem v-show="!cookiesEnable" path="token" label="KievRPSSecAuth">
    <NInput size="large" v-model:value="userKievRPSSecAuth" type="text" placeholder="User Cookie, just need the value of KievRPSSecAuth" />
  </NFormItem>
  <NFormItem v-show="!cookiesEnable" path="token" label="_RwBf">
    <NInput size="large" v-model:value="userRwBf" type="text" placeholder="User Cookie, just need the value of _RwBf" />
  </NFormItem>
  <NFormItem v-show="!cookiesEnable" path="token" label="MUID">
    <NInput size="large" v-model:value="userMUID" type="text" placeholder="User Cookie, just need the value of MUID" />
  </NFormItem>
  <NFormItem v-show="cookiesEnable" path="token" label="Cookies">
    <NInput size="large" v-model:value="cookies" type="text" placeholder="Complete User Cookie" />
  </NFormItem>
  </NForm>
      <template #action>
  <NButton size="large" @click="isShowSettingModal = false">Cancel</NButton>
  <NButton ghost size="large" type="info" @click="saveSetting">Save</NButton>
</template>
</NModal>
<NModal v-model:show="isShowAdvancedSettingModal" preset="dialog" :show-icon="false">
  <template #header>
    <div class="text-3xl py-2">Advanced Settings</div>
  </template>
  <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging"
    style="margin-top: 16px;">
    <NFormItem path="history" label="History">
      <NSwitch v-model:value="history" />
    </NFormItem>
    <NFormItem path="enterpriseEnable" label="Enterprise Version">
      <NSwitch v-model:value="enterpriseSetting" />
    </NFormItem>
    <NFormItem path="gpt4tEnable" label="GPT4 Turbo">
      <NSwitch v-model:value="gpt4tSetting" />
    </NFormItem>
    <NFormItem path="sydneyEnable" label="Jailbreak Mode">
      <NSwitch v-model:value="sydneySetting" />
    </NFormItem>
    <NFormItem path="sydneyPrompt" label="Robot Verification Server">
      <NInput size="large" v-model:value="passServerSetting" type="text" placeholder="Robot Verification Server" />
    </NFormItem>
    <NFormItem path="sydneyPrompt" label="Suggestion Word">
      <NInput size="large" v-model:value="sydneyPromptSetting" type="text" placeholder="Jailbreak Mode Suggestion Word" />
    </NFormItem>
    <NFormItem path="themeMode" label="Theme Mode">
      <NSelect v-model:value="themeModeSetting" :options="themeModeOptions" size="large" placeholder="Please select a theme mode" />
    </NFormItem>
    <NFormItem v-show="!cookiesEnable" path="customChatNum" label="Number of Chats">
      <NInputNumber size="large" v-model:value="customChatNumSetting" min="0" style="width: 100%;"/>
    </NFormItem>
      </NForm>
      <template #action>
  <NButton size="large" @click="isShowAdvancedSettingModal = false">Cancel</NButton>
  <NButton ghost size="large" type="info" @click="saveAdvancedSetting">Save</NButton>
  </template>
  </NModal>
  <NModal v-model:show="isShowClearCacheModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-xl py-2">Are you sure you want to delete all cache including Cookies?</div>
    </template>
    <template #action>
      <NButton size="large" @click="isShowClearCacheModal = false">Cancel</NButton>
      <NButton ghost size="large" type="error" @click="resetCache">Agree</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowSetAboutModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">About</div>
    </template>
    <NForm ref="formRef" label-placement="left" label-width="auto" size="small" style="margin-top: 16px;">
      <NFormItem path="" label="Version">
        <NTag type="info" size="small" round>{{ 'v' + localVersion }}</NTag>
      </NFormItem>
      <NFormItem path="" label="Latest Version">
        <NTag type="info" size="small" round>{{ lastVersion }}</NTag>
      </NFormItem>
      <NFormItem path="token" label="Open Source Address">
        <NButton text tag="a" href="https://github.com/chokiproai/AI-Copilot-EN" target="_blank" type="success">chokiproai/AI-Copilot-EN</NButton>
      </NFormItem>
      <NFormItem path="token" label="Original Author">
        <NButton text tag="a" href="https://github.com/adams549659584/go-proxy-bingai" target="_blank" type="success">adams549659584/go-proxy-bingai</NButton>
      </NFormItem>
      <NFormItem path="token" label="Origin Token">
        <NButton text tag="a" href="https://github.com/Harry-zklcdc/go-proxy-bingai" target="_blank" type="success">Harry-zklcdc/go-proxy-bingai</NButton>
      </NFormItem>
  </NForm>
<template #action>
  <NButton ghost size="large" @click="isShowSetAboutModal = false" type="info">Agree</NButton>
  </template>
  </NModal>
  <CreateImage v-model:show="isShowCreateImageModal" />
  </NConfigProvider>
</template>