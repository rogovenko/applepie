<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { getChapters } from "../content/index.js"
import { locale, t } from "../i18n"

const chapters = computed(() => getChapters(locale.value))
const front = computed(() => chapters.value.filter((c) => c.aux && c.order < 1))
const core = computed(() => chapters.value.filter((c) => !c.aux))
const back = computed(() => chapters.value.filter((c) => c.aux && c.order > 1))
</script>

<template>
  <section class="container reader-index">
    <p class="eyebrow">{{ t("read.eyebrow") }}</p>
    <h1>{{ t("read.title") }}</h1>
    <p class="intro" v-html="t('read.intro')"></p>
    <hr class="rule" />

    <ul class="chapters">
      <li v-for="c in front" :key="c.slug">
        <RouterLink :to="'/read/' + c.slug" class="chapter-card">
          <span class="num num--aux">◆</span>
          <span class="body">
            <span class="title">{{ c.title }}</span>
            <span v-if="c.excerpt" class="excerpt">{{ c.excerpt }}</span>
          </span>
          <span class="arrow">→</span>
        </RouterLink>
      </li>
    </ul>

    <ol class="chapters">
      <li v-for="c in core" :key="c.slug">
        <RouterLink :to="'/read/' + c.slug" class="chapter-card">
          <span class="num">{{ String(c.order).padStart(2, "0") }}</span>
          <span class="body">
            <span class="title">{{ c.title }}</span>
            <span v-if="c.excerpt" class="excerpt">{{ c.excerpt }}</span>
          </span>
          <span class="arrow">→</span>
        </RouterLink>
      </li>
    </ol>

    <ul class="chapters">
      <li v-for="c in back" :key="c.slug">
        <RouterLink :to="'/read/' + c.slug" class="chapter-card">
          <span class="num num--aux">◆</span>
          <span class="body">
            <span class="title">{{ c.title }}</span>
            <span v-if="c.excerpt" class="excerpt">{{ c.excerpt }}</span>
          </span>
          <span class="arrow">→</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.reader-index { padding: clamp(3rem, 8vh, 5rem) 0 4rem; }
.intro { color: var(--ink-soft); max-width: 620px; }
.chapters { list-style: none; padding: 0; margin: 0; }
.chapter-card { display: flex; align-items: center; gap: 1.2rem; padding: 1.3rem .25rem; border: none; border-bottom: 1px solid var(--line); }
.chapter-card:hover .title { color: var(--gold); }
.num { font-family: var(--serif-display); color: var(--gold-soft); font-size: 1.5rem; min-width: 2.5rem; }
.num--aux { font-size: 1rem; }
.body { flex: 1; display: flex; flex-direction: column; gap: .25rem; }
.title { font-family: var(--serif-display); font-size: 1.45rem; }
.excerpt { color: var(--muted); font-size: .95rem; }
.arrow { color: var(--muted); }
</style>
