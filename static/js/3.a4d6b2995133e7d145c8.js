webpackJsonp([3],{"Sgn/":function(t,n,e){"use strict";n.b=function(){var t=i()({},o.b,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,loginUin:0,hostUin:0,platform:"yqq",needNewCode:0});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/v8.fcg",t,o.c)},n.a=function(t){var n=i()({},o.b,{hostUin:0,platform:"yqq",needNewCode:0,order:"listen",begin:0,num:100,songstatus:1,singermid:t});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",n,o.c)};var s=e("woOf"),i=e.n(s),a=e("Gak4"),o=e("T452")},deFt:function(t,n){},lEJ1:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("Dd8w"),i=e.n(s),a=e("NYxO"),o=e("Sgn/"),r=e("T452"),c=e("PvFA"),g=e("kvay"),l={data:function(){return{songs:[],vkey:""}},computed:i()({title:function(){return this.singer.name},bgImage:function(){return this.singer.avatar}},Object(a.c)(["singer"])),created:function(){console.log("当前选择的歌手是：",this.singer.name),console.log(this.singer),this._getDetail()},components:{MusicList:g.a},methods:{_getDetail:function(){var t=this,n=this.singer.id;n?Object(o.a)(n).then(function(n){n.code===r.a&&(t.songs=t._normalizeSongs(n.data.list),console.log("当前歌手的100首歌曲:"),console.log(t.songs))}):this.$router.push({path:"/singer"})},_normalizeSongs:function(t){var n=[];return t.forEach(function(t){var e=t.musicData;e.songid&&e.albummid&&n.push(Object(c.a)(e))}),n}}},u={render:function(){var t=this.$createElement,n=this._self._c||t;return n("transition",{attrs:{name:"slide"}},[n("music-list",{attrs:{songs:this.songs,title:this.title,"bg-image":this.bgImage}})],1)},staticRenderFns:[]};var f=e("VU/8")(l,u,!1,function(t){e("deFt")},"data-v-73d19fa7",null);n.default=f.exports}});
//# sourceMappingURL=3.a4d6b2995133e7d145c8.js.map