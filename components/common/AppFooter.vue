<template>
  <v-footer>
    <v-card
      flat
      tile
      width="100%"
      color="primary"
      class="lighten-1 text-center"
    >
      <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Abe</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class AppFooter extends Vue {
  icons = [
    'mdi-facebook',
    'mdi-twitter',
    'mdi-instagram',
    'mdi-linkedin',
    'mdi-youtube',
  ]
}
</script>
