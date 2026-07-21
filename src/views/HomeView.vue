<script setup>
import { computed } from "vue"
import { RouterLink } from "vue-router"
import { getChapters } from "../content/index.js"
import { locale, t } from "../i18n"

const chapters = computed(() => getChapters(locale.value))
const praise = computed(() => t("home.praise"))
</script>

<template>
  <div>
    <section class="hero">
      <div class="container center">
      <p class="eyebrow">{{ t("home.eyebrow") }}</p>
      <h1>{{ t("home.title") }}</h1>
      <p class="lead">{{ t("home.lead") }}</p>
      <div class="cta">
        <RouterLink class="btn" to="/read">{{ t("home.readFree") }}</RouterLink>
        <a class="btn btn--ghost" href="https://www.thethreadbook.com/" target="_blank" rel="noopener">{{ t("home.originalBook") }}</a>
      </div>
    </div>
  </section>

  <section class="container block">
    <hr class="rule" />
    <h2>{{ t("home.beginsTitle") }}</h2>
    <p>{{ t("home.beginsText") }}</p>
    <RouterLink class="more" to="/read">{{ t("home.continue") }}</RouterLink>
  </section>

  <section class="container block">
    <hr class="rule" />
    <h2>{{ t("home.contents") }}</h2>
    <ul class="toc">
      <li v-for="c in chapters" :key="c.slug">
        <RouterLink :to="'/read/' + c.slug">
          <span class="toc-num">{{ c.aux ? "◆" : String(c.order).padStart(2, "0") }}</span>
          <span class="toc-title">{{ c.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section class="container block">
    <hr class="rule" />
    <h2>{{ t("home.praiseTitle") }}</h2>
    <figure v-for="(p, i) in praise" :key="i" class="quote">
      <blockquote>{{ p.text }}</blockquote>
      <figcaption>— {{ p.who }}</figcaption>
    </figure>
    <p class="note" v-html="t('home.praiseNote')"></p>
  </section>
  </div>
</template>

<style scoped>
.hero { padding: clamp(4rem, 12vh, 8rem) 0 2rem; }
.lead { font-size: 1.15rem; color: var(--ink-soft); max-width: 620px; margin: 1.5rem auto 2.2rem; }
.cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.block { padding: 1.5rem 0; }
.more { display: inline-block; margin-top: .5rem; border: none; color: var(--gold); }
.toc { list-style: none; padding: 0; margin: 0; }
.toc li { border-bottom: 1px solid var(--line); }
.toc a { display: flex; align-items: baseline; gap: 1rem; padding: 1rem .25rem; border: none; }
.toc a:hover .toc-title { color: var(--gold); }
.toc-num { font-family: var(--serif-display); color: var(--gold-soft); font-size: 1.1rem; min-width: 2.2rem; }
.toc-title { font-family: var(--serif-display); font-size: 1.35rem; }
.quote { margin: 1.8rem 0; }
.quote blockquote { margin: 0; font-family: var(--serif-display); font-size: 1.4rem; line-height: 1.4; font-style: italic; }
.quote figcaption { color: var(--muted); margin-top: .4rem; }
.note { color: var(--muted); font-size: .85rem; margin-top: 2rem; }
</style>
