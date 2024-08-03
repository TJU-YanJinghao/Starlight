<template>
  <div id="app">
    <!-- img src="./assets/logo.png" -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "hongleixingshu", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

@font-face {
  font-family: "hongleixingshu";
  src: url("~@/assets/HongLeiXingShuJianTi-2.otf") format("opentype");
}
</style>
