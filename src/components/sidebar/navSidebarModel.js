/**
 * Created by yujian on 2017/08/14.
 */

define({
    "register": [
        {className: 'icon_homePage', href: '#/register/officeArea', title: '办公区登记'},
        {className: 'icon_homePage', href: '#/register/officeRoom', title: '办公室登记'},
        {className: 'icon_homePage', href: '#/register/company', title: '单位登记'},
        {className: 'icon_homePage', href: '#/register/department', title: '部门登记'},
        // {className: 'icon_homePage', href: '#/register/job', title: '职位登记'},
        {className: 'icon_homePage', href: '#/register/post', title: '职位登记'},
        {className: 'icon_homePage', href: '#/register/visitors', title: '外来人员登记'},
    ],
    "work":[
        // {className: 'icon_homePage', href: '#/work/department', title: '部门档案'},
        // {className: 'icon_homePage', href: '#/work/staff', title: '人员档案'}
        {className: 'icon_homePage', href: '#', title: '通讯录', children: [
            {className: 'icon_homePage', href: '#/work/department', title: '部门档案'},
            {className: 'icon_homePage', href: '#/work/staff', title: '人员档案'}
        ]},
        {className: 'icon_homePage', href: '#', title: '办文管理', children: [
            {className: 'icon_homePage', href: '#/work/department', title: '待办收文'},
            {className: 'icon_homePage', href: '#/work/staff', title: '我的发文'},
            {className: 'icon_homePage', href: '#/work/department', title: '已办发文'},
            {className: 'icon_homePage', href: '#/work/staff', title: '收文流程'}
        ]},
        {className: 'icon_homePage', href: '#', title: '通讯录', children: [
            {className: 'icon_homePage', href: '#/work/department', title: '部门档案'},
            {className: 'icon_homePage', href: '#/work/staff', title: '人员档案'}
        ]}
    ]
});