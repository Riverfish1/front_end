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
            {className: 'icon_homePage', href: '#/work/createWorkFlow', title: '流程管理'},
            {className: 'icon_homePage', href: '#/work/sendDocument', title: '发文管理'},
            {className: 'icon_homePage', href: '#/work/receiveDocument', title: '收文管理'}
        ]},
        {className: 'icon_homePage', href: '#/work/requestDocument', title: '请示报告'},

        {className: 'icon_homePage', href: '#', title: '通知管理', children: [
            {className: 'icon_homePage', href: '#/work/sendNoticeRecord', title: '我发布的通知'},
            {className: 'icon_homePage', href: '#/work/receiveNoticeRecord', title: '我收到的通知'}
        ]},
        {className: 'icon_homePage', href: '#', title: '交办协办', children: [
            {className: 'icon_homePage', href: '#/work/createCooperation', title: '我发起的交办'},
            {className: 'icon_homePage', href: '#/work/receiveCooperation', title: '我收到的交办'}
        ]},

        {className: 'icon_homePage', href: '#', title: '总结', children: [
            {className: 'icon_homePage', href: '#/work/mySummary', title: '我的总结'},
            {className: 'icon_homePage', href: '#/work/summaryReceived', title: '收到的总结'}
        ]},
        {className: 'icon_homePage', href: '#/work/petitionMng', title: '信访管理'},
        {className: 'icon_homePage', href: '#/work/appointmentReceived', title: '领导预约', children: [
            {className: 'icon_homePage', href: '#/work/appointmentReceived', title: '收到的预约'},
            {className: 'icon_homePage', href: '#/work/myAppointment', title: '我的预约'}
        ]},
        {className: 'icon_homePage', href: '#/work/auth', title: '工作授权'}
    ],
    "assess": [
        {className: 'icon_homePage', href: '#/assess/personnelSummary', title: '个人绩效'},
        {className: 'icon_homePage', href: '#/assess/leaderCommunicate', title: '领导审核'},
        {className: 'icon_homePage', href: '#/assess/kpiManage', title: '考核指标管理'},
        {className: 'icon_homePage', href: '#/assess/assignManage', title: '临时交办管理'},
        {className: 'icon_homePage', href: '#/assess/attendance', title: '考勤', children: [
            {className: 'icon_homePage', href: '#/assess/attendance', title: '考勤'},
            {className: 'icon_homePage', href: '#/assess/myAttendance', title: '我的考勤'},
        ]},
    ],
    "support": [
        {className: 'icon_homePage', href: '#', title: '差旅报销管理', children: [
            {className: 'icon_homePage', href: '#/support/createRepay', title: '我的报销'},
            {className: 'icon_homePage', href: '#/support/receiveRepay', title: '待处理的报销'}
        ]},
        {className: 'icon_homePage', href: '#/support/feeQuery', title: '借款报销查询'},
        {className: 'icon_homePage', href: '#/support/assetsRecord', title: '资产', children: [
            {className: 'icon_homePage', href: '#/support/assetsRecord', title: '资产登记'},
            {className: 'icon_homePage', href: '#/support/officeMaterials', title: '办公用品'},
            {className: 'icon_homePage', href: '#/support/emergencyMaterials', title: '应急物资'},
            {className: 'icon_homePage', href: '#/support/fileRecord', title: '文件登记'},
            {className: 'icon_homePage', href: '#/support/assetsReceive', title: '资产领用'},
            {className: 'icon_homePage', href: '#/support/assetsMaintain', title: '资产维修'},
            {className: 'icon_homePage', href: '#/support/assetsScrap', title: '资产报废'},
            {className: 'icon_homePage', href: '#/support/assetsWarn', title: '资产预警'},
            {className: 'icon_homePage', href: '#/support/assetsCount', title: '资产统计'},
            {className: 'icon_homePage', href: '#/support/assetsCate', title: '资产类别管理'},
        ]},
        {className: 'icon_homePage', href: '#/support/equipIn', title: '单警装备', children: [
            {className: 'icon_homePage', href: '#/support/equipIn', title: '装备入库'},
            {className: 'icon_homePage', href: '#/support/equipOut', title: '装备出库'},
            {className: 'icon_homePage', href: '#/support/equipAllot', title: '装备调拨'},
            {className: 'icon_homePage', href: '#/support/stocking', title: '库存盘点'},
            // {className: 'icon_homePage', href: '#/support/equipCollect', title: '装备领用'},
            {className: 'icon_homePage', href: '#/support/equipMng', title: '装备管理'},
            {className: 'icon_homePage', href: '#/support/storeMng', title: '仓库管理'},
            {className: 'icon_homePage', href: '#/support/assetsCar', title: '车辆管理'},
            // {className: 'icon_homePage', href: '#/support/equipQuery', title: '装备查询'},
            {className: 'icon_homePage', href: '#/support/storeQuery', title: '库存查询'}
        ]}
    ],
    "training": [
      {className: 'icon_homePage', href: '#/training/cert', title: '个人证书登记'},
      {className: 'icon_homePage', href: '#/training/cultivation', title: '培训记录'},
      {className: 'icon_homePage', href: '#/training/case', title: '经典案例'},
      {className: 'icon_homePage', href: '#/training/knowledge', title: '知识库'},
      {className: 'icon_homePage', href: '#/training/selfLearning', title: '自学记录'}
    ]
});
