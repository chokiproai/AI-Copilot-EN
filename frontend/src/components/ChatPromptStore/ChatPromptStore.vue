<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NList, NListItem, NButton, useMessage, NSpace, NInput, NUpload, NVirtualList, type UploadFileInfo, NEmpty } from 'naive-ui';
import { usePromptStore, type IPrompt, type IPromptDownloadConfig } from '@/stores/modules/prompt';
import { storeToRefs } from 'pinia';
import ChatPromptItem from './ChatPromptItem.vue';

const messgae = useMessage();
const promptStore = usePromptStore();
const { promptDownloadConfig, isShowPromptSotre, promptList, keyword, searchPromptList, optPromptConfig } = storeToRefs(promptStore);

const isShowDownloadPop = ref(false);

const isImporting = ref(false);
const isExporting = ref(false);

const showAddPromptPop = () => {
  optPromptConfig.value.isShow = true;
  optPromptConfig.value.type = 'add';
  optPromptConfig.value.title = 'Add prompt';
  optPromptConfig.value.newPrompt = {
    act: '',
    prompt: '',
  };
};

const savePrompt = () => {
  const { type, tmpPrompt, newPrompt } = optPromptConfig.value;
  if (!newPrompt.act) {
    return messgae.error('The title of the reminder word cannot be empty');
  }
  if (!newPrompt.prompt) {
    return messgae.error('The prompt description cannot be empty');
  }
  if (type === 'add') {
    promptList.value = [newPrompt, ...promptList.value];
    messgae.success('Successfully add prompt');
  } else if (type === 'edit') {
    if (newPrompt.act === tmpPrompt?.act && newPrompt.prompt === tmpPrompt?.prompt) {
      messgae.warning('Nothing words have not changed');
      optPromptConfig.value.isShow = false;
      return;
    }
    const rawIndex = promptList.value.findIndex((x) => x.act === tmpPrompt?.act && x.prompt === tmpPrompt?.prompt);
    if (rawIndex > -1) {
      promptList.value[rawIndex] = newPrompt;
      messgae.success('Edit Tips Successful');
    } else {
      messgae.error('Edit Tips error');
    }
  }
  optPromptConfig.value.isShow = false;
};

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (ev) {
      resolve(ev.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const importPrompt = async (options: { file: UploadFileInfo; fileList: Array<UploadFileInfo>; event?: Event }) => {
  // console.log(options.file);
  if (options.file.file) {
    isImporting.value = true;
    const fileText = await readFile(options.file.file);
    const promptData = JSON.parse(fileText);
    const result = promptStore.addPrompt(promptData);
    if (result.result) {
      messgae.info(`Upload files ${promptData.length} Strip data`);
      messgae.success(`Successfully import ${result.data?.successCount} Effective data`);
    } else {
      messgae.error(result.msg || 'The reminder word format is wrong');
    }
    isImporting.value = false;
  } else {
    messgae.error('The upload file is wrong');
  }
};

const exportPrompt = () => {
  if (promptList.value.length === 0) {
    return messgae.error('Unsplexed prompt data data');
  }
  isExporting.value = true;
  const jsonDataStr = JSON.stringify(promptList.value);
  const blob = new Blob([jsonDataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'BingAIPrompts.json';
  link.click();
  URL.revokeObjectURL(url);
  messgae.success('Export prompts successfully');
  isExporting.value = false;
};

const clearPrompt = () => {
  promptList.value = [];
  messgae.success('Clear the prompt thesaurus successful');
};

const downloadPrompt = async (config: IPromptDownloadConfig) => {
  if (!config.url) {
    return messgae.error('Please enter the download link first');
  }
  config.isDownloading = true;
  let jsonData: Array<IPrompt>;
  if (config.url.endsWith('.json')) {
    jsonData = await fetch(config.url).then((res) => res.json());
  } else if (config.url.endsWith('.csv')) {
    const csvData = await fetch(config.url).then((res) => res.text());
    console.log(csvData);
    jsonData = csvData
      .split('\n')
      .filter((x) => x)
      .map((x) => {
        const arr = x.split('","');
        return {
          act: arr[0].slice(1),
          prompt: arr[1]?.slice(1),
        };
      });
    jsonData.shift();
  } else {
    config.isDownloading = false;
    return messgae.error('Not supported to download the suffix of the suffix');
  }
  config.isDownloading = false;
  const result = promptStore.addPrompt(jsonData);
  if (result.result) {
    messgae.info(`Download files ${jsonData.length} Strip data`);
    messgae.success(`Successfully import ${result.data?.successCount} Effective data`);
  } else {
    messgae.error(result.msg || 'The reminder word format is wrong');
  }
};
</script>

<template>
  <NModal class="w-11/12 xl:w-[900px]" v-model:show="isShowPromptSotre" preset="card" title="Reminder">
    <div class="flex justify-start flex-wrap gap-2 px-5 pb-2">
      <NInput class="basis-full xl:basis-0 xl:min-w-[300px]" placeholder="Search reminder" v-model:value="keyword" :clearable="true"></NInput>
      <NButton secondary type="info" @click="isShowDownloadPop = true">Download</NButton>
      <NButton secondary type="info" @click="showAddPromptPop">Add to</NButton>
      <NUpload class="w-[56px] xl:w-auto" accept=".json" :default-upload="false" :show-file-list="false" @change="importPrompt">
        <NButton secondary type="success" :loading="isImporting">Import</NButton>
      </NUpload>
      <!-- <NButton secondary type="success">Import</NButton> -->
      <NButton secondary type="success" @click="exportPrompt" :loading="isExporting">Export</NButton>
      <NButton secondary type="error" @click="clearPrompt">Empty</NButton>
    </div>
    <NVirtualList
      v-if="searchPromptList.length > 0"
      class="h-[40vh] xl:h-[60vh] overflow-y-auto"
      :item-size="131"
      item-resizable
      :items="searchPromptList"
    >
      <template #default="{ item, index }">
        <ChatPromptItem :index="index" :source="item" />
      </template>
    </NVirtualList>
    <NEmpty v-else class="h-[40vh] xl:h-[60vh] flex justify-center items-center" description="No data">
      <template #extra>
        <NButton secondary type="info" @click="isShowDownloadPop = true">Download prompt</NButton>
      </template>
    </NEmpty>
  </NModal>
  <NModal class="w-11/12 xl:w-[600px]" v-model:show="optPromptConfig.isShow" preset="card" :title="optPromptConfig.title">
    <NSpace vertical>
      title
      <NInput placeholder="Please enter the title" v-model:value="optPromptConfig.newPrompt.act"></NInput>
      describe
      <NInput placeholder="Please enter the description" type="textarea" v-model:value="optPromptConfig.newPrompt.prompt"></NInput>
      <NButton block secondary type="info" @click="savePrompt">Keep</NButton>
    </NSpace>
  </NModal>
  <NModal class="w-11/12 xl:w-[600px]" v-model:show="isShowDownloadPop" preset="card" title="Download prompt">
    <NList class="overflow-y-auto rounded-lg" hoverable clickable>
      <NListItem v-for="(config, index) in promptDownloadConfig" :key="index">
        <a v-if="config.type === 1" class="no-underline text-blue-500" :href="config.url" target="_blank" rel="noopener noreferrer">{{ config.name }}</a>
        <NInput v-else-if="config.type === 2" placeholder="Please enter the download link, support JSON and CSV" v-model:value="config.url"></NInput>
        <template #suffix>
          <div class="flex justify-center gap-5">
            <a class="no-underline" v-if="config.type === 1" :href="config.refer" target="_blank" rel="noopener noreferrer">
              <NButton secondary>source</NButton>
            </a>
            <NButton secondary type="info" @click="downloadPrompt(config)" :loading="config.isDownloading">Download</NButton>
          </div>
        </template>
      </NListItem>
    </NList>
  </NModal>
</template>