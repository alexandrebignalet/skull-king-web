<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;
}

#app {
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  max-height: 100%;
  max-width: 100%;
  font-family: "Montserrat", Arial, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(#bfc5ee, #7177ac);
}

.main-container {
  z-index: 1;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  text-align: left;
  color: #d9dbec;

  .title {
    color: #e7e9f6;
    font-weight: bolder;
    font-size: 48px;
    margin: 20px;
  }

  .list-container {
    display: flex;
    flex-direction: column;

    overflow-y: auto;
    height: 100%;

    .list-item-container {
      margin: 0 20px 20px 20px;
      padding: 20px;
      min-height: 90px;
      border-radius: 20px;
      display: flex;
      align-items: center;

      font-weight: bold;
      color: #e7e9f6;

      background-color: #383e6e;
      box-shadow: 3px 3px 20px #0000006e;

      .avatar {
        height: 55px;
        min-width: 55px;
        box-shadow: 3px 3px 10px #0000006e;
      }

      .middle-content {
        font-size: 14px;
        text-align: left;
        flex-grow: 1;
        margin-left: 20px;
        text-transform: capitalize;
      }

      .right-content {
        position: relative;
        border-radius: 10px;
        background-color: #2d325a;
        min-width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          position: absolute;
          width: 25px;
          height: 25px;
          top: -15px;
        }
      }
    }
  }
}

.container {
  position: relative;
  background: linear-gradient(#383e6c, #1f2341);
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-radius: 45px;
  box-shadow: 0 10px 20px black;
}
</style>
