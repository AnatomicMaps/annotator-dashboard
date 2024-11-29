<script setup lang="ts">

  import { onMounted, ref } from 'vue'

  import {ANNOTATOR_ENDPOINTS} from '../App.vue'

  import AnnotationsTable from '../components/AnnotationsTable.vue'

  const title = 'Annotations'

  const annotationData = ref(0)

  onMounted(async () => {
    // @ts-ignore
    await annotationData.value.loadAnnotations(ANNOTATOR_ENDPOINTS)
  })
</script>

<template lang='pug'>
w-card.light-blue-light5--bg(tile)
  template(#title)
    w-toolbar
      .title2.ml2.text-light {{title}}
  Suspense
    AnnotationsTable(ref='annotationData')
</template>
