<script setup lang="ts">

  import { ref } from 'vue'

  import type {AnnotatorEndpoint} from '../App.vue'

//==============================================================================

  type TableHeader = {
    key: string
    label: string
    width?: string|number
  }

  interface AnnotationsTable {
    headers: TableHeader[]
    items: AnnotationData[]
    sort: string
    keyword: string
    keywordFilter: (keyword: string) => (item: AnnotationData) => boolean
    loading: boolean
  }

  interface AnnotationData {
    id: number
    annotationId: string
    comment: string
    evidence: string
    created: string
    creatorName: string
    resource: string
    item: string
    [propName: string]: unknown
  }

//==============================================================================

  type AnnotationBody = {
    comment: string
    evidence: string[]
  }

  type ItemData = {
    id: string
    label?: string
    models?: string
  }
  type OrcidData = {
    orcid: string
    name?: string
    email?: string
  }

//==============================================================================

  interface AnnotationMetadata {
    annotationId: string
    body: AnnotationBody
    created: string
    creator: OrcidData
    item: ItemData
    resource: string
    status?: string
  }

//==============================================================================

const tableHeaders: TableHeader[] = [
    { label: 'Annotation Id', key: 'annotationId' },
    { label: 'Comment', key: 'comment' },
    { label: 'Evidence', key: 'evidence' },
    { label: 'Created', key: 'created' },
    { label: 'Creator', key: 'creatorName' },
    { label: 'Status', key: 'status' },
    { label: 'Item', key: 'item' },
    { label: 'Resource', key: 'resource' },
  ]

  const defaultRow: AnnotationData = {
      id: 0,
      annotationId: '',
      comment: '',
      evidence: '',
      created: '',
      creatorName: '',
      resource: '',
      item: '',
      status: ''
  }

  const annotationsTable: AnnotationsTable = {
    headers: tableHeaders,
    items: [],
    sort: '+annotationId',
    keyword: '',
    keywordFilter: (keyword: string) => {
      return (item: AnnotationData) => {
        // Concatenate all the columns into a single string for a faster lookup.
        const allColumns = tableHeaders.map(hdr => item[hdr.key]).join(' ')
        // Lookup the keyword variable in the string with case-insensitive flag.
        return new RegExp(keyword, 'i').test(allColumns)
      }
    },
    loading: true
  }

  const table = ref(annotationsTable)

//==============================================================================

  async function loadAnnotations(annotatorEndpoints: AnnotatorEndpoint[]): Promise<null>
  {
    let index = 1
    const annotations: AnnotationData[] = []
    for (const annotator of annotatorEndpoints) {
      let annotationMetadata: AnnotationMetadata[] = []
      if (annotator.token) {
        try {
          const result = await fetch(`${annotator.url}download/`, {
            headers: {
              "Authorization": `Bearer ${annotator.token}`
            }
          })
          annotationMetadata = await result.json()
        } catch {
          // Check for 401 (unauthorized)
          console.log(`Cannot connect to ${annotator.name} annotator at ${annotator.url}`)
          continue
        }
      } else {
        continue
      }
      annotationMetadata.forEach(metadata => {
        const annotation = Object.assign({}, defaultRow)
        annotation.id = index
        annotation.annotationId = metadata.annotationId
        annotation.comment = metadata.body.comment
        annotation.evidence = metadata.body.evidence.map(u => decodeURI(u)).join(', ')
        annotation.created = metadata.created
        annotation.creatorName = `${metadata.creator.name || metadata.creator.orcid} ${metadata.creator.email || ''}`
        annotation.resource = metadata.resource
        annotation.item = `${metadata.item.label || ''} (${metadata.item.models || ''}) Item: ${metadata.item.id}`
        annotation.status = metadata.status || ''
console.log(annotation)
        annotations.push(annotation)
        index += 1
      })
    }
    table.value.loading = false
    table.value.items = annotations
    return null
  }

//==============================================================================

  defineExpose({
    loadAnnotations
  })

  function selected(event: Event)
  {
    console.log(event)
  }
</script>

<!--=========================================================================-->

<template lang='pug'>
w-input.mb3(
  v-model="table.keyword"
  placeholder="Search..."
  inner-icon-left="wi-search")
w-table.flatmap-table(
  :headers="table.headers"
  :items="table.items"
  :filter="table.keywordFilter(table.keyword)"
  :selectable-rows="1"
  :mobile-breakpoint="700"
  v-model:sort="table.sort"
  v-model:loading='table.loading'
  @row-select="selected"
  fixed-headers
  resizable-columns
  style="height: calc(100vh - 210px)")
//.mt4.title4 Selection info:
//  pre {{ selectionInfo }}
</template>

<!--=========================================================================-->
