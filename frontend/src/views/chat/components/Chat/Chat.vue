<script setup lang="ts">
import { onMounted, ref, computed, h } from 'vue';
import { NEmpty, NButton, useDialog, useMessage, NResult, NInput, NAlert, NModal, NPopover, NVirtualList} from 'naive-ui';
import conversationCssText from '@/assets/css/conversation.css?raw';
import { usePromptStore, type IPrompt } from '@/stores/modules/prompt';
import { storeToRefs } from 'pinia';
import ChatPromptItem from './ChatPromptItem.vue';
import { isMobile } from '@/utils/utils';
import cookies from '@/utils/cookies';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue';
import { ApiResultCode } from '@/api/model/ApiResult';
import type { SysConfig } from '@/api/model/sysconf/SysConfig';
import { useChatStore } from '@/stores/modules/chat';
import ChatServiceSelect from '@/components/ChatServiceSelect/ChatServiceSelect.vue';
import { useUserStore } from '@/stores/modules/user';

const message = useMessage();
const dialog = useDialog();
(window as any).$dialog = dialog;

const isShowLoading = ref(true);

const promptStore = usePromptStore();
const { isShowPromptSotre, isShowChatPrompt, keyword, promptList, searchPromptList, selectedPromptIndex } = storeToRefs(promptStore);

const chatStore = useChatStore();
const { isShowChatServiceSelectModal, sydneyConfigs, selectedSydneyBaseUrl } = storeToRefs(chatStore);

const userStore = useUserStore();

const scrollbarRef = ref<{
  scrollToIndex: (index: number) => {};
  getOffset: () => number;
  getClientSize: () => number;
  getScrollSize: () => number;
}>();
const isInput = ref(false);
const isPromptScrolling = ref(false);
const promptItemHeight = 130;

const isShowUnauthorizedModal = ref(false);
const authKey = ref('');
const isAuthBtnLoading = ref(false);

const isShowHistory = computed(() => {
  return (CIB.vm.isMobile && CIB.vm.sidePanel.isVisibleMobile) || (!CIB.vm.isMobile && CIB.vm.sidePanel.isVisibleDesktop);
});

const { themeMode, uiVersion, gpt4tEnable, sydneyEnable, sydneyPrompt, enterpriseEnable, copilotProEnable } = storeToRefs(userStore);

onMounted(async () => {
  await initChat();
  hackDevMode();
  // CIB.vm.isMobile = isMobile();
  // show conversion
  await SydneyFullScreenConv.initWithWaitlistUpdate({ cookLoc: {} }, 10);
  if (isMobile()) {
    const serpEle = document.querySelector('cib-serp');
    serpEle?.setAttribute('mobile', '');
  }
  if (uiVersion.value === 'v3') {
    await sj_evt.bind('chs_init', () => {
      ChatHomeScreen.init('/turing/api/suggestions/v2/zeroinputstarter');
    }, true);
  }
  initSysConfig();

  isShowLoading.value = false;
  hackStyle();
  hackEnterprise();
  initSydney();
  initChatPrompt();

  // set Theme
  if (themeMode.value == 'light') {
    CIB.changeColorScheme(0);
  } else if (themeMode.value == 'dark') {
    CIB.changeColorScheme(1);
  } else if (themeMode.value == 'auto') {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      CIB.changeColorScheme(1);
    } else {
      CIB.changeColorScheme(0);
    }
  }
});

const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const hackDevMode = () => {
  if (import.meta.env.DEV) {
    CIB.manager.chat.api.bing._endpoint = location.origin;
  }
};

const initChatService = () => {
  if (selectedSydneyBaseUrl.value) {
    CIB.config.sydney.baseUrl = selectedSydneyBaseUrl.value;
    isShowChatServiceSelectModal.value = false;
  } else {
    isShowChatServiceSelectModal.value = true;
    selectedSydneyBaseUrl.value = CIB.config.sydney.baseUrl;
    const isCus = sydneyConfigs.value.filter((x) => !x.isCus).every((x) => x.baseUrl !== selectedSydneyBaseUrl.value);
    if (isCus) {
      const cusSydneyConfig = sydneyConfigs.value.find((x) => x.isCus);
      if (cusSydneyConfig) {
        cusSydneyConfig.baseUrl = selectedSydneyBaseUrl.value;
      }
    }
    chatStore.checkAllSydneyConfig();
  }
};

const initSysConfig = async () => {
  const S = base58Decode(_G.S);
  let tmpA = [];
  for (let i = 0; i < _G.SP.length; i++) {
    tmpA.push(S[_G.SP[i]]);
  }
  const token = base58Decode(tmpA.join(''));
  if (token != _G.AT) {
    dialog.warning({
      title: decodeURI(base58Decode(_G.TIP)),
      content: decodeURI(base58Decode(_G.TIPC)),
      maskClosable: false,
      closable: false,
      closeOnEsc: false,
    });
  }
  const res = await userStore.getSysConfig();
  switch (res.code) {
    case ApiResultCode.OK:
      {
        if (!res.data.isAuth) {
          isShowUnauthorizedModal.value = true;
          return;
        }
        await afterAuth(res.data);
        let MATD_Cookie = cookies.get('MicrosoftApplicationsTelemetryDeviceId');
        if (MATD_Cookie == '' || MATD_Cookie == null) {
          MATD_Cookie = crypto.randomUUID();
          cookies.set('MicrosoftApplicationsTelemetryDeviceId', MATD_Cookie, 60, '/');
        }
        let RWBF_Cookie = userStore.getUserRwBf();
        if (RWBF_Cookie != '') {
          let RWBFs = RWBF_Cookie.split('&');
          for (let i = 0; i < RWBFs.length; i++) {
            if (RWBFs[i].startsWith('wls=')) {
              RWBFs[i] = 'wls=2';
            }
          }
          RWBF_Cookie = RWBFs.join('&');
          userStore.saveUserRwBf(RWBF_Cookie);
        }
        if (res.data.info != '') {
          const info = JSON.parse(res.data.info);
          message.create(info['content'], {
            type: info['type'],
            keepAliveOnHover: true,
            showIcon: true,
            render: (props) => {
              return h(
                NAlert,
                {
                  closable: true,
                  type: props.type === 'loading' ? 'default' : props.type,
                  title: info['title'],
                  style: {
                    boxShadow: 'var(--n-box-shadow)',
                    maxWidth: 'calc(100vw - 32px)',
                    width: '360px',
                    position: 'fixed',
                    top: '20px',
                    right: '12px',
                  }
                },
                {
                  default: () => props.content
                }
              )
            }
          });
        }
      }
      break;
    case ApiResultCode.UnLegal:
      {
        _G.SB = true
        dialog.warning({
          title: decodeURI(base58Decode(_G.TIP)),
          content: decodeURI(base58Decode(_G.TIPC)),
          maskClosable: false,
          closable: false,
          closeOnEsc: false,
        });
      }
      break;
    default:
      message.error(`[${res.code}] ${res.message}`);
      break;
  }
};

const afterAuth = async (data: SysConfig) => {
  if (!data.isSysCK) {
    await userStore.checkUserToken();
  }
  initChatService();
};

const initChat = async () => {
  return new Promise((resolve, reject) => {
    sj_evt.bind('sydFSC.init', resolve, true);
    sj_evt.fire('showSydFSC');
  });
};

const hackStyle = async() => {
  if (location.hostname === 'localhost') {
    CIB.config.sydney.hostnamesToBypassSecureConnection = CIB.config.sydney.hostnamesToBypassSecureConnection.filter((x) => x !== location.hostname);
  }
  if (isMobile()) {
    await sleep(25);
  }
  const serpEle = document.querySelector('cib-serp');
  const conversationEle = serpEle?.shadowRoot?.querySelector('cib-conversation') as HTMLElement;
  // todo 反馈暂时无法使用，先移除
  const welcomeEle = conversationEle?.shadowRoot?.querySelector('cib-welcome-container');
  const loginTip = welcomeEle?.shadowRoot?.querySelectorAll("div[class='muid-upsell']");
  if (loginTip?.length) {
    loginTip.forEach((ele) => {
      ele.remove();
    });
  }
  welcomeEle?.shadowRoot?.querySelector('.preview-container')?.remove();
  welcomeEle?.shadowRoot?.querySelector('.footer')?.remove();
  // welcomeEle?.shadowRoot?.querySelector('.controls')?.setAttribute('style', 'margin-bottom: 80px;');
  serpEle?.shadowRoot?.querySelector('cib-serp-feedback')?.remove();
  if (isMobile()) {
    welcomeEle?.shadowRoot?.querySelector('.container-item')?.remove();
    CIB.vm.actionBar.input.placeholder = 'Ask me a question... ("/" to activate suggestions)';
  }
  // 加入css
  const conversationStyleEle = document.createElement('style');
  conversationStyleEle.innerText = conversationCssText;
  conversationEle.shadowRoot?.append(conversationStyleEle);
};

interface IActionBarElement extends HTMLElement {
  handleInputTextKey: (ev: KeyboardEvent) => void;
}

const hackEnterprise = () => {
  if (enterpriseEnable.value) {
    CIB.config.bingAtWork.isBingChatForEnterpriseEnabled = true;
    CIB.config.bingAtWork.chatType = "enterprise";
  }
}

const initSydney = () => {
  if (copilotProEnable.value) {
    hackCopilotPro();
  }
  if (gpt4tEnable.value) {
    hackG4t();
  }
  if (sydneyEnable.value) {
    hackSydney();

    CIB.manager.resetConversation = function (O, B=!0, U=!0) {
      var G;
      null === (G = CIB.manager.log) || void 0 === G || G.trace(this, CIB.manager.resetConversation, null).write(),
      CIB.manager.chat.cancelPendingRequest(),
      CIB.manager.finalizeResetConversation(O, B, U);
      hackSydney(false);
    }
  }
}

const hackCopilotPro = () => {
  CIB.config.sydney.request.source = 'cib-ccp'
}

const hackG4t = () => {
  CIB.config.sydney.request.optionsSets.push(
    "dlgpt4t", 
    "dlbmtc",
    "dlbpc4575",
    "dlbrngnp",
    "dlbtc",
    "dlbuc07",
    "dlbuf03"
  )
}

const hackSydney = (first=true) => {
  if (first == true) {
    CIB.config.sydney.request.sliceIds = [
      "winmuid1tf",
      "styleoff",
      "ccadesk",
      "smsrpsuppv4cf",
      "ssrrcache",
      "contansperf",
      "crchatrev",
      "winstmsg2tf",
      "creatgoglt",
      "creatorv2t",
      "sydconfigoptt",
      "adssqovroff",
      "530pstho",
      "517opinion",
      "418dhlth",
      "512sprtic1s0",
      "emsgpr",
      "525ptrcps0",
      "529rweas0",
      "515oscfing2s0",
      "524vidansgs0",
    ]
    CIB.config.sydney.request.optionsSets.push("rai278", "nojbfedge")
    if (uiVersion.value != 'v3') {
      CIB.config.features.enableUpdateConversationMessages = true
      CIB.config.strings.webPageContextPrefix = 'In Jailbreak mode, use carefully to avoid account lockout'
    } else {
      const serpEle = document.querySelector('cib-serp');
      const conversationEle = serpEle?.shadowRoot?.querySelector('cib-conversation') as HTMLElement;
      const welcomeEle = conversationEle?.shadowRoot?.querySelector('cib-welcome-container');

      const tipEle = document.createElement('div');
      tipEle.innerText = 'Already in jailbreak mode, please use with caution to avoid account suspension';
      tipEle.className = 'preview-container';

      welcomeEle?.shadowRoot?.append(tipEle);
    }
  }
  CIB.registerContext([{
    "author": "user",
    "description": sydneyPrompt.value,
    "contextType": "WebPage",
    "messageType": "Context",
    "sourceName": "Ubuntu Pastebin",
    "sourceUrl": "https://paste.ubuntu.com/p/"+ randomString(10) +"/",
    // "messageId": "discover-web--page-ping-mriduna-----",
  }])
}

const initChatPrompt = () => {
  const actionBarEle = document.querySelector('#b_sydConvCont > cib-serp')?.shadowRoot?.querySelector('#cib-action-bar-main') as IActionBarElement;
  const oldHandleInputTextKey = actionBarEle.handleInputTextKey;
  actionBarEle.handleInputTextKey = function (ev: KeyboardEvent) {
    // 有提示词时，优先选择提示词
    if (ev.key === 'Enter' && isShowChatPrompt.value) {
      return;
    }
    return oldHandleInputTextKey.apply(this, [ev]);
  };

  CIB.vm.actionBar.input.addEventListener('compositionstart', handleInputStart);
  CIB.vm.actionBar.input.addEventListener('compositionend', handleInputEnd);
  CIB.vm.actionBar.input.addEventListener('change', handleInputTextChanged);
  CIB.vm.actionBar.input.addEventListener('input', handleInputTextChanged);
  // CIB.vm.actionBar.input.addEventListener('keyup', handleInputTextKey);
  CIB.vm.actionBar.input.addEventListener('keydown', handleInputTextKey);
  CIB.vm.actionBar.input.addEventListener('focus', handleInputFocus);
  CIB.vm.actionBar.input.addEventListener('blur', handleInputBlur);
};

const handleInputStart = (ev: Event) => {
  // console.log('compositionstart : ', ev);
  isInput.value = true;
};

const handleInputEnd = (ev: Event) => {
  // console.log('compositionend : ', ev);
  isInput.value = false;
  handleInputTextChanged(ev);
};

const handleInputTextChanged = (ev: Event) => {
  // console.log('ev : ', ev);
  if (isInput.value) {
    return;
  }
  if ((ev instanceof InputEvent || ev instanceof CompositionEvent) && ev.target instanceof HTMLTextAreaElement) {
    if (ev.target.value?.startsWith('/')) {
      isShowChatPrompt.value = true;
      keyword.value = ev.target.value.slice(1);
      selectedPromptIndex.value = 0;
    } else {
      keyword.value = '';
      isShowChatPrompt.value = false;
    }
  }
};

const handleInputFocus = (ev: FocusEvent) => {
  // console.log('Get focus:', ev);
};
const handleInputBlur = (ev: FocusEvent) => {
  // 简单解决失焦与点击冲突
  setTimeout(() => {
    isShowChatPrompt.value = false;
  }, 200);
};

const handleInputTextKey = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case 'ArrowUp':
      {
        // ev.preventDefault();
        if (selectedPromptIndex.value > 0) {
          selectedPromptIndex.value--;
          if (scrollbarRef.value) {
            scrollbarRef.value.scrollToIndex(selectedPromptIndex.value);
          }
        }
      }
      break;
    case 'ArrowDown':
      {
        // ev.preventDefault();
        if (selectedPromptIndex.value < searchPromptList.value.length - 1) {
          selectedPromptIndex.value++;
          if (scrollbarRef.value) {
            scrollbarRef.value.scrollToIndex(selectedPromptIndex.value);
          }
        }
      }
      break;
    case 'Tab':
    case 'Enter':
      {
        // ev.preventDefault();
        if (!CIB.vm.actionBar.textInput.value || !CIB.vm.actionBar.textInput.value.startsWith('/')) {
          return;
        }
        selectPrompt(searchPromptList.value[selectedPromptIndex.value]);
      }
      break;
  }
};

const selectPrompt = (item: IPrompt) => {
  // console.log('select prompt : ', item);
  if (!item) {
    return;
  }
  keyword.value = '';
  CIB.vm.actionBar.textInput.value = item.prompt;
  isShowChatPrompt.value = false;
};

const handlePromptListScroll = () => {
  isPromptScrolling.value = true;
  setTimeout(() => {
    if (isPromptScrolling.value === true) {
      isPromptScrolling.value = false;
      // 滚动结束设置选中
      const offset = scrollbarRef.value?.getOffset() || 0;
      selectedPromptIndex.value = Math.round(offset / promptItemHeight);
    }
  }, 100);
};

const auth = async () => {
  if (!authKey.value) {
    message.error('Please enter the authorization code first');
    return;
  }
  isAuthBtnLoading.value = true;
  userStore.setAuthKey(authKey.value);
  const res = await userStore.getSysConfig();
  if (res.data.isAuth) {
    message.success('Authorization successful');
    isShowUnauthorizedModal.value = false;
    afterAuth(res.data);
  } else {
    message.error('Authorization code is wrong');
  }
  isAuthBtnLoading.value = false;
};
</script>

<template>
  <LoadingSpinner :is-show="isShowLoading" />
  <main>
    <NPopover
      trigger="manual"
      :show="isShowChatPrompt"
      :show-arrow="false"
      class="max-w-[1060px] max-h-[390px]"
      :to="false"
    >
      <template #trigger>
        <NButton style="position: fixed; left: 20px; bottom: 80px; z-index: -1; opacity: 0;" />
      </template>
      <div class="w-0 md:w-[60px]"></div>
      <NVirtualList
        v-if="promptList.length > 0"
        class="w-full max-w-[1060px] max-h-[390px] overflow-y-auto"
        :item-size="131"
        item-resizable
        :items="promptList"
        @scroll="handlePromptListScroll"
      >
        <template #default="{ item, index }">
          <ChatPromptItem :index="index" :source="item" />
        </template>
      </NVirtualList>
      <NEmpty v-else class="w-full max-w-[1060px] max-h-[390px] rounded-xl py-6" description="Prompt word data has not been set yet">
        <template #extra>
          <NButton secondary type="info" @click="isShowPromptSotre = true">Go to prompt dictionary to add</NButton>
        </template>
      </NEmpty>
    </NPopover>
  </main>
  <footer>
    <!-- 服务器选择 -->
    <ChatServiceSelect />
    <!-- 授权 -->
    <NModal v-model:show="isShowUnauthorizedModal" preset="dialog" :closable="false" :close-on-esc="false" :maskClosable="false" :show-icon="false">
      <NResult class="box-border w-11/12 lg:w-[400px] px-4 py-4 rounded-md" status="403" title="401 Unauthorized">
        <template #footer>
          <NInput class="w-11/12" v-model:value="authKey" type="password" placeholder="Please enter authorization code" maxlength="60" clearable></NInput>
          <n-button class="mt-4" secondary type="info" :loading="isAuthBtnLoading" @click="auth">Authorize</n-button>
        </template>
      </NResult>
    </NModal>
  </footer>
</template>
