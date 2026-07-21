<script setup>
import { t } from "../i18n"
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <hr class="rule" style="margin-inline:auto" />
      <p class="line" v-html="t('footer.l1')"></p>
      <p class="line small" v-html="t('footer.l2')"></p>
      <p class="line small">© {{ new Date().getFullYear() }} {{ t("footer.l3") }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { padding: 2rem 0 4rem; text-align: center; }
.line { color: var(--ink-soft); font-size: .95rem; max-width: 560px; margin: .4rem auto; }
.small { color: var(--muted); font-size: .82rem; }
</style>
