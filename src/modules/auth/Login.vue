<template>
  <div>
    <b-button @click="toggleModal">
      <b-icon type="login" />
      Se connecter
    </b-button>
    <b-modal v-model="visible" title="Connection" :destroyOnClose="true">
      <b-row type="flex">
        <b-col :span="24">
          <b-form layout="vertical">
            <b-form-group label="Email">
              <b-input
                placeholder="Email"
                v-model="form.email"
                type="email"
                name="email"
                required
                autoFocus
                autocomplete
              >
                <b-icon
                  slot="prefix"
                  type="mail"
                  style="color:rgba(0,0,0,.25)"
                />
              </b-input>
            </b-form-group>

            <b-form-group label="Mot de passe">
              <b-input
                placeholder="Mot de passe"
                v-model="form.password"
                required
                name="password"
                value
                type="password"
                autocomplete
                @pressEnter="submit"
              >
                <b-icon
                  slot="prefix"
                  type="lock"
                  style="color:rgba(0,0,0,.25)"
                />
              </b-input>
            </b-form-group>
          </b-form>

          <Alert type="error" :alert="error" />
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-button key="back" @click="toggleModal" :disabled="isSigningIn">
          Annuler
        </b-button>
        <b-button
          key="submit"
          type="primary"
          @click="submit"
          :disabled="isDisabled"
          :loading="isSigningIn"
        >
          Se connecter
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { errorTypes } from "@/modules/auth/error-type.enum";
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
    return this.$store.getters["auth/errorOf"](errorTypes.LOGIN);
  }

  get isDisabled(): boolean {
    return this.form.email === "" || this.form.password === "";
  }

  toggleModal(): void {
    this.visible = !this.visible;
  }

  submit() {
    this.isSigningIn = true;
    console.log("login");
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
