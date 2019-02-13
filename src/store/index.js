import Vue from 'vue';
import Vuex from 'vuex';
import API from '@/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    menus: []
  },
  getters: {
    getMenus: state => {
      state.menus = JSON.parse(sessionStorage.getItem("menus"));
      return state.menus;
    }
  },
  mutations: {
    updateResource(state, params) {
      state.menus = params;
    },
    logout(state){
      Vue.cookie.delete('token');
      Vue.cookie.delete('username');
    },
  },
  actions: {
    // 获取资源权限列表
    getResource(context, params){
      API.menu.resouce(params).then(({data}) => {
        if (data.code == 0) {
          sessionStorage.setItem("menus",JSON.stringify(data.data.menus));
          context.commit('updateResource', data.data.menus);
        } else {
          this.$Message.error(data.msg);
        }
      })
    }
  },
  modules: {}
});

export default store;
