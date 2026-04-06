<template>
  <div id="app">
    <header class="header">
      <div class="header__container">
        <h1 class="header__logo">电商商城</h1>
        <nav class="header__nav">
          <router-link to="/">商品列表</router-link>
        </nav>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2024 电商商城. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }

  &__nav {
    a {
      color: #666;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f5f5;
      }

      &.router-link-active {
        color: #007aff;
      }
    }
  }
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.footer {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
