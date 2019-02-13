<template>
  <div>
    <Row style="margin-top: 15px" type="flex" justify="space-between">
      <Col span="5">
        <span style="margin: 0 10px;"><Button type="primary" @click="showEditAdminModal" icon="search">添加管理员</Button></span>
        <span style="margin: 0"><Button @click="this.delete" type="error" icon="trash-a">批量删除</Button></span>
      </Col>
      <Col span="5">
        <Input v-model="params.keyword" placeholder="请输入昵称、手机号" style="width: 200px"/>
        <span style="margin-left: 5px"><Button type="primary" @click="searchAdmin" icon="search">搜索</Button></span>
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
             :data="adminData">

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
    <Modal v-model="editAdminModal"
           :closable='true' :mask-closable=false
           @on-visible-change="resetData"
           width="600"
           @on-ok="saveEditAdmin"
           @on-cancel="cancelEditAdmin">
      <h3 slot="header" style="color:#2D8CF0">{{!editAdminForm.pkId?'添加管理员':'修改管理员'}}</h3>
      <Form ref="editAdminForm"
            :model="editAdminForm"
            :label-width="100"
            label-position="right"
            :rules="adminValidate"
            @submit.native.prevent="saveEditAdmin">

        <FormItem v-if="!isUpdate" label="账号" prop="ukAccount">
          <Input v-model="editAdminForm.ukAccount" placeholder="请输入管理员账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="editAdminForm.password" type="password" placeholder="请输入管理员密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="rePassword">
          <Input v-model="editAdminForm.rePassword" type="password" placeholder="请确认管理员密码"></Input>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="editAdminForm.nickname" placeholder="请输入管理员昵称"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="editAdminForm.email" placeholder="请输入管理员邮箱"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="editAdminForm.phone" placeholder="请输入管理员手机号"></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="editAdminForm.status">
            <Radio :label="0">启用</Radio>
            <Radio :label="1">禁用</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="角色" prop="roleId">
          <Select v-model="editAdminForm.roleId">
            <Option v-for="role in roleList" :label="role.uk_name" :value="role.pk_id" :key="role.pk_id">
              {{role.uk_name}}
            </Option>
          </Select>
        </FormItem>

      </Form>
    </Modal>
  </div>
</template>

<script>
  import API from '@/api';
  import * as validate from '../../lib/validate'
  export default {
    name: "Admin",
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '账号',
            width: 140,
            key: 'ukAccount'
          },
          {
            title: '角色',
            width: 140,
            key: 'roles',
            render: (h, params) => {
              const row = params.row;
              const roleName = row.roles[0].ukName;
              return h('Tag', {}, roleName);
            }
          },
          {
            title: '昵称',
            width: 140,
            key: 'nickname'
          },
          {
            title: '手机号',
            width: 140,
            key: 'phone'
          },
          {
            title: '邮箱',
            width: 220,
            key: 'email'
          },
          {
            title: '状态',
            width: 120,
            key: 'status',
            render: (h, params) => {
              const row = params.row;
              const color = row.status === 0 ? 'green' : 'red';
              const text = row.status === 0 ? '已启用' : '已禁用';
              return h('Tag', {
                props: {
                  color: color
                }
              }, text);
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime'
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
                    this.showEditAdminModal(params);
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
        adminData: [],
        totalCount: 0,
        selection: [],                              // 多选值
        loading: false,                             // 加载
        roleList: [],                               // 角色列表
        params: {
          pageNum: 1,
          pageSize: 10,
          keyword: ''
        },                   // 分页数据请求参数
        editAdminModal: false,                      // 是否显示编辑区域
        editAdminForm: {
          pkId: 0,
          ukAccount: '',
          password: '',
          rePassword: '',
          nickname: '',
          phone: '',
          email: '',
          status: 0,
          roleId: 0
        },          // 表单数据
        adminValidate: {
          ukAccount: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          rePassword: [
            {required: true, message: '请再次输入密码', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: validate.valideEmail, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: validate.valideMoblie, trigger: 'blur'}
          ]
        },                       // 表单验证
        isUpdate: false                             // 是否为修改
      }
    },
    created() {
      // 初始化
      this.init();
    },
    methods: {
      // 初始化
      init() {
        // 分页数据初始化
        this.loading = true;
        API.admin.list(this.params).then(({data}) => {
          console.log(data)
          if (data && data.code == 0) {
            this.adminData = data.data.list;
            this.totalCount = data.data.totalCount;
          } else {
            this.$Message.error(data.msg);
          }
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });
        this.loading = false;

        // 如果角色列表数据为空 获取
        if (this.roleList.length === 0){
          API.role.list().then(({data}) => {
            if (data && data.code == 0) {
              this.roleList = data.data;
              console.log(this.roleList);
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        }
      },

      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },
      pageChange(num) {
        this.params.pageNum = num;
        this.init();
      },
      sizeChange(size) {
        this.params.pageSize = size;
        this.init();
      },

      // 重置表单数据
      resetData(val){
        if (!val){
          this.editAdminForm = {
            pkId: 0,
            ukAccount: '',
            password: '',
            rePassword: '',
            nickname: '',
            phone: '',
            email: '',
            status: 1,
            roleId: 0
          };
          this.isUpdate = false;
        }
      },
      showEditAdminModal(params) {
        //如果是修改状态，则填充必要数据
        if (typeof params.row != 'undefined') {
          const admin = params.row;
          this.editAdminForm.pkId = admin.adminId;
          this.editAdminForm.nickname = admin.nickname;
          this.editAdminForm.email = admin.email;
          this.editAdminForm.phone = admin.phone;
          this.editAdminForm.status = admin.status;
          this.editAdminForm.roleId = admin.roles[0].roleId;
          // 修改为 修改信息 状态
          this.isUpdate = true;
        }
        this.editAdminModal = true;
      },
      saveEditAdmin() {

        if ((this.editAdminForm.password !== '' || this.editAdminForm.rePassword !== '')
          && this.editAdminForm.password !== this.editAdminForm.rePassword) {
          this.$Message.error('两次密码不一致！');
          return;
        }

        if (this.validateAdminForm() != ''){
          this.$Message.error(this.validateAdminForm());
          return;
        }

        // TODO: 添加 / 修改
        if (this.isUpdate){
          API.admin.update(this.editAdminForm).then(({data}) => {
            if (data && data.code == 0) {
              this.init();
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        }else {
          API.admin.add(this.editAdminForm).then(({data}) => {
            if (data && data.code == 0) {
              this.init();
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        }
      },

      cancelEditAdmin() {
        this.editAdminModal = false;
      },

      // 查询
      searchAdmin(){
        this.init();
      },

      // 选择状态改变
      selectionChange(data){
        this.selection = data;
        console.log(this.selection)
      },

      // TODO: 批量删除 / 单个删除
      delete(params){

        let pkIds = [];

        if (typeof params.row != 'undefined') {
          pkIds.push(params.row.adminId);
        }else {
          this.selection.forEach( v => {
            pkIds.push(v.adminId)
          });
        };

        // 请求参数
        let param = {
          "pkIds": pkIds
        };

        API.admin.batchDelete(param).then(({data}) => {
          if (data && data.code == 0) {
            this.init();
          } else {
            this.$Message.error(data.msg);
          };
        }).catch((data) => {
          this.$Message.error('连接失败，请检查网络！');
        });

      },

      // 简单验证表单数据
      validateAdminForm(){

        if (this.editAdminForm.password == '' || this.editAdminForm.rePassword == ''){
          return '密码不能为空';
        }

        if (this.editAdminForm.nickname == ''){
          return '昵称不能为空';
        }

        if (this.editAdminForm.phone == ''){
          return '手机不能为空';
        }

        if (this.editAdminForm.email == ''){
          return '邮箱不能为空';
        }

        if (this.editAdminForm.roleId == 0){
          return '角色不能为空';
        }

        return '';
      }
    }
  }
</script>

<style scoped>
</style>
