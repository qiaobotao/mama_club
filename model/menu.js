/**
 * Created by qiaojoe on 15-9-29.
 */

var config = require('../config');
var urlencode = require('urlencode');

module.exports = {
    // 任务催报要获取openid连接，
    //https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect

    // 菜单信息
    jinheMenu : {

        "button": [

            {
                "name": "农事",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "任务催报",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wechat_develop.appId+"&redirect_uri="+urlencode('http://www.zhibaoinfo.org/openid')+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
                    },
                    {
                        "type": "click",
                        "name": "病虫害防治",
                        "key": "V1_BCHFZ"
                    },
                    {
                        "type": "click",
                        "name": "植保知识",
                        "key": "V1_ZBZS"
                    },
                    // 原始链接
                    {
                        "type": "click",
                        "name": "种植技术",
                        "key": "V1_ZZJS"
                    }
                ]
            },
            {
                "name": "要闻",
                "sub_button": [
                    {
                        "type": "click",
                        "name": "预测分析",
                        "key": "V2_YCFX"
                    },
                    {
                        "type": "click",
                        "name": "要闻公告",
                        "key": "V2_YWGG"
                    },
                    {
                        "type": "click",
                        "name": "农业资讯",
                        "key": "V2_NYZX"
                    }
                ]
            },
            // 原始链接
            {
                "type":"view",
                "name":"植保社区",
                "url":"http://wsq.qq.com/reflow/263360999"
            },

        ]
    },

    // 预先设置好的信息
    /**
     * 要闻公告
     */
    picNews_YWGG: [
        {
            title: '小麦条锈病冬繁动态和发展趋势',
            description: '小麦条锈病冬繁动态和发展趋势',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYssYWYWN064BuL3AQWHNQgaXR7euaOvuADbOdpH3AnQ2kFg0W9mibuUF3U5yEe3UhrohYExQ9gpDvg/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202680216&idx=1&sn=5813fe835f0fa9118582c6855d08e6a2#rd'
        },
        {
            title: '2015年农业发展趋势及未来几大爆点',
            description: '2015年农业发展趋势及未来几大爆点',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYssYWYWN064BuL3AQWHNQganscaRBibtbLFPrX3ibsZ34oic46rj8ibNtml8B4WqmpCnrnXbwNrc2RRoA/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203276576&idx=2&sn=842af730744a8f91c2568890d71d3054#rd'
        },
        {
            title: '识别假劣种子的方法',
            description: '识别假劣种子的方法',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYv5ooRLomBQgQrUxMHHfOtHQIUnFeJJ3DWeJvj1DSN2F1fvZZkVGzAJdVOhzncU3sUNlh8MU6QfLw/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202680216&idx=3&sn=fa28a13fe604cf67f4ae1cdf927876c3#rd'
        },
        {
            title: '农药减量靠什么来实现？',
            description: '农药减量靠什么来实现？',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYsibEf3VzLAjsXgmBC9iaTw4SSz9Mb1AEiaw8g15VrSYq1MojpzdqYLGCjn64qUU3kLTKEpicicVGJ0Aiaw/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202680216&idx=4&sn=4f6528be033a43e7018080502804c20e#rd'
        }

    ],
    /**
     * 病虫害防治
     */
    picNews_BCHFZ: [
        {
            title: '农业部部署玉米粘虫防控工作',
            description: '农业部部署玉米粘虫防控工作',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuichLA6Jb3jsZHoKBE4Ayc4uIaXeDETy7vJEbu7gjc9nWplqNSsmpiaTsibsfFJOB6kPZzRiagOmxj3A/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=207869891&idx=1&sn=de59048084a01e2aa0b5995d366f74be#rd'
        },
        {
            title: '棉花立枯病发病特点及防治',
            description: '棉花立枯病发病特点及防治',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYtCpVI2wKJOJJzN4yAc8YZatcfnbw7Bsn62ib4RScdWNoiaBGxKic2pmP72SKlqMEicxkgoYTDfHJhT6w/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=208747269&idx=7&sn=7366259cbb7b82f0f0022e66e3d98936#rd'
        },
        {
            title: '果树秋季施肥技术要点',
            description: '果树秋季施肥技术要点',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvQbcLqXLSnlBPs8mw1J3Pehnc8oicNRhk45j2aSbec8EaQ32mYmso5Xp1ia3qSKcesNXiaMYtQEIpZg/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=209089544&idx=7&sn=10ae7e176a0a22cb96bac3ccc99784ab#rd'
        },
        {
            title: '玉米锈病要早防除',
            description: '玉米锈病要早防除',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvLn7xvXs1L9R4gsxF6sGDpY6qiciaD5GFWpicshS4ECF2Qgu5ic9XpBsoIq9HReRuT9fBLXof39ygLcg/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=208466928&idx=3&sn=739ccfbafae1815bd357987db939bb1e#rd'
        },
        {
            title: '蔬菜地下害虫要如何防治？',
            description: '蔬菜地下害虫要如何防治？',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYv75nKRThcZFIj8YiagRkOb2TCle6Qme1ZYSBV3G5uZErLrDQNrGfIyia1EpYa9ySl2gxWKVIFp7FDA/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=208156552&idx=5&sn=7435e7d1e7bc098cb8f50439ae3c9514#rd'
        },
        {
            title: '玉米伏旱及其综合防御方式介绍',
            description: '玉米伏旱及其综合防御方式介绍',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvvc3aJdGtkzfmQMJsNqj2gXicb7Kbbp7WT4zZ9SU8Z8fk5wjJuTR5C04nmKzpYBibL1opz1nEXhvsw/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=207970262&idx=7&sn=29407aaa1d3be9c08a423516edd959f0#rd'
        }

    ],

    /**
     * 植保知识
     */
    picNews_ZBZS: [
        {
            title: '五大效益最好的农业经营模式',
            description: '五大效益最好的农业经营模式',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYu9nwy5XdiaToNs79QpGAVMpKQpR5Xyw49kank7PsTjRvebkgBtMXVfrm8870KkgZtK5unSUdBZH3g/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202986025&idx=1&sn=3b419810e0ef399b8b8bff8cb1ca220f#rd'
        },
        {
            title: '这总结很权威，成为植保专家不难！',
            description: '这总结很权威，成为植保专家不难！',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuvPfTH5OFtRt6FaHThG4oIVredUyhKHMSI7vyiacEsaibDIAibwicIsKTOGMtEDy7C1Ct8zNfbC7iaI7w/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=208941621&idx=7&sn=8b9a4d38bdb589c7a14326cfd0a4cb36#rd'
        },
        {
            title: '【农技农识】施用化肥十二忌',
            description: '【农技农识】施用化肥十二忌',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuQcfpicoYLuHRnjCtlNwadYEN50Uf0vuxCKMgpPiaKyKf5RW2EuOJ1osU3xBSCRnj6ic07hxEiajPzAA/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203126827&idx=4&sn=7ad3030d961999534fc6e39096b94c1b#rd'
        },
        {
            title: '农资人须掌握的土壤知识',
            description: '农资人须掌握的土壤知识',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvCHruEyPpJd0j4gI8JmlSxiba2uLmjSNUtwj2snQ06aZQX6JXFFjia3E2wmwEcHPkiaOWNaD3Wsmic2Q/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203894492&idx=4&sn=6a87ebfba69e409eab284bad85de76e8#rd'
        },
        {
            title: '防治小麦赤霉病要谨防五个误区',
            description: '防治小麦赤霉病要谨防五个误区',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvysPRYKfGFBcO1G04VdTNFZ3JSM5eRcibpBuZwIOCCgRwjI9ibJltKDtxGMAaIaZSkmqpgIx0lEBAQ/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=204267867&idx=4&sn=8ab002eadf37ff343dbac8fd443f980d#rd'
        }
    ],

    /**
     * 种植技术
     */
    picNews_ZZJS: [
        {
            title: '十月农事管理指南（内含粮食、果树、蔬菜）',
            description: '十月农事管理指南（内含粮食、果树、蔬菜）',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYsckdS2iczx4KRDcxv1O6urHqsAJhr4hBdMZcfFeRxFI6npq3fcWa6NbuicaEyOibxXbxH64CzicgLibpg/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=400383187&idx=1&sn=27323039529d6b4e3318bbd3a227a9dc#rd'
        },
        {
            title: '小麦拌种技术指南',
            description: '小麦拌种技术指南',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuqDGvjfIjvaauibkGvLaNRtNo7aoB3jWYuIFzRXmCn4n8v9NvP1AOEgLmxdTgSu2670D6bg1NNhiag/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=400063044&idx=5&sn=8b9e394c70de329e2b6c186d5f336eb6#rd'
        },
        {
            title: '春季大棚蔬菜移栽技术要点',
            description: '春季大棚蔬菜移栽技术要点',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuaBUGsc7nHibGWVeHj6JINBQ4s4wX7vs1qAm4njS5hM417Xcib0o5hS1Iwp7EVNXofop9azicz7rojA/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203276576&idx=6&sn=1f343fd57d5c0ae6a2624fc55620495f#rd'
        },
        {
            title: '雾霾天气设施蔬菜管理技术',
            description: '雾霾天气设施蔬菜管理技术',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuaBUGsc7nHibGWVeHj6JINBOUE06uPDHiaG7USW4knWaez8vkibufoEPf1n6DibzX7y2f6B1hANuB1rw/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203276576&idx=3&sn=d3466128faef7f2830965d7d910805da#rd'
        },
        {
            title: '小麦高产栽培技术',
            description: '小麦高产栽培技术',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuK7a5GBsmMibcE025RY6otY7JicfsvhrPXN3vW77v08wDMTJT8h6rhxiaT5o2PGtgFZKsdzFicvGs39Q/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=203413472&idx=4&sn=fb8e4f4129374fb0d9b419440bf9b414#rd'
        }

    ],

    /**
     * 预测分析
     */
    picNews_YCFX: [
        {
            title: '2015年全国小麦重大病虫害发生趋势预报',
            description: '2015年全国小麦重大病虫害发生趋势预报',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYsUia4GXibcs55uEPg4DJt30qKhS1IxGv9HYNYyvWTBGYKdiafVLALiaMSh2p2RXNXsFJjVF4gaQYPO5w/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202282222&idx=1&sn=530672a1fb2fd95514304e0ae30c85a8#rd'
        },
        {
            title: '长江流域小麦赤霉病发生警报',
            description: '长江流域小麦赤霉病发生警报',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvtVjEvxPQia6eDRia2H9OE1xpY3QzjtSyAGy1UmZ3ItyicTjcnNHteLV4GjNZcBjRr1D28bOlrVavaA/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=204078718&idx=3&sn=d8e8e3216cb4b90443a82d85340e2eb1#rd'
        },
        {
            title: '一代草地螟发生趋势预报',
            description: '一代草地螟发生趋势预报',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuNgenXibjA8LuRgH635o3mmUJf83sVibicap2ibYr6ZymNlvpibX1yuKhrOb5lAIibFJ1Cicn1l3uRLKdnw/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=206197501&idx=3&sn=db11a8880362af7cfd911564ce0b8248#rd'
        },
        {
            title: '南方春播马铃薯晚疫病发生趋势预报',
            description: '南方春播马铃薯晚疫病发生趋势预报',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuwibkMtOQ7D0ic98NMASZl4xL4FzXTRSmjica3UgL4OIL4bMcnjWfVBZK1ibviaycwCRFLZk0Ticibb8sYw/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=204452493&idx=2&sn=dc0677dbe57edc535d24b08bf31aad56#rd'
        },
        {
            title: '晚稻主要病虫害发生动态',
            description: '晚稻主要病虫害发生动态',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuvPfTH5OFtRt6FaHThG4oIYmenBDsqzfibCFfN3Qk9Ye4xNOhOMCYV0g9p2yw4SiazXCapatdtrc6w/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=208941621&idx=2&sn=ce39bf7bcca908f09f3c62365b393f4a#rd'
        }

    ],

    /**
     * 农业资讯
     */
    picNews_NYZX: [
        {
            title: '职业农民是如何“炼”成的？',
            description: '职业农民是如何“炼”成的？',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYsqaP9918ePzCQORPYlkTameZiaVaK5fIe1iculicNKgibYsibRsOQMjQ7sSjfibeKlKCXSVILibcxzwzU0w/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=201218662&idx=1&sn=cafd661eea323f0daf64f79b31b945c0#rd'
        },
        {
            title: '农资电商：一个需要勇敢探索的模式',
            description: '农资电商：一个需要勇敢探索的模式',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYv5ooRLomBQgQrUxMHHfOtHUfIscbEZZ8LgrRNC42aTHbaMtucHm9e36oHRSoTcuia8jdAibtRvKYSQ/0',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=202680216&idx=2&sn=0780caf9b1107e7616ce866dc50531d2#rd'
        },
        {
            title: '一句话解读最新农业政策',
            description: '一句话解读最新农业政策',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuwibkMtOQ7D0ic98NMASZl4xwZSR2rgYSvIkFmOKGDMWjYibRQicEj4NHCH3YyfrdwYropG6oZ4MJRrA/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=204452493&idx=4&sn=2ab4df9b0ca961b9ab9c5ad4d0f5db0f#rd'
        },
        {
            title: '农业部组织农企合作共建示范基地 使化学农药使用量减少20%以上',
            description: '农业部组织农企合作共建示范基地 使化学农药使用量减少20%以上',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYvP6uC84C7iaT9b34393d4xLVLUI8WXfeHE2yNAFc5mZeB857gD3JNFJfHh3bsDWv0vkTib8zpsxC7A/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=205109247&idx=3&sn=073fb8388fb0f04f466010b23aaab798#rd'
        },
        {
            title: '“互联网+农业”碰撞出的四大商机',
            description: '“互联网+农业”碰撞出的四大商机',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYuichLA6Jb3jsZHoKBE4Ayc4UmLc9TaPY90IfarKzNAyRc8fQTI5E8JBdZOuul4XckkPC3D11wa4ag/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=207869891&idx=2&sn=6cb9145b5f4db0c7f746d3c908616c17#rd'
        },
        {
            title: '农业大数据 六大领域数据亟待推广',
            description: '农业大数据 六大领域数据亟待推广',
            picurl: 'https://mmbiz.qlogo.cn/mmbiz/OsIXAU8rcYtJM62BUA6fBiaMopLe7xl0cvMQk14GNOYlPRLNibEpeibVYqVILiaicRbUCWF9S3ic8P5PbqfOAIhicibK4Q/0?wx_fmt=jpeg',
            url: 'http://mp.weixin.qq.com/s?__biz=MzAxMjAxNzE5Mg==&mid=401145514&idx=4&sn=9885e6765d7217d295690d37923ef075#rd'
        }

    ]
};