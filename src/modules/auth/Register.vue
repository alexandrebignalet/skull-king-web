<template>
  <div>
    <b-button @click="toggleModal">Créer un compte</b-button>
    <b-modal
      v-model="visible"
      title="Créer un compte"
      :destroyOnClose="true"
      @ok="submit"
    >
      <b-row type="flex">
        <b-col :span="24">
          <a-form layout="vertical">
            <b-form-item label="Pseudo">
              <a-input
                placeholder="Pseudo"
                v-model="form.name"
                required
                autoFocus
              >
                <b-icon
                  slot="prefix"
                  type="user"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </b-form-item>

            <b-form-item label="Email">
              <a-input
                placeholder="Email"
                v-model="form.email"
                required
                value
                type="email"
              >
                <b-icon
                  slot="prefix"
                  type="mail"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </b-form-item>

            <b-form-item label="Mot de passe">
              <a-input-password
                placeholder="Mot de passe"
                v-model="form.password"
                required
                value
                type="password"
                @pressEnter="submit"
              >
                <b-icon
                  slot="prefix"
                  type="lock"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input-password>
            </b-form-item>
          </a-form>

          <Alert type="error" :alert="error" />
        </b-col>
      </b-row>
      <template slot="footer">
        <b-button key="back" @click="toggleModal">
          Annuler
        </b-button>
        <b-button
          key="submit"
          type="primary"
          @click="submit"
          :disabled="isDisabled"
        >
          Go
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
export default class Register extends Vue {
  private form: { name: string; email: string; password: string } = {
    name: "",
    email: "",
    password: ""
  };
  private visible = false;
  private isRegistering = false;

  get error() {
    return this.$store.getters["auth/errorOf"](errorTypes.REGISTER);
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
