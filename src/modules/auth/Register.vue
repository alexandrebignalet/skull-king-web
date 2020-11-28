<template>
  <div>
    <a-button @click="toggleModal">Créer un compte</a-button>
    <a-modal
      v-model="visible"
      title="Créer un compte"
      :destroyOnClose="true"
      @ok="submit"
    >
      <a-row type="flex">
        <a-col :span="24">
          <a-form layout="vertical">
            <a-form-item label="Pseudo">
              <a-input
                placeholder="Pseudo"
                v-model="form.name"
                required
                autoFocus
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>

            <a-form-item label="Email">
              <a-input
                placeholder="Email"
                v-model="form.email"
                required
                value
                type="email"
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
                value
                type="password"
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
        <a-button key="back" @click="toggleModal">
          Annuler
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="submit"
          :disabled="isDisabled"
        >
          Go
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
export default class Register extends Vue {
  private form: { name: string; email: string; password: string } = {
    name: "",
    email: "",
    password: ""
  };
  private visible = false;
  private isRegistering = false;

  get error() {
    return this.$store.getters["auth/errorOf"](ErrorType.REGISTER);
  }

  get isDisabled() {
    return (
      this.form.name === "" ||
      this.form.email === "" ||
      this.form.password === ""
    );
  }

  toggleModal() {
    this.visible = !this.visible;
  }

  submit() {
    this.isRegistering = false;
    this.$store
      .dispatch("auth/register", this.form)
      .then(() => {
        this.visible = false;
      })
      .finally(() => {
        this.isRegistering = false;
      });
  }
}
</script>
