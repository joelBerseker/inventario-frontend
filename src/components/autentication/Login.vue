<template>
    <div class="mx-auto center justify-content-center bg-dark">
        <div class="container">
            <div class="row justify-content-md-center" align-h="center">
                <div class="col-4 mb-3 ">
                    <div class="card box">

                        <div class="card-body">
                            <p class="title-text mb-3">Sistema de Inventarios</p>
                            <div class="mb-3">
                                <label for="ruc" class="form-label">Usuario</label>

                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                                    <input type="text" class="form-control" id="ruc" required>

                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="direccion" class="form-label">Contraseña</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                    <input type="text" class="form-control" id="ruc" required>

                                </div>

                            </div>

                            <div class="text-end">
                                <button type="button" class="btn btn-dark btn-sm button-space ">
                                    <i class="bi bi-send"></i> Ingresar
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.center {
    height: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    margin: 0;
    overflow-x: hidden;
    overflow-y: hidden;

    min-height: 100%;
}
</style>
<script>
import { defineComponent } from "vue";
export default defineComponent({
    name: "Login",
    data() {
        return {
            list: [

            ]
        }
    },
    methods: {
        goTo(url) {
            this.$router.push(url);
        }
    }
});
</script>