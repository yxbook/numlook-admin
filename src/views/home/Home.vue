<template>
  <div class="layout">
    <Layout>
      <Sider breakpoint="md"
             collapsible :collapsed-width="78"
             v-model="isCollapsed">
        <Menu active-name="1-2"
              theme="dark" width="auto"
              @on-select="selectMenuName"
              @on-open-change="selectSubmenuNames"
              replace = "true"
              :open-names="openNames"
              :accordion="isAccordion"
              :class="menuitemClasses">

          <Submenu :name="menu.pkId" v-for="menu in getMenus" :key="menu.pkId">
            <template slot="title">
              <Icon type="ios-paper"/>
              {{menu.ukName}}
            </template>
            <MenuItem :name="child.path" :to="child.path" v-for="child in menu.children" :key="child.pkId">{{child.ukName}}</MenuItem>
          </Submenu>

        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header style="display: flex;align-items: center;justify-content: space-between" class="layout-header-bar">
          <router-link to="/home" style="color: #888888;"><Icon style="font-size: 40px;" type="logo-windows" /></router-link>
          <Dropdown>
            <Avatar href="javascript:void(0)" size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
            <!--<Icon ></Icon>-->
            <DropdownMenu slot="list">
              <DropdownItem>个人中心</DropdownItem>
              <DropdownItem><span v-on:click="logout">退出</span></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Header>
        <!-- height: '-webkit-fill-available' : 用来解决视图区域不兼容问题 -->
        <Content :style="{margin: '20px', height: '-webkit-fill-available', background: '#fff', minHeight: '220px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>

  import API from '@/api'

  export default {
    name: "Home",
    data() {
      return {
        isAccordion: true,    // 是否开启手风琴模式，开启后每次至多展开一个子菜单
        isCollapsed: false,
        openNames: [],
      };
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      // TODO: 获取权限菜单列表
      getMenus: function () {
        return this.$store.getters.getMenus;
      }
    },
    methods: {

      // TODO: 选择菜单（MenuItem）时触发  返回值： name
      selectMenuName: function (name) {
        console.log(name)
        // let path = 'home/'+name;
        // this.$router.push({path: path});
      },

      // TODO:当 展开/收起 子菜单时触发；当前展开的 Submenu 的 name 值数组
      selectSubmenuNames: function (names) {
        console.log(names)
      },

      // TODO: 退出
      logout: function () {
        API.common.logout().then(({data}) => {

          if (data.code == 0){
            // 清除 cookie
            this.$store.commit('logout');

            // 清除 权限菜单
            sessionStorage.removeItem('menus');

            // 跳转登录
            this.$router.push({path: '/'});

          } else {
            this.$Message.error(data.msg);
          };

        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });
      },

    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
