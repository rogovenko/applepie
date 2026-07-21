<script setup>
import { ref } from "vue"
import { locale, setLocale, locales, t } from "../i18n"
const open = ref(false)
const links = [
  { to: "/", key: "nav.home" },
  { to: "/read", key: "nav.read" },
  { to: "/about", key: "nav.about" },
]
</script>

<template>
  <header class="site-header">
    <div class="container bar">
      <router-link to="/" class="brand" @click="open = false">
        <span class="brand-mark">✶</span>
        <span class="brand-name">{{ t("brand") }}</span>
      </router-link>
      <nav class="nav" :class="{ 'nav--open': open }">
        <router-link v-for="l in links" :key="l.to" :to="l.to" class="nav-link" @click="open = false">{{ t(l.key) }}</router-link>
        <a class="nav-link nav-link--ext" href="https://www.thethreadbook.com/" target="_blank" rel="noopener">{{ t("nav.original") }}</a>
        <div class="lang" role="group" aria-label="Language">
          <button
            v-for="l in locales"
            :key="l.code"
            class="lang-btn"
            :class="{ 'lang-btn--active': locale === l.code }"
            :aria-pressed="locale === l.code"
            :title="l.name"
            @click="setLocale(l.code); open = false"
          >{{ l.label }}</button>
        </div>
      </nav>
      <button class="burger" :aria-expanded="open" aria-label="Menu" @click="open = !open">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 50; background: rgba(250,247,240,.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.bar { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.brand { display: flex; align-items: center; gap: .5rem; border: none; }
.brand-mark { color: var(--gold); font-size: 1.1rem; }
.brand-name { font-family: var(--serif-display); font-size: 1.5rem; letter-spacing: .04em; }
.nav { display: flex; align-items: center; gap: 1.8rem; }
.nav-link { border: none; font-size: .98rem; letter-spacing: .02em; color: var(--ink-soft); }
.nav-link.router-link-exact-active { color: var(--ink); border-bottom: 1px solid var(--gold); }
.nav-link--ext { color: var(--muted); }
.lang { display: flex; align-items: center; gap: .35rem; }
.lang-btn {
  background: none; border: 1px solid var(--line); border-radius: 999px; cursor: pointer;
  padding: .18rem .6rem; font-size: .82rem; color: var(--muted); line-height: 1.4; letter-spacing: .02em;
}
.lang-btn--active { color: var(--ink); border-color: var(--gold); background: rgba(0,0,0,.02); }
.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
.burger span { width: 24px; height: 2px; background: var(--ink); display: block; }
@media (max-width: 640px) {
  .burger { display: flex; }
  .nav { position: absolute; top: 64px; left: 0; right: 0; flex-direction: column; gap: 1.2rem; padding: 1.5rem 0; background: var(--paper); border-bottom: 1px solid var(--line); transform: translateY(-120%); transition: transform .3s ease; }
  .nav--open { transform: translateY(0); }
}
</style>
