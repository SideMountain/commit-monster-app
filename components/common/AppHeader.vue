<template>
  <header>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <NuxtLink to="/" style="color:white !important">Commit Monster</NuxtLink>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class AppHeader extends Vue {
  
}