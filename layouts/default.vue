<template>
  <v-main id="main">
    <v-app>
      <app-header />
      <v-container>
        <nuxt />
      </v-container>
      <app-footer class="mt-auto" />
    </v-app>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Default extends Vue {}
</script>
