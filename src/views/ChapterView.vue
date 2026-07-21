<script setup>
import { computed, watch, onMounted, onUnmounted } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { getChapters, getChapter } from "../content/index.js"
import { locale, t } from "../i18n"

const props = defineProps({ slug: String, part: String })
const router = useRouter()

const chapters = computed(() => getChapters(locale.value))
const chapter = computed(() => getChapter(locale.value, props.slug))
const index = computed(() => chapters.value.findIndex((c) => c.slug === props.slug))
const total = computed(() => (chapter.value ? chapter.value.sections.length : 0))

const partNum = computed(() => {
  if (!chapter.value) return 1
  const p = parseInt(props.part, 10)
  if (isNaN(p)) return 1
  return Math.min(Math.max(1, p), total.value)
})
const section = computed(() => (chapter.value ? chapter.value.sections[partNum.value - 1] : ""))

function partPath(chap, n) {
  return n > 1 ? "/read/" + chap.slug + "/" + n : "/read/" + chap.slug
}

const prevTarget = computed(() => {
  if (!chapter.value) return null
  if (partNum.value > 1) return { to: partPath(chapter.value, partNum.value - 1), label: t("chapter.prevPart") }
  if (index.value > 0) {
    const c = chapters.value[index.value - 1]
    return { to: partPath(c, c.sections.length), label: "← " + c.title }
  }
  return null
})

const nextTarget = computed(() => {
  if (!chapter.value) return null
  if (partNum.value < total.value) return { to: partPath(chapter.value, partNum.value + 1), label: t("chapter.nextPart") }
  if (index.value >= 0 && index.value < chapters.value.length - 1) {
    const c = chapters.value[index.value + 1]
    return { to: partPath(c, 1), label: c.title + " →" }
  }
  return { to: "/read", label: t("chapter.toContents") }
})

function segFill(k) {
  if (k < index.value) return 100
  if (k === index.value) return total.value ? (partNum.value / total.value) * 100 : 100
  return 0
}

function gotoChapter(k) {
  router.push(partPath(chapters.value[k], 1))
}

watch([() => props.slug, () => props.part, locale], () => {
  window.scrollTo({ top: 0 })
})

onMounted(() => { document.body.style.paddingBottom = "56px" })
onUnmounted(() => { document.body.style.paddingBottom = "" })
</script>

<template>
  <article v-if="chapter" class="container chapter">
    <p class="eyebrow">{{ chapter.label || (t("chapter.chapterWord") + " " + String(chapter.order).padStart(2, "0")) }}</p>
    <h1>{{ chapter.title }}</h1>
    <p v-if="chapter.subtitle && partNum === 1" class="subtitle">{{ chapter.subtitle }}</p>
    <hr class="rule" />

    <div class="prose" v-html="section"></div>

    <p v-if="chapter.source && partNum === total" class="source">
      {{ t("chapter.originalLabel") }}
      <a :href="chapter.source" target="_blank" rel="noopener">{{ chapter.source }}</a>
    </p>

    <nav class="pager">
      <RouterLink v-if="prevTarget" :to="prevTarget.to" class="pager-link prev">{{ prevTarget.label }}</RouterLink>
      <span v-else></span>
      <RouterLink v-if="nextTarget" :to="nextTarget.to" class="pager-link next">{{ nextTarget.label }}</RouterLink>
    </nav>

    <div class="reading-bar" role="navigation" aria-label="progress">
      <div class="segments">
        <button
          v-for="(c, k) in chapters"
          :key="c.slug"
          class="seg"
          :class="{ 'seg--current': k === index }"
          :title="c.title"
          @click="gotoChapter(k)"
        >
          <span class="seg-fill" :style="{ width: segFill(k) + '%' }"></span>
        </button>
      </div>
      <div class="reading-bar__inner container">
        <span class="chap">
          <span class="chap-label">{{ chapter.label || (t("chapter.chapterWord") + " " + chapter.order) }}</span>
          <span class="chap-title">{{ chapter.title }}</span>
        </span>
        <span v-if="total > 1" class="part">{{ t("chapter.part") }} {{ partNum }} {{ t("chapter.of") }} {{ total }}</span>
      </div>
    </div>
  </article>

  <section v-else class="container missing">
    <h1>{{ t("chapter.notFoundTitle") }}</h1>
    <p>{{ t("chapter.notFoundText") }}</p>
    <RouterLink class="btn" to="/read">{{ t("chapter.notFoundCta") }}</RouterLink>
  </section>
</template>

<style scoped>
.chapter { padding: clamp(3rem, 8vh, 5rem) 0 5rem; max-width: 680px; }
.subtitle { font-family: var(--serif-display); font-size: 1.3rem; color: var(--ink-soft); font-style: italic; }
.prose :deep(p) { margin: 0 0 1.3em; }
.prose :deep(h2) { margin: 1.8em 0 .5em; font-size: 1.9rem; }
.prose :deep(h3) { margin: 1.6em 0 .4em; }
.prose :deep(blockquote) {
  margin: 1.6em 0; padding: .2em 0 .2em 1.4em; border-left: 2px solid var(--gold-soft);
  font-style: italic; color: var(--ink-soft);
}
.prose :deep(em) { font-style: italic; }
.source { color: var(--muted); font-size: .85rem; margin-top: 2.5rem; }
.pager { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
.pager-link { border: none; color: var(--ink-soft); font-family: var(--serif-display); font-size: 1.15rem; }
.pager-link:hover { color: var(--gold); }
.missing { padding: 6rem 0; text-align: center; }

.reading-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; background: rgba(250,247,240,.92); backdrop-filter: blur(8px); border-top: 1px solid var(--line); }
.segments { display: flex; gap: 2px; padding: 0; }
.seg { flex: 1; height: 4px; background: var(--line); border: none; padding: 0; cursor: pointer; position: relative; overflow: hidden; }
.seg-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--gold-soft); transition: width .25s ease; }
.seg--current .seg-fill { background: var(--gold); }
.seg--current { outline: none; }
.reading-bar__inner { display: flex; align-items: baseline; justify-content: space-between; height: 46px; gap: 1rem; }
.chap { display: flex; align-items: baseline; gap: .6rem; min-width: 0; }
.chap-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); white-space: nowrap; }
.chap-title { font-family: var(--serif-display); font-size: 1.05rem; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.part { font-size: .82rem; color: var(--muted); white-space: nowrap; letter-spacing: .03em; }
@media (max-width: 520px) { .chap-title { display: none; } }
</style>
