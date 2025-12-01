export default function () {
  return useState('menuData', () => {
    return [
      {
        title: '首页',
        route: '/',
        child: [],
      },
      {
        title: '公司概况',
        route: '/gsgk#gsjj',
        child: [
          {
            title: '公司简介',
            route: '/gsgk#gsjj',
          },
          {
            title: '领导班子',
            route: '/gsgk#ldbz',
          },
          {
            title: '组织机构',
            route: '/gsgk#zzjg',
          },
          {
            title: '发展历程',
            route: '/gsgk#fzlc',
          },
        ],
      },
      {
        title: '新闻中心',
        route: '/xwzx?category=gsyw',
        child: [
          {
            title: '媒体聚焦',
            route: '/xwzx?category=gsyw',
          },
          {
            title: '公司要闻',
            route: '/xwzx?category=gsdt',
          },
          {
            title: '公司新闻',
            route: '/xwzx?category=gsgg',
          },
          {
            title: '职工园地',
            route: '/xwzx?category=mtjj',
          },
          {
            title: '图片新闻',
            route: '/xwzx?category=ztjj',
          },
        ],
      },
      {
        title: '企业文化',
        route: '/qywh/jituangongsi',
        child: [
          {
            title: '集团公司',
            route: '/qywh/jituangongsi',
          },
          {
            title: '四川公司',
            route: '/qywh/sichuanggongsi',
          },
          {
            title: '泸定公司',
            route: '/qywh/ludinggongsi',
          },
        ],
      },
      {
        title: '公告通知',
        route: '/ggtz/cwgk',
        child: [
          {
            title: '厂务公开',
            route: '/ggtz/cwgk',
          },
          {
            title: '党务公开',
            route: '/ggtz/dwgk',
          },
          {
            title: '日常通知',
            route: '/ggtz/rctz',
          },
          // {
          //   title: '工会团青',
          //   route: '/ggtz/ghtq',
          // },
          // {
          //   title: '纪检监察',
          //   route: '/ggtz/jjjc',
          // },
          // {
          //   title: '人力资源',
          //   route: '/ggtz/rlzy',
          // },
        ],
      },
    ]
  })
}
