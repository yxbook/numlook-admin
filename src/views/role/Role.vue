<template>
 <div>
   <Row style="margin-top: 15px" type="flex" justify="space-between">
     <Col span="5">
       <span style="margin: 0 10px;"><Button @click="showEditRoleModal" type="primary" icon="search">添加角色</Button></span>
       <span style="margin: 0"><Button type="error" @click="this.delete" icon="trash-a">批量删除</Button></span>
     </Col>
     <Col span="5">
       <Input v-model="params.keyword" placeholder="请输入昵称或描述" style="width: 200px"/>
       <span style="margin-left: 5px"><Button @click="searchRole" type="primary" icon="search">搜索</Button></span>
       <span><Icon type="refresh" style="font-size: 20px;position: relative;top: 4px;margin-left: 5px;"></Icon></span>
     </Col>
   </Row>
   <Row style="margin-top: 40px">
     <Table border ref="selection"
            :columns="columns"
            :loading="loading"
            :highlight-row="true"
            :current="params.pageNum"
            @on-selection-change="selectionChange"
            :data="roleData">

     </Table>
   </Row>
   <Row type="flex" style="margin-top: 45px" justify="space-between">
     <Col span="4">
       <Button @click="handleSelectAll(true)">全选</Button>
       <Button @click="handleSelectAll(false)">反选</Button>
     </Col>
     <Col >
       <Page :total="totalCount" :page-sise="params.pageSize" loading show-sizer @on-change="pageChange"
             @on-page-size-change="sizeChange"></Page>
     </Col>
   </Row>
   <Modal v-model="editRoleModal"
          :closable='true' :mask-closable=false
          @on-visible-change="resetData"
          width="600"
          @on-ok="saveEditRole"
          @on-cancel="cancelEditRole">
     <h3 slot="header" style="color:#2D8CF0">{{!isUpdate?'添加角色':'修改角色'}}</h3>
     <Form ref="editRoleForm"
           :model="editRoleForm"
           :label-width="100"
           label-position="right"
           :rules="roleValidate"
           @submit.native.prevent="saveEditRole">

       <FormItem label="角色名称" prop="ukName">
         <Input v-model="editRoleForm.ukName" placeholder="请输入角色名称"></Input>
       </FormItem>

       <FormItem label="角色描述" prop="remark">
         <Input v-model="editRoleForm.remark" placeholder="请输入角色描述"></Input>
       </FormItem>

       <FormItem label="权限列表" prop="menuList">
         <Tree :data='menuList' show-checkbox @on-check-change="treeCheckChange"></Tree>
       </FormItem>

     </Form>
   </Modal>
 </div>
</template>

<script>

  import API from '@/api';

  export default {
    name: "Role",
    data(){
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            width: 240,
            key: 'ukName',
            align: 'center'
          },
          {
            title: '角色描述',
            width: 240,
            key: 'remark',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              let editBtn = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showEditRoleModal(params);
                  }
                }
              }, '修改');
              let deleteBtn = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params);
                  }
                }
              }, '删除');
              return h(
                'div', [editBtn, deleteBtn]
              );
            }
          }
        ],
        roleData: [],
        totalCount: 0,
        selection: [],                              // 多选值
        menuList:  [],
        menuIdList: [],
        treeValue: [],                              // 当前选中的树
        loading: false,                             // 加载
        params: {
          pageNum: 1,
          pageSize: 10,
          keyword: ''
        },                   // 分页数据请求参数
        editRoleModal: false,                       // 是否显示编辑区域
        editRoleForm: {
          pkId: 0,
          ukName: '',
          remark: '',
          menus: []
        },              // 表单数据
        roleValidate: {
          ukName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ]
        },                        // 表单验证
        isUpdate: false                             // 是否为修改

      }
    },
    created(){
      this.init();
    },
    methods: {
      // TODO: 初始化
      init(){
        // 分页数据初始化
        this.loading = true;
        API.role.listPage(this.params).then(({data}) => {
          if (data && data.code == 0) {
            this.roleData = data.data.list;
            this.totalCount = data.data.totalCount;
          } else {
            this.$Message.error(data.msg);
          }
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });
        this.loading = false;

        this.menusInit();
      },

      // TODO: 菜单列表初始化
      menusInit(){
        // 获取菜单列表
        API.menu.all().then(({data}) => {
          if (data && data.code == 0) {
            this.menuList = data.data.menus;
          } else {
            this.$Message.error(data.msg);
          };
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });
      },

      // TODO: 全选 反选
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },

      // TODO: 重置表单数据
      resetData(val){
        if (!val){
          this.editRoleForm = {
            pkId: 0,
            ukName: '',
            remark: '',
            menus: []
          };
          this.menusInit();
          this.isUpdate = false;
        }
      },

      // TODO: 数据更新
      pageChange(num) {
        this.params.pageNum = num;
        this.init();
      },
      sizeChange(size) {
        this.params.pageSize = size;
        this.init();
      },

      // TODO: 查找
      searchRole(){
        this.init();
      },

      // TODO: 显示 编辑区域
      showEditRoleModal(params) {
        //如果是修改状态，则填充必要数据
        if (typeof params.row != 'undefined') {
          const role = params.row;
          this.editRoleForm.pkId = role.pkId;
          this.editRoleForm.ukName = role.ukName;
          this.editRoleForm.remark = role.remark;

          let parm = {
            "roleId": this.editRoleForm.pkId
          };

          let ids = [];

          API.role.resourceIds(parm).then(({data}) => {
            if (data && data.code == 0) {
              ids = data.data;
              // 角色-菜单 匹配
              this.menuList.forEach(v => {
                v.children.forEach(child => {
                  ids.forEach(id => {
                    if(id === child.pkId){
                      child['checked'] = true;
                    }
                  })
                })
              });
              console.log(this.menuList)
              // 修改为 修改信息 状态
              this.isUpdate = true;
              // 显示编辑区域
              this.editRoleModal = true;
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
            return;
          });
        }else {
          this.editRoleModal = true;
        }
      },

      // TODO: 添加 / 修改
      saveEditRole(){

        // 获取 角色 菜单资源
        this.treeValue.forEach(v => {
          this.editRoleForm.menus.push(v.pkId);
        })

        if (this.isUpdate){
          console.log('------update-------')
          API.role.update(this.editRoleForm).then(({data}) => {
            if (data && data.code == 0){
              this.init();
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        } else {
          console.log('------add-------')
          API.role.add(this.editRoleForm).then(({data}) => {
            if (data && data.code == 0){
              this.init();
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        }
      },

      cancelEditRole(){
        this.editRoleModal = false;
      },

      // TODO: 权限列表改变
      treeCheckChange(val){
        this.treeValue = val;
      },

      // TODO: 选择状态改变
      selectionChange(data){
        this.selection = data;
        console.log(this.selection)
      },

      // TODO: 批量删除 / 单个删除
      delete(params){

        let pkIds = [];

        if (typeof params.row != 'undefined') {
          pkIds.push(params.row.pkId);
        }else {
          this.selection.forEach( v => {
            pkIds.push(v.pkId)
          });
        };

        // 请求参数
        let param = {
          "pkIds": pkIds
        };

        API.role.batchDelete(param).then(({data}) => {
          if (data && data.code == 0) {
            this.init();
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

</style>
