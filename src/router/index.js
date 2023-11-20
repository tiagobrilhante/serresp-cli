import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import erro500 from '../views/errors/erro500.vue'
import erroToken from '../views/errors/erroToken.vue'
import Eventos from '../components/index/Eventos.vue'
import Assuntos from '../components/index/Assuntos.vue'
import AdmUsers from '../components/areaAdministrativa/admUsuarios/AdmUsuarios.vue'
import Configs from '../components/areaAdministrativa/configuracoes/Configuracoes.vue'
// import Reset from '../views/Reset.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      logado: true
    }
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: Eventos,
    meta: {
      publica: true
    }
  },
  {
    path: '/assuntos',
    name: 'assuntos',
    component: Assuntos,
    meta: {
      publica: true
    }
  },
  {
    path: '',
    name: 'index',
    component: Index,
    meta: {
      publica: true
    }
  },
  {
    path: '/erro500',
    name: 'erro500',
    component: erro500,
    meta: {
      logado: true
    }
  },
  {
    path: '/erroToken',
    name: 'erroToken',
    component: erroToken,
    meta: {
      logado: true
    }
  },
  {
    path: '/admusers',
    name: 'admUsers',
    component: AdmUsers,
    meta: {
      logado: true
    }
  },
  {
    path: '/configs',
    name: 'configs',
    component: Configs,
    meta: {
      logado: true
    }
  },
  {
    path: '*',
    component: Index
  },
  {
    path: '/reset',
    name: 'reset',
    meta: {
      logado: true
    },
    // component: Reset
    component: () => import(/* webpackChunkName: "Reset" */ '../views/Reset.vue')
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})
router.beforeEach((routeTo, routeFrom, next) => {
  if (!routeTo.meta.publica && !store.state.token) {
    return next({path: '/'})
  }

  if (routeTo.meta.logado && Object.values(store.state.usuarioLogado).length === 0) {
    return next({path: '/'})
  }

  next()
})

export default router
