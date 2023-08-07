<template>
  <Content ref="content" :loading="loading" classContent="">
    <div class="accordion accordion-flush" id="accordionPanelsStayOpenExample">
      <div class="accordion-item border-acordion">
        <div class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button p-3 bg-color-1 color-2 title-text"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
          <i class="bi bi-bell"></i>&nbsp;Notificaciones
          </button>
        </div>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body px-3 pt-0 pb-3">
            Content here
            <div>
              <RouterLink to="/notifications" class="color-2"> Ver mas</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item border-acordion">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
            class="accordion-button title-text p-3 bg-color-1 color-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTwo"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseTwo"
          >
          <i class="bi bi-bar-chart-line"></i>&nbsp;Estadisticas
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body px-3 pt-0 pb-3">
            Content here
            <div>
              <RouterLink to="/statistics" class="color-2"> Ver mas</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item border-acordion">
        <h2 class="accordion-header" id="panelsStayOpen-headingThree">
          <button
            class="accordion-button title-text p-3 bg-color-1 color-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseThree"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseThree"
          >
          <i class="bi bi-list-ul"></i>&nbsp;Navegación
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseThree"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingThree"
        >
          <div class="accordion-body px-3 pt-0 pb-3">
            <div class="row">
              <div class="col-6 mb-3" v-for="item in list" :key="item.title" v-on:click="goTo(item.url)">
                <div class="card box" :id="item.title">
                  <div class="card-body">
                    <p class="title-text mb-1"><i :class="item.icon"></i> {{ item.title }}</p>
                    <p class="text-secondary">{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
<style scoped>
.accordion-button:focus {
  box-shadow: none;
  outline: none !important;
}
.accordion-button {
  border: none !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;

  border-radius: 0px !important;
  box-shadow: none !important;
}
.acordion-home {
  border-radius: 0px !important;
}
.box {
  cursor: pointer;
  transition: 0.3s;
}

.border-acordion {
  border: 0;
  border-radius: 0px !important;
}

.box:hover {
  background-color: rgb(224, 224, 224);
}
</style>
<script>
import { defineComponent } from "vue";
import Content from "@/components/home/Content.vue";
export default defineComponent({
  name: "Home",
  props: ["title", "icon", "changeTopbar"],
  data() {
    return {
      list: [
        {
          title: "Entradas",
          desc: "Todo lo relacionado con entradas, agregar, editar y eliminar.",
          icon: "bi bi-box-arrow-in-right",
          url: "/inputs",
        },
        {
          title: "Salidas",
          desc: "Todo lo relacionado con salidas, agregar, editar y eliminar.",
          icon: "bi bi-box-arrow-left",
          url: "/outputs",
        },
        {
          title: "Productos",
          desc: "Todo lo relacionado con productos, agregar, editar y eliminar.",
          icon: "bi bi-box-seam",
          url: "/product",
        },
        {
          title: "Clientes",
          desc: "Todo lo relacionado con clientes, agregar, editar y eliminar.",
          icon: "bi bi-people",
          url: "/customer",
        },
        {
          title: "Proveedores",
          desc: "Todo lo relacionado con proveedores, agregar, editar y eliminar.",
          icon: "bi bi-truck",
          url: "/supplier",
        },
        {
          title: "Usuario",
          desc: "Perfil del usuario y algunos datos que son de utilidad para el sistema ",
          icon: "bi bi-person-vcard",
          url: "/user",
        },
      ],
      topbar: {
        title: "Inicio",
        icon: "bi bi-house",
        breadcrumb: [
          {
            name: "Inicio",
            link: "/home",
          },
        ],
      },
      loading: false,
    };
  },
  components: {
    Content,
  },
  methods: {
    goTo(url) {
      this.$router.push(url);
    },
  },
  created() {
    this.changeTopbar(this.topbar);
  },
});
</script>
