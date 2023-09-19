<template>
  <meta
    http-equiv="Content-Security-Policy"
    content="upgrade-insecure-requests"
  />
  <Header />
  <RouterView />
  <Footer />
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>
