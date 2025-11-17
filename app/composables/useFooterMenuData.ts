export default function () {
  return useState("footerMenuData", () => {
    return [
      {
        title: "公司概况",
        route: "/gsgk/gsjj",
        child: [
          {
            title: "公司简介",
            route: "/gsgk/gsjj",
          },
          {
            title: "领导班子",
            route: "/gsgk/ldbz",
          },
          {
            title: "组织机构",
            route: "/gsgk/zzjg",
          },
          {
            title: "发展历程",
            route: "/gsgk/fzlc",
          },
        ],
      },
      {
        title: "新闻中心",
        route: "/xwzx/gsyw",
        child: [
          {
            title: "媒体聚焦",
            route: "/xwzx/mtjj",
          },
          {
            title: "公司要闻",
            route: "/xwzx/gsyw",
          },
          {
            title: "公司新闻",
            route: "/xwzx/gsxw",
          },
          {
            title: "职工园地",
            route: "/xwzx/zgyd",
          },
          {
            title: "图片新闻",
            route: "/xwzx/tpxw",
          },
        ],
      },
      {
        title: "党的建设",
        route: "/ddjs/djgz",
        child: [
          {
            title: "党建工作",
            route: "/ddjs/djgz",
          },
          {
            title: "工会团青",
            route: "/ddjs/ghtq",
          },
          {
            title: "党务公开",
            route: "/ddjs/dwgk",
          },
        ],
      },
      {
        title: "企业文化",
        route: "/qywh/index",
        child: [
          {
            title: "集团公司",
            route: "/qywh/jtgs",
          },
          {
            title: "四川公司",
            route: "/qywh/scgs",
          },
          {
            title: "泸定公司",
            route: "/qywh/ldgs",
          },
        ],
      },

      {
        title: "新闻媒体",
        route: "/xwmt/main",
        child: [
          {
            title: "央视网",
            route: "/xwmt/ysw",
          },
          {
            title: "人民网",
            route: "/xwmt/rmw",
          },
          {
            title: "新华网",
            route: "/xwmt/xhw",
          },
          {
            title: "共产党员网",
            route: "/xwmt/gcdyw",
          },
          {
            title: "中国共青团网",
            route: "/xwmt/zggqtw",
          },
          {
            title: "中国能源网",
            route: "/xwmt/zgnyw",
          },
          {
            title: "中国电力报",
            route: "/xwmt/zgdlb",
          },
        ],
      },
      {
        title: "华电网群",
        route: "/hdwq/main",
        child: [
          {
            title: "集团公司门户网站",
            route: "/hdwq/jtgsmhwz",
          },
          {
            title: "四川公司门户网站",
            route: "/hdwq/scgsmhwz",
          },
          {
            title: "OA办公平台",
            route: "/hdwq/oabgpt",
          },
          {
            title: "财务共享平台",
            route: "/hdwq/cwgxpt",
          },
        ],
      },
      {
        title: "政府机构",
        route: "/zfjg/main",
        child: [
          {
            title: "四川省人民政府网站",
            route: "/zfjg/scsrmzfwz",
          },
          {
            title: "四川省人力资源和社会保障厅",
            route: "/zfjg/scsrlzyshbzt",
          },
          {
            title: "四川省发展和改革委员会",
            route: "/zfjg/scsfzhggwyh",
          },
          {
            title: "甘孜藏族自治州人民政府网站",
            route: "/zfjg/gzzzzzrmzfwz",
          },
        ],
      },
    ]
  })
}
