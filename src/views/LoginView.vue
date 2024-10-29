<script>
// Plugins --- Axios instance
import instance from "@/plugins/axios";

// Utils
import { Toast } from "@/utils/sweetalert2/toast";

export default {
  data() {
    return {
      loading: false,
      showPassword: false,

      email: "",
      password: "",
      successMessage: "",
      errorMessage: "",
    };
  },

  beforeMount() {
    // if the user is already logged in, redirect to the main page
    if (window.localStorage.getItem("token")) {
      this.$router.push("/");
    }
    document.title = `Dashboard | Login`;
  },

  methods: {
    async loginSubmit() {
      const body = {
        email: this.email,
        password: this.password,
      };

      if (!this.loading) {
        this.loading = true;

        try {
          const res = await instance.post("/login", body);
          this.errorMessage = "";

          window.localStorage.setItem("token", res.data.data.token);

          const message = "Inicio de sesión exitoso. Redirigiendo...";
          this.successMessage = message;

          // Toast.fire({
          //   icon: "success",
          //   title: `Inicio de sesión exitoso. Redirigiendo... <img src="/images/loading.gif" alt="" style="height: 1rem;">`,
          //   timer: 3000,
          // });

          setTimeout(() => {
            this.$router.push("/");
            this.loading = false;
          }, 3000)

        } catch (error) {
          this.loading = false;

          if (error.response.data.message === 'Email not found') {
            // const message = "Este email no esta registrado.";
            const message = "Datos invalidos.";
            this.errorMessage = message;
          } else if (error.response.data.message === 'Invalid user data') {
            // const message = "Contraseña incorrecta.";
            const message = "Datos invalidos.";
            this.errorMessage = message;
          } else {
            Toast.fire({
              icon: "error",
              title: "Error al iniciar sesión",
            });
          }
        }
      }
    },
  },
};
</script>

<template>
  <main :class="$style['main-container']">
    <section :class="$style['img-container']">
      <img src="/images/logo.png" alt="Dashboard image" />
    </section>

    <section :class="$style['login-container']">
      <aside :class="$style['login-box']">
        <h1>Ingreso al Dashborad</h1>

        <div style="
            background: #4f4ffb;
            height: 2px;
            width: 100%;
            margin-bottom: 17px;
          "></div>

        <form @submit.prevent="loginSubmit" method="post">
          <label for="email"> Nombre de usuario o correo electronico</label>
          <input :class="$style['input-text']" type="email" id="email" v-model="this.email" required />

          <label for="password"> Contraseña </label>
          <div style="
              display: flex;
              flex-direction: row;
              border: 1px solid #d1d5d9;
              border-radius: 4px;
            ">
            <input :class="$style['input-password']" :type="showPassword ? 'text' : 'password'" id="password"
              v-model="this.password" required />
            <span @click="showPassword = !showPassword" style="
                display: flex;
                justify-content: center;
                width: 9%;
                padding: 3px 5px;
                cursor: pointer;
                background: #dae0e6;
              " :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></span>
          </div>
          <br>

          <!-- <p>¿Olividaste tu contraseña? <b>Recuperarla</b></p> -->

          <button type="submit">
            <span v-if="loading">
              <img src="/images/loading.gif" alt="" style="height: 1rem;">
            </span>
            <span v-else>
              Iniciar sesión
            </span>
          </button>
          <!-- <button type="button">Solicitud usuario concesionario</button> -->
        </form>

        <!-- Success message -->
        <div style="padding: 5px 10px; white-space: nowrap; font-size: 13px; font-weight: 600; text-align: center;"
          v-show="successMessage" class="alert alert-success mt-4 rounded-pill">
          {{ successMessage }}
          <!-- <img src="/images/loading.gif" alt="" style="height: 0.75rem;"> -->
        </div>

        <!-- Error message -->
        <div style="padding: 5px 10px; white-space: nowrap; font-size: 13px; font-weight: 600; text-align: center;"
          v-show="errorMessage" class="alert alert-danger mt-4 rounded-pill">
          {{ errorMessage }}
        </div>
      </aside>
    </section>
  </main>
</template>

<style module>
.main-container {
  display: flex;
  justify-content: center;
  height: 100vh;
}

.img-container {
  display: none;
  justify-content: center;
  align-items: center;
  background-color: #e7f3fe;
  width: 50%;
}

.img-container img {
  width: 400px;
  height: auto;
}

/* --------------------------------------------------- */

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login-box {
  width: 80%;
  max-width: 450px;
}

.login-box h1 {
  font-size: 20px;
  font-weight: 700;
}

.login-box form {
  display: flex;
  flex-direction: column;
}

.login-box form label {
  color: #1a1a32;
  font-size: 14px;
  font-weight: 400 !important;
  margin-top: 10px;
  margin-bottom: 2px !important;
}

.login-box form .input-text {
  font-size: 14px;
  color: #1a1a32;
  font-weight: 400;
  border: 1px solid #d1d5d9;
  border-radius: 4px;
  padding: 4px 10px;
  outline: none;
}

.login-box form .input-password {
  font-size: 14px;
  color: #1a1a32;
  font-weight: 400;
  width: 91%;
  border: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 3px 10px;
  outline: none;
}

.login-box form p {
  font-size: 14px;
  color: #1a1a32;
  font-weight: 400;
  margin-top: 10px;
}

.login-box form p b {
  color: #4f4ffb;
  text-decoration: underline;
  cursor: pointer;
}

.login-box form button[type="submit"] {
  background-color: #4f4ffb;
  color: white;
  font-size: 14px;
  font-weight: 400;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  transition: background-color 0.3s;
}

.login-box form button[type="submit"]:hover {
  background-color: #3c3cfc;
}

.login-box form button[type="button"] {
  background-color: transparent;
  border: 1px solid #4f4ffb;
  color: #4f4ffb;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 5px 10px;
  margin-top: 10px;
}

@media screen and (min-width: 900px) {
  .main-container {
    justify-content: initial;
  }

  .img-container {
    display: flex;
  }

  .login-container {
    width: 50%;
  }

  .login-box {
    width: 60%;
  }
}
</style>
