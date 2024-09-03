<script setup lang="ts">
import { h, ref, onMounted, inject, defineComponent, render } from 'vue';
import { NDropdown, type DropdownOption, NModal, NInput, NInputNumber, NButton, NGrid, NGridItem, useMessage, NImage, NForm, NFormItem, NSwitch, NTag, NSelect, NSpin, NP, NA, NConfigProvider, NSpace, NRadio, NRadioGroup, NTooltip, NIcon, lightTheme, darkTheme, useOsTheme, type GlobalTheme } from 'naive-ui';
import conversationCssText from '@/assets/css/conversation.css?raw';
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
const isShowCookieModal = ref(false);
const isShowLoginModal = ref(false);
const isShowIframe = ref(false);
const userToken = ref('');
const userKievRPSSecAuth = ref('');
const userMUID = ref('');
const userRwBf = ref('');
const message = useMessage();
const promptStore = usePromptStore();
const { isShowPromptSotre } = storeToRefs(promptStore);
const isShowClearCacheModal = ref(false);
const isShowCreateImageModal = ref(false);
const chatStore = useChatStore();
const { isShowChatServiceSelectModal } = storeToRefs(chatStore);
const userStore = useUserStore();
const localVersion = __APP_INFO__.version;
const lastVersion = ref('loading...');
const { historyEnable, themeMode, uiVersion, langRegion, autoReopenMic, fullCookiesEnable, cookiesStr, enterpriseEnable, copilotProEnable, customChatNum, gpt4tEnable, sydneyEnable, sydneyPrompt, passServer } = storeToRefs(userStore);

let cookiesEnable = ref(false);
let cookies = ref('');
let history = ref(true);
let themeModeSetting = ref('auto');
let uiVersionSetting = ref('v3');
let langRegionSetting = ref('CN');
let theme = ref(inject('theme'));
let autoReopenMicSetting = ref(true);

let settingIconStyle = ref({
  filter: 'invert(70%)',
})
let passingCFChallenge = ref(false);
const enterpriseSetting = ref(false);
const copilotProSetting = ref(false);
const customChatNumSetting = ref(0);
const gpt4tSetting = ref(true);
const sydneySetting = ref(false);
const sydneyPromptSetting = ref('');
const passServerSetting = ref('');
const getCookieTip = ref('Get in cookies, please later ...');
const bingUrl = base58Decode('7RYHpA38gs3NAby2mkvoRMwjncBpS');

const oneKeyLogin = ref('false');
const loginTypeOptions = ref([
  {
    label: 'Account login',
    value: 'false',
  },
  {
    label: 'One click login',
    value: 'true',
  }
]);
const msLoginAccount = ref('');
const msLoginPassword = ref('');
const msLoginType = ref('passwd');
const msLoginCode = ref('');
const msLogining = ref(false);
const msContinueing = ref(false);
const msLoginTypeOptions = ref([
{
    label: 'Password login',
    value: 'passwd',
  },
  {
    label: 'Email Verification Code Login',
    value: 'email',
  },
  {
    label: '2FA login',
    value: 'device',
  }
])
const msLoginContext = ref({
  cookies: '',
  context: {}
});

const GetLastVersion = async () => {
  const res = await fetch('https://api.github.com/repos/chokiproai/AI-Copilot-EN/releases/latest');
  const json = await res.json();
  lastVersion.value = json.tag_name;
};

const navType = {
  login: 'login',
  setting: 'setting',
  chat: 'chat',
  notebook: 'notebook',
  compose: 'compose',
  createImage: 'createImage',
  reset: 'reset',
  about: 'about',
};
let navConfigs = ref([
  {
    key: navType.setting,
    label: 'set up',
  },
  {
    key: navType.notebook,
    label: 'notebook',
  },
  {
    key: navType.compose,
    label: 'Write an article',
    url: '/web/compose.html',
  },
  {
    key: navType.createImage,
    label: 'Image creation',
  },
  {
    key: navType.reset,
    label: 'One click reset',
  },
  {
    key: navType.about,
    label: 'about'
  },
]);

const themeModeOptions = ref([
  {
    label: 'Light',
    value: 'light',
  }, {
    label: 'Dark',
    value: 'dark',
  }, {
    label: 'Follow the system',
    value: 'auto',
  }
]);

const uiVersionOptions = ref([
  {
    label: 'V1',
    value: 'v1',
  },
  {
    label: 'V2',
    value: 'v2',
  },
  {
    label: 'V3',
    value: 'v3',
  }
]);

const langRegionOptions = ref([
  {
    label: 'English priority',
    value: 'US',
  }
]);

onMounted(() => {
  if (themeMode.value == 'light') {
    settingIconStyle.value = { filter: 'invert(0%)' }
  } else if (themeMode.value == 'dark') {
    settingIconStyle.value = { filter: 'invert(70%)' }
  } else if (themeMode.value == 'auto') {
    if (useOsTheme().value == 'dark') {
      settingIconStyle.value = { filter: 'invert(70%)' }
    } else {
      settingIconStyle.value = { filter: 'invert(0%)' }
    }
  }
})

const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const renderDropdownLabel = (option: DropdownOption) => {
  return h(ChatNavItem as Component, { navConfig: option });
};

const handleSelect = async (key: string) => {
  switch (key) {
    case navType.chat:
      {
        CIB.showConversation();
        navConfigs.value[1] = {
          key: navType.notebook,
          label: 'notebook',
        };
        const prjupyIndex = CIB.config.sydney.request.optionsSets.indexOf('prjupy');
        const galileoIndex = CIB.config.sydney.request.optionsSets.indexOf('clgalileo');
        CIB.config.sydney.request.optionsSets = CIB.config.sydney.request.optionsSets.slice(0, prjupyIndex);
        if (galileoIndex > -1) {
          CIB.config.sydney.request.optionsSets[galileoIndex] = 'galileo';
        }
        if (uiVersion.value == 'v3') {
          await sleep(25);
          await ChatHomeScreen.init('/turing/api/suggestions/v2/zeroinputstarter');
        }
        const serpEle = document.querySelector('cib-serp');
        const conversationEle = serpEle?.shadowRoot?.querySelector('cib-conversation') as HTMLElement;
        // todo Feedback is temporarily unavailable, remove first
        const welcomeEle = conversationEle?.shadowRoot?.querySelector('cib-welcome-container');
        const loginTip = welcomeEle?.shadowRoot?.querySelectorAll("div[class='muid-upsell']");
        if (loginTip?.length) {
          loginTip.forEach((ele) => {
            ele.remove();
          });
        }
        welcomeEle?.shadowRoot?.querySelector('.preview-container')?.remove();
        welcomeEle?.shadowRoot?.querySelector('.footer')?.remove();
        serpEle?.shadowRoot?.querySelector('cib-serp-feedback')?.remove();
        if (isMobile()) {
          welcomeEle?.shadowRoot?.querySelector('.container-item')?.remove();
          CIB.vm.actionBar.input.placeholder = 'If you have any questions, ask me ... ("/" trigger prompt)';
        }
        // 加入css
        const conversationStyleEle = document.createElement('style');
        conversationStyleEle.innerText = conversationCssText;
        conversationEle.shadowRoot?.append(conversationStyleEle);
      }
      break;
    case navType.notebook:
      {
        CIB.showNotebook();
        const galileoIndex = CIB.config.sydney.request.optionsSets.indexOf('galileo');
        if (galileoIndex > -1) {
          CIB.config.sydney.request.optionsSets[galileoIndex] = 'clgalileo';
        }
        CIB.config.sydney.request.optionsSets.push('prjupy', 'uprofdeuv1', 'uprofupdv2', 'gndlogcf');
        navConfigs.value[1] = {
          key: navType.chat,
          label: 'chat',
        };
        await sleep(25);
        const serpEle = document.querySelector('cib-serp');
        const notebook = serpEle?.shadowRoot?.querySelector('cib-notebook');
        const disclaimer = notebook?.shadowRoot?.querySelector('cib-ai-disclaimer');
        disclaimer?.shadowRoot?.querySelector('div')?.remove();
        disclaimer?.shadowRoot?.querySelector('div')?.remove();
      }
      break;
    case navType.setting:
      {
        isShowSettingModal.value = true;
      }
      break;
    case navType.createImage:
      {
        if (!userStore.sysConfig?.isSysCK && !userStore.getUserToken()) {
          message.warning('Experience drawing function needs to be logged in first');
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
        await sleep(25)
        const ele = document.createElement('div');
        render(h(NConfigProvider, { theme: theme.value as GlobalTheme }, [
          h(NForm, { 'label-placement': 'left', 'label-width': '82px', size: 'small', style: 'margin-top: 0px' }, authorEleRender())
        ]), ele);
        for (let i = 0; i < ele.childNodes.length; i++) {
          document.getElementById('latestVersion')?.parentNode?.appendChild(ele.childNodes[i]);
        }
      }
      break;
    default:
      break;
  }
};

const settingMenu = (key: string) => {
  switch(key) {
    case 'autoPassCFChallenge':
      {
      autoPassCFChallenge()
      }
      break;
    case 'login':
      {
        isShowLoginModal.value = true;
        isShowIframe.value = false;
      }
      break;
    case 'chatService':
      {
        isShowChatServiceSelectModal.value = true;
        chatStore.checkAllSydneyConfig();
      }
      break;
    case 'cookieSetting':
      {
        userToken.value = userStore.getUserToken();
        userKievRPSSecAuth.value = userStore.getUserKievRPSSecAuth();
        userMUID.value = userStore.getUserMUID();
        userRwBf.value = userStore.getUserRwBf();
        history.value = historyEnable.value;
        cookiesEnable.value = fullCookiesEnable.value;
        cookies.value = cookiesStr.value;
        isShowCookieModal.value = true;
      }
      break;
    case 'promptStore':
      {
        isShowPromptSotre.value = true;
      }
      break;
    case 'advancedSetting':
      {
        history.value = historyEnable.value;
        themeModeSetting.value = themeMode.value;
        uiVersionSetting.value = uiVersion.value;
        langRegionSetting.value = langRegion.value;
        copilotProSetting.value = copilotProEnable.value;
        enterpriseSetting.value = enterpriseEnable.value;
        customChatNumSetting.value = customChatNum.value;
        gpt4tSetting.value = gpt4tEnable.value;
        autoReopenMicSetting.value = autoReopenMic.value;
        sydneySetting.value = sydneyEnable.value;
        sydneyPromptSetting.value = sydneyPrompt.value;
        passServerSetting.value = passServer.value;
        isShowAdvancedSettingModal.value = true;
      }
      break;
    default:
      return;
  }
}

const resetCache = async () => {
  isShowClearCacheModal.value = false;
  await userStore.resetCache();
  message.success('Clean up');
  window.location.href = '/';
};

const saveSetting = () => {
  if (cookiesEnable.value) {
    userStore.saveCookies(cookies.value);
    cookiesStr.value = cookies.value;
  } else {
    if (!userToken.value) {
      message.warning('Please fill in the user first_u cookie');
    } else {
      userStore.saveUserToken(userToken.value);
    }
    if (!userKievRPSSecAuth.value) {
      message.warning('Please fill in the user Kievrpssecauth Cookie first');
    } else {
      userStore.saveUserKievRPSSecAuth(userKievRPSSecAuth.value);
    }
    if (!userRwBf.value) {
      message.warning('Please fill in the user_RWBF COOKIE');
    } else {
      userStore.saveUserRwBf(userRwBf.value);
    }
    if (!userMUID.value) {
      message.warning('Please fill in the user MUID COOKIE first');
    } else {
      userStore.saveUserMUID(userMUID.value);
    }
  }
  fullCookiesEnable.value = cookiesEnable.value;
  isShowCookieModal.value = false;
};

const saveAdvancedSetting = () => {
  historyEnable.value = history.value;
  const tmpEnterpris = enterpriseEnable.value;
  enterpriseEnable.value = enterpriseSetting.value;
  customChatNum.value = customChatNumSetting.value;
  const tmpGpt4t = gpt4tEnable.value, tmpSydney = sydneyEnable.value, tmpuiVersion = uiVersion.value, tmpCopilotPro = copilotProEnable.value;
  copilotProEnable.value = copilotProSetting.value;
  gpt4tEnable.value = gpt4tSetting.value;
  autoReopenMic.value = autoReopenMicSetting.value;
  sydneyEnable.value = sydneySetting.value;
  sydneyPrompt.value = sydneyPromptSetting.value;
  uiVersion.value = uiVersionSetting.value;
  if (passServerSetting.value && passServerSetting.value.startsWith('http')) {
    userStore.setPassServer(passServerSetting.value)
  }
  if (langRegion.value != langRegionSetting.value) {
    langRegion.value = langRegionSetting.value;
    _G.Region = langRegionSetting.value;
  }

  const serpEle = document.querySelector('cib-serp');
  const sidepanel = serpEle?.shadowRoot?.querySelector('cib-conversation')?.querySelector('cib-side-panel')?.shadowRoot?.querySelector('.main')
  const threadsHeader = sidepanel?.querySelector('.threads-header') as HTMLElement;
  const threadsContainer = sidepanel?.querySelector('.threads-container') as HTMLElement;
  if (!isMobile()) {
    if (history.value && userStore.getUserToken() && !enterpriseEnable.value) {
      if (tmpuiVersion === 'v1') {
        CIB.vm.sidePanel.panels = [
          { type: 'threads', label: 'Recent activity' },
          { type: 'plugins', label: 'Plugin' }
        ]
      } else {
        threadsHeader.style.display = 'flex'
        threadsContainer.style.display = 'block'
      }
    } else {
      if (tmpuiVersion === 'v2') {
        threadsHeader.style.display = 'none'
        threadsContainer.style.display = 'none'
      } else {
        CIB.vm.sidePanel.panels = [
          { type: 'plugins', label: 'Plugin' }
        ]
        CIB.vm.sidePanel.selectedPanel = 'plugins'
      }
    }
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
    if (useOsTheme().value == 'dark') {
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
  if (tmpEnterpris != enterpriseSetting.value || tmpSydney != sydneySetting.value || tmpGpt4t != gpt4tSetting.value || tmpuiVersion != uiVersionSetting.value || tmpCopilotPro != copilotProSetting.value) {
    window.location.href = '/';
  }
}

const newWindow = () => {
  window.open("/fd/auth/signin?action=interactive&provider=windows_live_id&return_url=https%3a%2f%2fwww.bing.com%2fchat%3fq%3dBing%2bAI%26FORM%3dhpcodx%26wlsso%3d1%26wlexpsignin%3d1&src=EXPLICIT&sig=001DD71D5A386F753B1FC3055B306E8F", "_blank");
}

const loginHandel = async ()=> {
  isShowIframe.value = true;
  getCookieTip.value = 'Get in cookies, please later ...';
  window.addEventListener('message', function (e) {
    const d = e.data
    if (d.cookies != "" && d.cookies != null && d.cookies != undefined) {
      userStore.saveCookies(d.cookies);
      cookiesStr.value = d.cookies;
      message.success('Successful login');
      isShowLoginModal.value = false;
      window.location.href = '/';
    }
  })
  await sleep(1500);
  getCookieTimeoutHandel();
  const iframe = document.getElementById('login');
  const S = base58Decode(_G.S);
  let tmpA = [];
  for (let i = 0; i < _G.SP.length; i++) {
    tmpA.push(S[_G.SP[i]]);
  }
  const e = base58Decode(tmpA.join(''));
  (iframe as any).contentWindow.postMessage({
    IG: _G.IG,
    T: await aesEncrypt(e, _G.IG),
  }, '*');
}

const msLoginHandel = async () => {
  msLogining.value = true;
  switch (msLoginType.value) {
    case 'passwd':
      {
        if (!msLoginAccount.value) {
          message.warning('Please fill in the account first');
          msLogining.value = false;
          break;
        } else if (!msLoginPassword.value) {
          message.warning('Please fill in the password first');
          msLogining.value = false;
          break;
        }
        const res = await fetch('/api/ms/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: msLoginAccount.value,
            password: msLoginPassword.value,
            type: msLoginType.value,
          })
        })
        if (!res.ok) {
          message.error('Log in to log in, please try it out');
          msLogining.value = false;
          break;
        }
        message.success('Successful login');
        isShowLoginModal.value = false;
        const resData = await res.json();
        userStore.saveCookies(resData.data.cookies);
        cookiesStr.value = resData.data.cookies;
        fullCookiesEnable.value = true;
        window.location.href = '/';
      }
      break;
    case 'email':
      {
        if (!msLoginAccount.value) {
          message.warning('Please fill in the account first');
          msLogining.value = false;
          break;
        }
        const res = await fetch('/api/ms/login', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: msLoginAccount.value,
            type: msLoginType.value,
            verify_code: msLoginCode.value,
            cookies: msLoginContext.value.cookies,
            context: msLoginContext.value.context,
          }),
        })
        if (!res.ok) {
          message.error('Log in to log in, please try it out');
          msLogining.value = false;
          break;
        }
        message.success('Successful login');
        isShowLoginModal.value = false;
        const resData = await res.json();
        userStore.saveCookies(resData.data.cookies);
        cookiesStr.value = resData.data.cookies;
        fullCookiesEnable.value = true;
        window.location.href = '/';
      }
      break;
    case 'device':
      {
        if (!msLoginAccount.value) {
          message.warning('Please fill in the account first');
          msLogining.value = true;
          break;
        }
        const res = await fetch('/api/ms/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: msLoginAccount.value,
            type: msLoginType.value,
          })
        })
        const resData = await res.json();
        if (res.status != 201) {
          message.error('Get 2FA failure, please try again');
          msLogining.value = false;
          break;
        }
        message.success('Get 2FA success, please check and enter the verification code on your mobile phone');
        msLoginCode.value = resData.data.code;
        msLoginContext.value.cookies = resData.data.cookies;
        msLoginContext.value.context = resData.data.context;
        await msLoginContinueHandel();
      }
      break;
    default:
      msLogining.value = false;
      break;
  }
}

const msLoginContinueHandel = async () => {
  msContinueing.value = true;
  switch (msLoginType.value) {
    case 'email':
      {
        if (!msLoginAccount.value) {
          message.warning('Please fill in the account first');
          msLogining.value = true;
          break;
        }
        const res = await fetch('/api/ms/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: msLoginAccount.value,
            type: msLoginType.value,
          })
        })
        if (res.status != 201) {
          message.error('Obtaining the mailbox verification code failed, please try it out');
          msContinueing.value = false;
          break;
        }
        message.success('Get the mailbox verification code successfully, please check the mailbox');
        msContinueing.value = false;
        const resData = await res.json();
        msLoginContext.value.cookies = resData.data.cookies;
        msLoginContext.value.context = resData.data.context;
      }
      break;
    case 'device':
      {
        if (!msLoginAccount.value) {
          message.warning('Please fill in the account first');
          msLogining.value = true;
          break;
        }
        const res = await fetch('/api/ms/login', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: msLoginAccount.value,
            type: msLoginType.value,
            cookies: msLoginContext.value.cookies,
            context: msLoginContext.value.context,
          }),
        })
        if (!res.ok) {
          message.error('Get 2FA failure, please try again');
          msLogining.value = false;
          break;
        }
        message.success('Successful login');
        isShowLoginModal.value = false;
        const resData = await res.json();
        userStore.saveCookies(resData.data.cookies);
        cookiesStr.value = resData.data.cookies;
        fullCookiesEnable.value = true;
        window.location.href = '/';
      }
      break;
    default:
      msContinueing.value = false;
      break;
  }
}

const authorEleRender = () => {
  const data = JSON.parse(decodeURI(base58Decode(_G.TP)));
  let r = []
  for (let i = 0; i < data.length; i++) {
    r.push(renderHandler(data[i]))
  }
  return r;
}

const renderHandler = (ele: any) => {
  return h(eval(ele.type), ele.props, ele.children.map((child: any) => {
    if (child.type) {
      return renderHandler(child);
    } else {
      return child;
    }
  }));
}

const getCookieTimeoutHandel = async() => {
  await sleep(3000)
  getCookieTip.value = 'To get cookie for too long, please check whether the oil monkey plug -in and scripts are installed correctly';
}

const autoPassCFChallenge = async () => {
  let resq = await fetch('/pass', {
    credentials: 'include',
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'IG': _G.IG,
      'T': await aesEncrypt(_G.AT, _G.IG),
    }),
  }).then((res) => res.json())
  .catch(() => {
    message.error('Human -machine verification failed, please try it out');
    passingCFChallenge.value = false;
  })
  if (resq['result'] != null && resq['result'] != undefined) {
    userStore.saveCookies(resq['result']['cookies']);
    cookiesStr.value = resq['result']['cookies'];
    message.success('Automatically pass human -machine verification success');
    passingCFChallenge.value = false;
    window.location.href = '/';
  } else {
    message.error('Human -machine verification failed, please try it out');
    passingCFChallenge.value = false;
  }
}
</script>

<template>
  <NDropdown v-if="isMobile()" class="select-none" :show="isShowMore" :options="navConfigs" :render-label="renderDropdownLabel" @select="handleSelect">
    <NImage class="fixed top-6 right-4 cursor-pointer z-50" :src="settingSvgUrl" alt="Set up menu" :preview-disabled="true" @click="isShowMore = !isShowMore" :style="settingIconStyle"></NImage>
  </NDropdown>
  <NDropdown v-else class="select-none" trigger="hover" :options="navConfigs" :render-label="renderDropdownLabel" @select="handleSelect">
    <NImage class="fixed top-6 right-6 cursor-pointer z-50" :src="settingSvgUrl" alt="Set up menu" :preview-disabled="true" :style="settingIconStyle"></NImage>
  </NDropdown>
  <NModal v-model:show="isShowLoginModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">Account login</div>
    </template>
    <NSelect v-model:value="oneKeyLogin" :options="loginTypeOptions" size="large" placeholder="Select login method" />
    <div v-if="oneKeyLogin == 'true'">
      <div v-if="!isShowIframe" style="margin-top:12px; margin-bottom:24px">
        <NP>
          Before using this function, please install it first<NA href="https://www.tampermonkey.net/">Oil monkey plug -in</NA>, Install<NA href="https://greasyfork.org/en-US/scripts/487409-go-proxy-bingai">This script</NA>
          <br>
          Please click the "Open the Login Page" button below, log in to the account in the new login page, and click OK after the login is successful.
        </NP>
      </div>
      <div v-else>
        <NSpin size="large" :description="getCookieTip" style="margin: 0 auto; width: 100%" />
        <iframe id="login" :src="bingUrl" style="border: none; width: 0; height: 0" />
      </div>
    </div>
    <div v-else>
      <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" style="margin-top: 16px;">
        <NFormItem path="cookiesEnable" label="Login method">
          <NRadioGroup v-model:value="msLoginType">
            <NSpace vertical>
              <NRadio v-for="item in msLoginTypeOptions" size="large" :key="item.value" :value="item.value">{{ item.label }}</NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <NFormItem path="account" label="account">
          <NInput size="large" v-model:value="msLoginAccount" type="text" placeholder="account" />
        </NFormItem>
        <NFormItem v-show="msLoginType === 'passwd'" path="password" label=" password">
          <NInput size="large" v-model:value="msLoginPassword" type="password" show-password-on="click" placeholder="password" />
        </NFormItem>
        <NFormItem v-show="msLoginType !== 'passwd'" path="verify_code" label="Verification code">
          <NInput size="large" v-model:value="msLoginCode" type="text" placeholder="Verification code" :disabled="msLoginType === 'device'" />
        </NFormItem>
      </NForm>
    </div>
    <template #action>
      <NButton v-show="oneKeyLogin == 'true'" size="large" type="info" @click="newWindow">Open the login page</NButton>
      <NButton v-show="oneKeyLogin == 'true'" size="large" @click="isShowLoginModal = false">Cancel</NButton>
      <NButton v-show="oneKeyLogin == 'true'" ghost size="large" type="info" @click="loginHandel">Sure</NButton>
      <NButton v-show="oneKeyLogin != 'true' && msLoginType === 'email'" size="large" type="info" :loading="msContinueing" @click="msLoginContinueHandel">Get mailbox verification code</NButton>
      <NButton v-show="oneKeyLogin != 'true'" ghost size="large" type="info" :loading="msLogining" @click="msLoginHandel">Sure</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowSettingModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">set up</div>
    </template>
    <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" style="margin-top: 16px;">
      <NGrid x-gap="0" :cols="2">
        <NGridItem>
          <NFormItem path="cookiesEnable" label="Automotive Machine Verification">
            <NTooltip>
              <template #trigger>
                <NButton type="info" :loading="passingCFChallenge" @click="settingMenu('autoPassCFChallenge')">Start up</NButton>
              </template>
              The old version of the human -machine verification, it has been fully automatically passed now
            </NTooltip>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="cookiesEnable" label="Account login">
            <NButton type="info" @click="settingMenu('login')">Open</NButton>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="cookiesEnable" label="Service option">
            <NButton type="info" @click="settingMenu('chatService')">Open</NButton>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="cookiesEnable" label="Cookie settings">
            <NButton type="info" @click="settingMenu('cookieSetting')">Open</NButton>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="cookiesEnable" label="Reminder">
            <NButton type="info" @click="settingMenu('promptStore')">Open</NButton>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="cookiesEnable" label="High -level settings">
            <NButton type="info" @click="settingMenu('advancedSetting')">Open</NButton>
          </NFormItem>
        </NGridItem>
      </NGrid>
    </NForm>
    <template #action>
      <NButton ghost size="large" type="info" @click="isShowSettingModal = false">Sure</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowCookieModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">Cookie settings</div>
    </template>
    <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" style="margin-top: 16px;">
      <NFormItem path="cookiesEnable" label="Complete Cookie">
        <NSwitch v-model:value="cookiesEnable" />
      </NFormItem>
      <NFormItem v-show="!cookiesEnable" path="token" label="Token">
        <NInput size="large" v-model:value="userToken" type="text" placeholder="User cookies, only the value of _U" />
      </NFormItem>
      <NFormItem v-show="!cookiesEnable" path="token" label="KievRPSSecAuth">
        <NInput size="large" v-model:value="userKievRPSSecAuth" type="text" placeholder="User cookies, only the value of Kievrpssecauth" />
      </NFormItem>
      <NFormItem v-show="!cookiesEnable" path="token" label="_RwBf">
        <NInput size="large" v-model:value="userRwBf" type="text" placeholder="User cookies, only the value of _RWBF" />
      </NFormItem>
      <NFormItem v-show="!cookiesEnable" path="token" label="MUID">
        <NInput size="large" v-model:value="userMUID" type="text" placeholder="User cookies, only the value of MUID" />
      </NFormItem>
      <NFormItem v-show="cookiesEnable" path="token" label="Cookies">
        <NInput size="large" v-model:value="cookies" type="text" placeholder="Complete user Cookie" />
      </NFormItem>
    </NForm>
    <template #action>
      <NButton size="large" @click="isShowCookieModal = false">Cancel</NButton>
      <NButton ghost size="large" type="info" @click="saveSetting">Keep</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowAdvancedSettingModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">High -level settings</div>
    </template>
    <NForm ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging"
      style="margin-top: 16px;">
      <NGrid x-gap="0" :cols="2">
        <NGridItem>
          <NFormItem path="history" label="Historical record">
            <NSwitch v-model:value="history" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="enterpriseEnable" label="Corporate version">
            <NSwitch v-model:value="enterpriseSetting" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="copilotProEnable">
            <template #label>
              Copilot Pro
              <NTooltip trigger="hover">
                <template #trigger>
                  <NIcon size="14" style="top: 2px;">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200s200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 1 1-26 26a26 26 0 0 1 26-26zm64 226H200v-32h44v-88h-32v-32h64v120h44z" fill="currentColor"></path></svg>
                  </NIcon>
                </template>
                If there is an account of the Copilot Pro, you can open this option
              </NTooltip>
            </template>
            <NSwitch v-model:value="copilotProSetting" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="sydneyEnable" label="Continuous voice dialogue">
            <NSwitch v-model:value="autoReopenMicSetting" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="gpt4tEnable">
            <template #label>
              Copilot enhancement
              <NTooltip trigger="hover" :style="{ maxWidth: '240px' }">
                <template #trigger>
                  <NIcon size="14" style="top: 2px;">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200s200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 1 1-26 26a26 26 0 0 1 26-26zm64 226H200v-32h44v-88h-32v-32h64v120h44z" fill="currentColor"></path></svg>
                  </NIcon>
                </template>
                The ability to enhance the Microsoft Copilot may cause some problems
              </NTooltip>
            </template>
            <NSwitch v-model:value="gpt4tSetting" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="sydneyEnable" label="Jailbreak">
            <NSwitch v-model:value="sydneySetting" />
          </NFormItem>
        </NGridItem>
      </NGrid>
      <NFormItem path="langRegion" label="Language understanding">
        <NSelect v-model:value="langRegionSetting" :options="langRegionOptions" size="large" placeholder="Language understanding" />
      </NFormItem>
      <NFormItem path="sydneyPrompt" label="Human -machine verification server">
        <NInput size="large" v-model:value="passServerSetting" type="text" placeholder="Human -machine verification server" />
      </NFormItem>
      <NFormItem path="sydneyPrompt" label="Reminder">
        <NInput size="large" v-model:value="sydneyPromptSetting" type="text" placeholder="Prison mode reminder word" />
      </NFormItem>
      <NFormItem path="themeMode" label="UI version">
        <NSelect v-model:value="uiVersionSetting" :options="uiVersionOptions" size="large" placeholder="Please select UI version" />
      </NFormItem>
      <NFormItem path="themeMode" label="Theme mode">
        <NSelect v-model:value="themeModeSetting" :options="themeModeOptions" size="large" placeholder="Please select the theme mode" />
      </NFormItem>
      <NFormItem v-show="!cookiesEnable" path="customChatNum" label="Number of chat">
        <NInputNumber size="large" v-model:value="customChatNumSetting" min="0" style="width: 100%;"/>
      </NFormItem>
    </NForm>
    <template #action>
      <NButton size="large" @click="isShowAdvancedSettingModal = false">Cancel</NButton>
      <NButton ghost size="large" type="info" @click="saveAdvancedSetting">Keep</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowClearCacheModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-xl py-2">Will delete all the cache including cookies？</div>
    </template>
    <template #action>
      <NButton size="large" @click="isShowClearCacheModal = false">Cancel</NButton>
      <NButton ghost size="large" type="error" @click="resetCache">Sure</NButton>
    </template>
  </NModal>
  <NModal v-model:show="isShowSetAboutModal" preset="dialog" :show-icon="false">
    <template #header>
      <div class="text-3xl py-2">about</div>
    </template>
    <NForm ref="formRef" label-placement="left" label-width="82px" size="small" style="margin-top: 16px;">
      <NFormItem path="version" label="Version number">
        <NTag type="info" size="small" round>{{ 'v' + localVersion }}</NTag>
      </NFormItem>
      <NFormItem label="Open Source">
        <a href="https://github.com/chokiproai/AI-Copilot-EN" target="_blank">AI-Copilot by Chokiproai</a>
      </NFormItem>
      <NFormItem path="latestVersion" label="Latest version" id="latestVersion" ref="latestVersion">
        <NTag type="info" size="small" round>{{ lastVersion }}</NTag>
      </NFormItem>
    </NForm>
    <template #action>
      <NButton ghost size="large" @click="isShowSetAboutModal = false" type="info">Sure</NButton>
    </template>
  </NModal>
  <CreateImage v-model:show="isShowCreateImageModal" />
</template>