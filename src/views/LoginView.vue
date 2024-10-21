<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="/"><b>{{ $store.state.app.name }}</b></a>
    </div>

    <div class="card shadow-lg">
      <div class="card-body login-card-body d-flex flex-column justify-content-around p-4">
        <div class="text-center mb-4">
          <img src="/img/logo.png" alt="Logo de la empresa" class="login-logo">
        </div>

        <p class="login-box-msg">Inicia sesión para comenzar tu sesión</p>
        <form @submit.prevent="loginSubmit" class="d-flex flex-column justify-content-center">
          <div class="input-group mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control rounded-pill"
              placeholder="Correo electrónico"
            />
            <div class="input-group-append">
              <div class="input-group-text rounded-pill">
                <span class="fas fa-envelope text-primary"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              v-model="password"
              type="password"
              class="form-control rounded-pill"
              placeholder="Contraseña"
            />
            <div class="input-group-append">
              <div class="input-group-text rounded-pill">
                <span class="fas fa-lock text-primary"></span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-5 mb-3">
            <div class="icheck-primary">
              <input type="checkbox" id="remember" class="mr-2"/>
              <label for="remember"> Recuérdame </label>
            </div>
            <button type="submit" class="btn btn-primary rounded-pill px-4">
              Iniciar sesión
            </button>
          </div>
        </form>
        
        <div v-if="errorMessage" class="alert alert-danger mt-3 rounded-pill">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  beforeMount() {
    document.body.classList.remove('sidebar-mini');
    document.body.classList.add('login-page');
    document.title = `Login | ${this.$store.state.app.name}`;
  },
  beforeUnmount() {
    document.body.classList.remove('login-page');
    document.body.classList.add('sidebar-mini');
  },
  methods: {
    loginSubmit() {
      const validUser = 'dev@psa.com';
      const validPassword = '123123';

      if (this.email === validUser && this.password === validPassword) {
        this.$router.push({ name: 'home' });
      } else {
        this.errorMessage = 'Correo electrónico o contraseña incorrectos';
      }
    }
  }
};
</script>

<style scoped>
.login-box {
  width: 400px;
  margin: 7% auto;
}

.card {
  border-radius: 1rem;
}

.login-card-body {
  border-radius: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.login-logo {

}

.input-group .form-control {
  border-top-left-radius: 1.25rem;
  border-bottom-left-radius: 1.25rem;
}

.input-group .input-group-text {
  border-top-right-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
}

.btn {
  border-radius: 1.25rem;
}
</style>
