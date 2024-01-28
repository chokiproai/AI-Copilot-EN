<script setup lang="ts">
import { ref } from 'vue';
import { NModal, NList, NListItem, NButton, useMessage, NSpace, NInput, NUpload, type UploadFileInfo, NEmpty } from 'naive-ui';
import { usePromptStore, type IPrompt, type IPromptDownloadConfig } from '@/stores/modules/prompt';
import { storeToRefs } from 'pinia';
import VirtualList from 'vue3-virtual-scroll-list';
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
  optPromptConfig.value.title = 'Add suggestion';
  optPromptConfig.value.newPrompt = {
    act: '',
    prompt: '',
  };
};

const savePrompt = () => {
  const { type, tmpPrompt, newPrompt } = optPromptConfig.value;
  if (!newPrompt.act) {
    return messgae.error('Suggestion title cannot be empty');
  }
  if (!newPrompt.prompt) {
    return messgae.error('Suggestion description cannot be empty');
  }
  if (type === 'add') {
    promptList.value = [newPrompt, ...promptList.value];
    messgae.success('Successfully added suggestion');
  } else if (type === 'edit') {
    if (newPrompt.act === tmpPrompt?.act && newPrompt.prompt === tmpPrompt?.prompt) {
      messgae.warning('Suggestion did not change');
      optPromptConfig.value.isShow = false;
      return;
    }
    const rawIndex = promptList.value.findIndex((x) => x.act === tmpPrompt?.act && x.prompt === tmpPrompt?.prompt);
    if (rawIndex > -1) {
      promptList.value[rawIndex] = newPrompt;
      messgae.success('Successfully edited suggestion');
    } else {
      messgae.error('Error editing suggestion');
    }
  }
  optPromptConfig.value.isShow = false;
};

// ... (rest of the script code)

</script>

<template>
  <NModal class="w-11/12 xl:w-[900px]" v-model:show="isShowPromptSotre" preset="card" title="Suggestion Store">
    <div class="flex justify-start flex-wrap gap-2 px-5 pb-2">
      <NInput class="basis-full xl:basis-0 xl:min-w-[300px]" placeholder="Search suggestion" v-model:value="keyword" :clearable="true"></NInput>
      <NButton secondary type="info" @click="isShowDownloadPop = true">Download</NButton>
      <NButton secondary type="info" @click="showAddPromptPop">Add</NButton>
      <NUpload class="w-[56px] xl:w-auto" accept=".json" :default-upload="false" :show-file-list="false" @change="importPrompt">
        <NButton secondary type="success" :loading="isImporting">Import</NButton>
      </NUpload>
      <!-- <NButton secondary type="success">Import</NButton> -->
      <NButton secondary type="success" @click="exportPrompt" :loading="isExporting">Export</NButton>
      <NButton secondary type="error" @click="clearPrompt">Clear All</NButton>
    </div>
    <VirtualList
      v-if="searchPromptList.length > 0"
      class="h-[40vh] xl:h-[60vh] overflow-y-auto"
      :data-key="'prompt'"
      :data-sources="searchPromptList"
      :data-component="ChatPromptItem"
      :keeps="10"
    />
    <NEmpty v-else class="h-[40vh] xl:h-[60vh] flex justify-center items-center" description="No data">
      <template #extra>
        <NButton secondary type="info" @click="isShowDownloadPop = true">Download suggestion</NButton>
      </template>
    </NEmpty>
  </NModal>
  <NModal class="w-11/12 xl:w-[600px]" v-model:show="optPromptConfig.isShow" preset="card" :title="optPromptConfig.title">
    <NSpace vertical>
      Title
      <NInput placeholder="Enter title" v-model:value="optPromptConfig.newPrompt.act"></NInput>
      Description
      <NInput placeholder="Enter description" type="textarea" v-model:value="optPromptConfig.newPrompt.prompt"></NInput>
      <NButton block secondary type="info" @click="savePrompt">Save</NButton>
    </NSpace>
  </NModal>
  <NModal class="w-11/12 xl:w-[600px]" v-model:show="isShowDownloadPop" preset="card" title="Download suggestion">
    <NList class="overflow-y-auto rounded-lg" hoverable clickable>
      <NListItem v-for="(config, index) in promptDownloadConfig" :key="index">
        <a v-if="config.type === 1" class="no-underline text-blue-500" :href="config.url" target="_blank" rel="noopener noreferrer">{{ config.name }}</a>
        <NInput v-else-if="config.type === 2" placeholder="Enter download link, support json and csv " v-model:value="config.url"></NInput>
        <template #suffix>
          <div class="flex justify-center gap-5">
            <a class="no-underline" v-if="config.type === 1" :href="config.refer" target="_blank" rel="noopener noreferrer">
              <NButton secondary>Source</NButton>
            </a>
            <NButton secondary type="info" @click="downloadPrompt(config)" :loading="config.isDownloading">Download</NButton>
          </div>
        </template>
      </NListItem>
    </NList>
  </NModal>
</template>