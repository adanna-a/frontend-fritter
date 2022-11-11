<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <!-- <nav> -->
    <div class="sidebar">
    <div class="header">
      <img src="../../public/fritter-logo.png" style="height:45px;">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="pages">
      <router-link style="text-decoration: none; color: inherit; font-size: 22px;" to="/">
        Home
      </router-link>
      <router-link style="text-decoration: none; color: inherit; font-size: 22px;" to="/feeds">
        Feeds
      </router-link>
      <router-link
        style="text-decoration: none; color: inherit; font-size: 22px;"
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        style="text-decoration: none; color: inherit; font-size: 22px;"
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
  <!-- </nav> -->
</template>

<style scoped>
/* nav {
    padding: 1vw 2vw;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
} */

.sidebar {
  height: 100%;
  width: 240px;
  position: fixed;
  z-index: 1;
  top: 0; 
  left: 0;
  background-color: white;
  overflow-x: hidden;
  padding-top: 20px;
  padding-left: 25px;
}

* {
  font-family: Helvetica;
}
.title {
    font-size: 32px;
    margin: 0 5px;
}

.pageTitles {
  font-size: 22px;
  color: black;
  text-decoration: none;
}

img {
    height: 32px;
}

.header {
	display: flex;
	align-items: center;
  
}

.pages {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: row;
    align-items: center;
    margin-top: 20px;
    height: 30%;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
