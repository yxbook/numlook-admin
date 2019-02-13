<template>
  <div style="display: flex;justify-content: space-between">
    <div class="left" style="background: #566473; width: 16%">
      <Tree style="font-size: 40px; color: #fff;"
            :data='menuList'
            ref="tree"></Tree>
    </div>
    <div class="right" style="width: 82%; padding-left: 7%; padding-top: 3%">
      <Form ref="editResourceForm"
            :model="editResourceForm"
            :label-width="100"
            :rules="menuValidate"
            label-position="right">

        <FormItem label="菜单名称" prop="ukName">
          <Input class="form-input" v-model="editResourceForm.ukName" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem label="路由路径" prop="path">
          <Input class="form-input" v-model="editResourceForm.path" placeholder="请输入路由路径"></Input>
        </FormItem>
        <FormItem label="资源权限" prop="perms">
          <Input class="form-input" v-model="editResourceForm.perms" placeholder="请确认资源权限"></Input>
        </FormItem>

        <FormItem label="排序数字" prop="orderNum">
          <Input class="form-input" v-model="editResourceForm.orderNum" placeholder="请输入排序数字"></Input>
        </FormItem>

        <FormItem label="菜单类型" prop="type">
          <RadioGroup @on-change="changeMenusType" v-model="editResourceForm.type">
            <Radio  :label="0">一级菜单</Radio>
            <Radio :label="1">二级列表</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="父级菜单" prop="roleId">
          <Select :disabled="isDisabled" class="form-input" v-model="editResourceForm.parentId">
            <Option v-for="parent in parentList" :label="parent.ukName" :value="parent.pkId" :key="parent.pkId">
              {{parent.ukName}}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="选择菜单">
          <Button type="warning" @click="treeClick">确认选择</Button>
        </FormItem>

        <FormItem label="执行操作">
          <Button type="success" @click="saveEditMeun('save')">添加</Button>
          <Button type="success" :disabled="isUpdate" @click="saveEditMeun('update')">修改</Button>
          <Button type="error" @click="this.delete">删除</Button>
        </FormItem>

      </Form>
    </div>
  </div>

</template>

<script>
  import API from '@/api';

  export default {
    name: "Menu",
    data() {
      return {
        isCollapsed: false,
        menuList: [],
        treeValue: [],
        editResourceForm: {
          pkId: 0,
          parentId: 0,
          ukName: '',
          path: '',
          perms: '',
          type: 0,
          orderNum: 0
        },
        menuValidate: {
          ukName: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'}
          ],
          path: [
            {required: true, message: '请输入路由路径', trigger: 'blur'}
          ],
          perms: [
            {required: true, message: '请输入资源权限', trigger: 'blur'}
          ],
          orderNum: [
            {required: true, message: '请输入排序数字', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择菜单类型', trigger: 'blur'}
          ]
        },                        // 表单验证
        parentList: [],
        isDisabled: true,
        isUpdate: true,
        selectTree: []
      }
    },
    mounted() {
      // 初始化
      this.menusInit();
    },
    methods: {

      // TODO: 菜单列表初始化
      menusInit() {
        // 获取菜单列表
        API.menu.all().then(({data}) => {
          if (data && data.code == 0) {
            this.menuList = data.data.menus;
            console.log('----------')
            console.log(this.menuList)
          } else {
            this.$Message.error(data.msg);
          }
          ;
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });

        // 父级菜单
        API.menu.parents().then(({data}) => {
          if (data && data.code == 0){
            this.parentList= data.data;
          } else {
            this.$Message.error(data.msg);
          }
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');

        });
      },

      // TODO: 选择菜单（MenuItem）时触发  返回值： name
      selectMenuName: function (name) {
        console.log(name)
      },

      // TODO:当 展开/收起 子菜单时触发；当前展开的 Submenu 的 name 值数组
      selectSubmenuNames: function (names) {
        console.log(names)
      },

      // TODO: 菜单类型改变
      changeMenusType(){
        if (this.editResourceForm.type == 0){
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
      },

      // TODO: 确认选择
      treeClick(){
        this.editResourceForm = this.$refs.tree.getSelectedNodes()[0];
        this.editResourceForm.ukName = this.$refs.tree.getSelectedNodes()[0].title;
        this.isUpdate = false;
      },

      // TODO: 保存 / 修改
      saveEditMeun(params){

        this.editResourceForm.orderNum = Number(this.editResourceForm.orderNum);

        if (this.editResourceForm.type == 0){
          this.editResourceForm.parentId = 0;
        }

        if (params === 'save'){

          API.menu.add(this.editResourceForm).then(({data}) => {
            if (data && data.code == 0){
              this.$Message.success('添加成功');
              this.menusInit();
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });
        } else if (params === 'update'){

          API.menu.update(this.editResourceForm).then(({data}) => {
            if (data && data.code == 0){
              this.$Message.success('修改成功');
              this.menusInit();
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
          this.isUpdate = true;
        }
      },

      // TODO: 删除所选菜单
      delete(){
        let params = {
          "pkId": this.$refs.tree.getSelectedNodes()[0].pkId
        };

        API.menu.deleteMenu(params).then(({data}) => {
          if (data && data.code == 0){
            this.$Message.success('删除成功');
            this.menusInit();
          } else {
            this.$Message.error(data.msg);
          };
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });
      }

    }
  }
</script>

<style scoped>
  .left >>> .ivu-tree-title {
    color: rgba(255, 255, 255, .7);
    font-size: 18px;
  }

  .left {
    padding-left: 30px;
  }

  .form-input{
    width: 40%;
  }
</style>
