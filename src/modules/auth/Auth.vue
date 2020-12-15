<template>
  <div class="auth-wrapper">
    <div class="logo-wrapper">
      <img src="@/assets/skullking-title.png" alt="logo" class="logo" />
    </div>
    <div class="auth">
      <form class="form" @submit.prevent="signIn">
        <div class="avatar">
          <img :src="avatarURL" alt="avatar du joueur" v-if="avatarURL" />
        </div>
        <div class="form-group">
          <label>Présentez-vous!</label>
          <input
            type="text"
            placeholder="Pseudo"
            v-model="pseudo"
            :class="{ invalid: this.pseudoInvalid }"
          />
        </div>
        <div class="form-group file">
          <label class="label-avatar">Choisis un avatar</label>
          <input
            class="input-avatar"
            type="file"
            @change="onFileChange"
            name="avatar"
            accept="image/png, image/jpeg"
          />
        </div>
        <div class="cta">
          <button type="submit">À l'abordage!</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Auth extends Vue {
  private pseudo?: string = null;
  private avatarURL?: string = null;
  private pseudoInvalid = false;

  onFileChange(e) {
    const file = e.target.files[0];
    this.avatarURL = URL.createObjectURL(file);
  }

  signIn() {
    if (!this.pseudo) {
      this.pseudoInvalid = true;
      setTimeout(() => {
        this.pseudoInvalid = false;
      }, 2000);
      return;
    }
    if (!this.avatarURL) return this.$message.warn("N'oublie pas ton avatar");

    this.$store
      .dispatch("auth/signInAnonymously", {
        pseudo: this.pseudo,
        avatarURL: this.avatarURL
      })
      .catch(() =>
        this.$message.error("Impossible de s'enregistrer pour le moment")
      );
  }
}
</script>
<style lang="scss">
.auth-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .logo {
    max-width: 80% !important;
    margin-top: 10%;
    margin-left: 20%;
  }

  .auth {
    height: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .form {
      display: flex;
      flex-direction: column;
      z-index: 1;
      height: 100%;
      justify-content: space-evenly;
      align-items: center;

      .file {
        position: relative;

        .label-avatar {
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          color: #d9dbec;
          background-color: #3c4374;
          border-radius: 10px;
          height: 50px;
          padding: 10px;
        }

        .input-avatar {
          opacity: 0;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -5%);
          height: 50px;
          top: -10px;
          width: 50%;
        }
      }

      .form-group {
        width: 100%;
        color: #d9dbec;
        font-weight: bold;

        label {
          font-size: 20px;
        }

        input[type="text"] {
          font-size: 12px;
          height: 40px;
          line-height: 40px;
          padding-left: 24px;
          padding-right: 24px;
          font-weight: bold;

          box-sizing: border-box;
          width: 80%;
          background: #333967;
          border-radius: 4px;
          padding-top: 5px;
          margin-top: 15px;
          border: 1px solid #6a59ff;
          box-shadow: 5px 5px 10px #00000094;

          &::placeholder {
            color: #d9dbec;
            font-weight: bold;
          }

          &:focus {
            font-weight: bold;
            outline: none;

            &::placeholder {
              color: transparent;
            }
          }
        }

        .invalid {
          outline-color: red;
          animation: shake 0.5s linear;
        }

        @keyframes shake {
          8%,
          41% {
            transform: translateX(-10px);
          }
          25%,
          58% {
            transform: translateX(10px);
          }
          75% {
            transform: translateX(-5px);
          }
          92% {
            transform: translateX(5px);
          }
          0%,
          100% {
            transform: translateX(0);
          }
        }
      }

      .cta {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 150px;
        width: 80%;

        button {
          border: #6a59ff;
          font-weight: bold;
          border: none;
          height: 50px;
          width: 100%;
          background-color: #6959ff;
          border-radius: 10px;
          color: #fff;

          &:focus {
            outline: 0;
          }

          &:active {
            background-color: #887ef8;
          }
        }
      }

      .avatar {
        img {
          max-width: 100px;
          max-height: 100px;
        }
      }
    }
  }
}
</style>
