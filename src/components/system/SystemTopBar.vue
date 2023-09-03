<script>
import { defineComponent, renderSlot } from "vue";

export default defineComponent({
  name: "TopBar",
  props: ["topbar"],
  inject: ["confirmLogout"],
  methods: {
    buttonLogout() {
      this.confirmLogout();
    },
  },
  computed: {
    /*styleBreadcrumb: function () {
      var resp = "";
      if (this.topbar.breadcrumb.length <= 1) {
        resp = "height: 0px";
      } else {
        resp = "height: 22px";
      }
      return resp;
    },*/
    userName: function () {
      var user = this.$store.getters.getUser;
      var resp = user.first_name + " " + user.last_name;
      return resp;
    },
  },
  created() {},
  data() {
    return {
      name: "Undefined",
    };
  },
});
</script>
<template>
  <div class="my-bg2 py-3 px-3 my-c1 content">
    <div class="row">
      <div class="col">
        <transition name="slide-fade" mode="out-in">
          <p :key="topbar.title" class="title-text"><i :class="topbar.icon"></i> {{ topbar.title }}</p>
        </transition>
      </div>
      <div class="col d-flex justify-content-end">
        <RouterLink to="/user" class="item-menu">
          <div class="content-item-menu"><i class="bi bi-person-vcard"></i> {{ userName }}</div>
        </RouterLink>
        <RouterLink to="/notifications" class="item-menu ms-1">
          <div class="content-item-menu"><i class="bi bi-bell"></i></div>
        </RouterLink>
        <button v-on:click="buttonLogout" type="button" class="btn btn-primary-outline btn-sm ms-1">
          <i class="bi bi-power"></i>
        </button>
      </div>
    </div>

    <div class="breadcrumb-content">
      <div>
        <div class="row mt-2">
          <div class="col-auto breadcrumb-item">
            <span v-if="topbar.breadcrumb.length > 1">
              <RouterLink :to="topbar.breadcrumb[topbar.breadcrumb.length - 2].link" class="my-c1">
                <i class="bi bi-arrow-left"></i> Atras
              </RouterLink>
            </span>
            <span v-else class="my-c6"><i class="bi bi-arrow-left"></i> Atras</span>
          </div>
          <div class="col">
            <transition name="slide-fade" mode="out-in">
              <nav :key="topbar.title" aria-label="breadcrumb" class="my-c1 margin-breadcrumb">
                <ol class="breadcrumb mb-0 breadcrumb-ol">
                  <li v-for="(item, index) in topbar.breadcrumb" :key="item.name" class="breadcrumb-item">
                    <RouterLink v-if="index <= topbar.breadcrumb.length - 2" :to="item.link" class="my-c1"
                      >{{ item.name }}
                    </RouterLink>
                    <span class="my-c6" v-else>{{ item.name }}</span>
                  </li>
                </ol>
              </nav>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.item-menu {
  text-decoration-line: none;
  color: var(--my-c1);
  border-radius: var(--my-br) !important;
  display: inline-block;
}
.content-item-menu {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 100rem;
}
.content-item-menu:hover,
.router-link-exact-active .content-item-menu {
  background-color: var(--my-c3);
}
.slide-fade-enter-active,
.slide-fade-enter {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.breadcrumb-content {
  transition: 0.3s;
}

.breadcrumb-ol {
  --bs-breadcrumb-divider-color: var(--my-c1);
}

.content {
  transition: 0.5s;
}

.breadcrumb a {
  color: var(--my-c1);
  text-decoration-line: none;
}

.breadcrumb-item a {
  text-decoration-line: none;
}

.margin-breadcrumb {
  margin-left: 1.5rem;
}

.breadcrumb .active {
  color: rgba(255, 255, 255, 0.377);
}

.active {
  color: rgba(255, 255, 255, 0.377) !important;
}
</style>
