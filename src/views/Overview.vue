<script setup lang="ts">

  import {ANNOTATOR_ENDPOINTS} from '../App.vue'

  const title = 'Overview'

  /*
    Table of servers and their version
  */
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  p Available annotation servers with login links...
</template>
