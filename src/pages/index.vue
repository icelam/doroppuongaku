<template>
  <div id="doroppuongaku" class="page-content">
    <!-- Welcome -->
    <h1 class="page-title" v-if="!musicList.length">Doroppuongaku</h1>
    <p class="page-desc" v-if="!musicList.length">Choose music from Dropbox</p>
    <div class="dropbox-button" v-if="!musicList.length" ref="dropboxButton"></div>
    <!-- /Welcome -->
    <!-- Player -->
    <aplayer 
      v-if="musicList.length"
      autoplay
      :music="musicList[0]"
      :list="musicList"
      :listMaxHeight="aplayerConfig.listMaxHeight"
      :theme="aplayerConfig.theme"
    />
    <!-- Player -->
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer';
import ScriptLoader from '@utils/ScriptLoader';

export default {
  name: 'landingPage',
  data() {
    return {
      aplayerConfig: {
        theme: '#0061ff',
        listMaxHeight: '330px'
      },
      musicList: []
    };
  },
  components: {
    Aplayer
  },
  methods: {
    async initDropboxChooser() {
      const vm = this;

      // Load Dropbox Chooser
      const loader = new ScriptLoader({
        src: 'https://www.dropbox.com/static/api/2/dropins.js',
        global: 'Dropbox',
        attr: {
          'data-app-key': process.env.DROPBOX_DATA_APP_KEY,
          'id': 'dropboxjs'
        }
      });

      const droppoxChooser = await loader.load();

      var options = {
        success: (files) => {
          for(var i = 0; i < files.length; i++) {
            vm.musicList.push({
              title: files[i].name,
              src: files[i].link,
            });
          }
        },
        cancel: () => {

        },
        linkType: 'direct',
        multiselect: true,
        extensions: ['.mp3', '.m4a', '.wma']
      };

      var button = window.Dropbox.createChooseButton(options);
      this.$refs.dropboxButton.appendChild(button);
    }
  },
  mounted() {
    const vm = this;
    vm.initDropboxChooser();
  },
  watch: {
    
  }
};
</script>