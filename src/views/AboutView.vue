<script setup>
import { computed } from "vue"
import { t } from "../i18n"

const body = computed(() => t("about.body"))
</script>

<template>
  <section class="container about">
    <p class="eyebrow">{{ t("about.eyebrow") }}</p>
    <h1>{{ t("about.title") }}</h1>
    <hr class="rule" />
    <p v-for="(p, i) in body" :key="i" v-html="p"></p>
    <blockquote>{{ t("about.quote") }}</blockquote>
    <p class="dim">{{ t("about.quoteAttr") }}</p>

    <h2>{{ t("about.techTitle") }}</h2>
    <p v-html="t('about.techText')"></p>
    <p v-html="t('about.openOriginal')"></p>
  </section>
</template>

<style scoped>
.about { padding: clamp(3rem, 8vh, 5rem) 0 4rem; max-width: 680px; }
blockquote { margin: 2rem 0; padding-left: 1.4rem; border-left: 2px solid var(--gold-soft); font-family: var(--serif-display); font-style: italic; font-size: 1.35rem; color: var(--ink-soft); }
.dim { color: var(--muted); font-size: .9rem; }
code { background: var(--paper-soft); padding: .1em .35em; border-radius: 3px; font-size: .9em; }
h2 { margin-top: 2.5rem; }
</style>
