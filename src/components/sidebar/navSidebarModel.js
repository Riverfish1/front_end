define({
    "register": [
        {className: 'icon_homePage', href: '#/register/officeArea', title: '办公区登记'},
        {className: 'icon_homePage', href: '#/register/officeRoom', title: '办公室登记'},
        {className: 'icon_homePage', href: '#/register/company', title: '单位登记'},
        {className: 'icon_homePage', href: '#/register/department', title: '部门登记'},
        // {className: 'icon_homePage', href: '#/register/job', title: '职位登记'},
        {className: 'icon_homePage', href: '#/register/post', title: '职位登记'},
        {className: 'icon_homePage', href: '#/register/people', title: '人员信息登记'},
        {className: 'icon_homePage', href: '#/register/peopleType', title: '人员类型登记'},
        {className: 'icon_homePage', href: '#/register/visitors', title: '外来人员登记'},
    ],
    "work": [
        {className: 'icon_homePage', href: '#/work/meeting', title: '会议预定'},
        {className: 'icon_homePage', href: '#/work/todo', title: '待办事宜'},
        {className: 'icon_homePage', href: '#/work/staff', title: '通讯录'},
        // {className: 'icon_homePage', href: '#/work/staff', title: '人员档案'}
        {className: 'icon_homePage', href: '#', title: '发文管理', children: [
            {className: 'icon_homePage', href: '#/work/sendDocument', title: '发文管理'},
            {className: 'icon_homePage', href: '#/work/receiveDocument', title: '收文管理'}
        ]},
        {className: 'icon_homePage', href: '#/work/requestDocument', title: '请示报告'},
        {className: 'icon_homePage', href: '#/work/noticeManage', title: '通知管理'},
        {className: 'icon_homePage', href: '#/work/workAssign', title: '交办协办'},
        // {className: 'icon_homePage', href: '#', title: '办文管理', children: [
        //     {className: 'icon_homePage', href: '#/work/department', title: '待办收文'},
        //     {className: 'icon_homePage', href: '#/work/staff', title: '我的发文'},
        //     {className: 'icon_homePage', href: '#/work/department', title: '已办发文'},
        //     {className: 'icon_homePage', href: '#/work/staff', title: '收文流程'}
        // ]},
        {className: 'icon_homePage', href: '#', title: '小结', children: [
            {className: 'icon_homePage', href: '#/work/mySummary', title: '我的小结'},
            {className: 'icon_homePage', href: '#/work/summaryReceived', title: '收到的小结'}
        ]},
        {className: 'icon_homePage', href: '#/work/petitionMng', title: '信访管理'},
        {className: 'icon_homePage', href: '#', title: '领导预约', children: [
            {className: 'icon_homePage', href: '#/work/appointmentReceived', title: '收到的预约'},
            {className: 'icon_homePage', href: '#/work/myAppointment', title: '我的预约'}
        ]}
    ]
});