<template>
  <div>
    <a-button @click="toggleModal">
      <a-icon type="login" />
      Se connecter
    </a-button>
    <a-modal v-model="visible" title="Connection" :destroyOnClose="true">
      <a-row type="flex">
        <a-col :span="24">
          <a-form layout="vertical">
            <a-form-item label="Email">
              <a-input
                placeholder="Email"
                v-model="form.email"
                type="email"
                name="email"
                required
                autoFocus
                autocomplete
              >
                <a-icon
                  slot="prefix"
                  type="mail"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>

            <a-form-item label="Mot de passe">
              <a-input-password
                placeholder="Mot de passe"
                v-model="form.password"
                required
                name="password"
                value
                type="password"
                autocomplete
                @pressEnter="submit"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input-password>
            </a-form-item>
          </a-form>

          <Alert type="error" :alert="error" />
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button key="back" @click="toggleModal" :disabled="isSigningIn">
          Annuler
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="submit"
          :disabled="isDisabled"
          :loading="isSigningIn"
        >
          Se connecter
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ErrorType } from "@/modules/auth/error-type.enum";
import Alert from "@/modules/site/alert/Alert.vue";

@Component({ components: { Alert } })
export default class Login extends Vue {
  private form: { email: string; password: string } = {
    email: "",
    password: ""
  };
  private visible = false;
  private isSigningIn = false;

  get error(): string {
    return this.$store.getters["auth/errorOf"](ErrorType.LOGIN);
  }

  get isDisabled(): boolean {
    return this.form.email === "" || this.form.password === "";
  }

  toggleModal(): void {
    this.visible = !this.visible;
  }

  submit() {
    this.isSigningIn = true;
    this.$store
      .dispatch("auth/login", this.form)
      .then(() => {
        this.visible = false;
      })
      .finally(() => {
        this.isSigningIn = false;
      });
  }
}
</script>
