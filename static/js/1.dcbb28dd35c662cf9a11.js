webpackJsonp([1],{"0IpB":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("Dd8w"),n=i.n(s),r=i("Sgn/"),a=i("T452"),o=i("0aAL"),c=i("qwAB"),l=i("y/jF"),h=i("3Q4o"),u={props:{data:{type:Array,default:function(){return[]}}},created:function(){this.touch={},this.listenScroll=!0,this.listHeight=[],this.probeType=3},computed:{shortcutList:function(){return this.data.map(function(t){return t.title.substr(0,1)})},fixedTitle:function(){return this.scrollY>0?"":this.data[this.currentIndex]?this.data[this.currentIndex].title:""}},data:function(){return{scrollY:-1,currentIndex:0,diff:-1}},components:{Scroll:c.a,Loading:l.a},watch:{data:function(){var t=this;setTimeout(function(){t._calculateHeight()},20)},scrollY:function(t){var e=this.listHeight;t>0&&(this.currentIndex=0);for(var i=0;i<e.length-1;i++){var s=e[i],n=e[i+1];if(-t>=s&&-t<n)return this.currentIndex=i,void(this.diff=n+t)}this.currentIndex=e.length-2},diff:function(t){var e=t>0&&t<30?t-30:0;this.fixedTop!==e&&(this.fixedTop=e,this.$refs.fixedTop.style.transform="translate3d(0, "+e+"px, 0)")}},methods:{selectItem:function(t){this.$emit("select",t)},onShortcutTouchStart:function(t){var e=Object(h.b)(t.target,"index"),i=t.touches[0];this.touch.y1=i.pageY,this.touch.anchorIndex=e,this._scrollTo(e)},onShortcutTouchMove:function(t){var e=t.touches[0];this.touch.y2=e.pageY;var i=(this.touch.y2-this.touch.y1)/18|0,s=parseInt(this.touch.anchorIndex)+i;this._scrollTo(s)},refresh:function(){this.$refs.listview.refresh()},scroll:function(t){this.scrollY=t.y},_scrollTo:function(t){(t||0===t)&&(t<0?t=0:t>this.listHeight.length-2&&(t=this.listHeight.length-2),this.scrollY=-this.listHeight[t],this.$refs.listview.scrollToElement(this.$refs.listGroup[t],0))},_calculateHeight:function(){this.listHeight=[];var t=this.$refs.listGroup,e=0;this.listHeight.push(e);for(var i=0;i<t.length;i++){e+=t[i].clientHeight,this.listHeight.push(e)}}}},f={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("scroll",{ref:"listview",staticClass:"listview",attrs:{data:t.data,"listen-scroll":t.listenScroll,probeType:t.probeType},on:{scroll:t.scroll}},[i("ul",t._l(t.data,function(e,s){return i("li",{key:s,ref:"listGroup",refInFor:!0,staticClass:"list-group"},[i("h2",{staticClass:"list-group-title"},[t._v(t._s(e.title))]),t._v(" "),i("ul",t._l(e.items,function(e,s){return i("li",{key:s,staticClass:"list-group-item",on:{click:function(i){t.selectItem(e)}}},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.avatar,expression:"item.avatar"}],staticClass:"avatar"}),t._v(" "),i("span",{staticClass:"name"},[t._v(t._s(e.name))])])}))])})),t._v(" "),i("div",{staticClass:"list-shortcut",on:{touchstart:t.onShortcutTouchStart,touchmove:function(e){e.stopPropagation(),e.preventDefault(),t.onShortcutTouchMove(e)}}},[i("ul",t._l(t.shortcutList,function(e,s){return i("li",{key:s,staticClass:"item",class:{current:t.currentIndex===s},attrs:{"data-index":s}},[t._v(t._s(e))])}))]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.fixedTitle,expression:"fixedTitle"}],ref:"fixedTop",staticClass:"list-fixed"},[i("h1",{staticClass:"fixed-title"},[t._v(t._s(t.fixedTitle))])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.data.length,expression:"!data.length"}],staticClass:"loading-container"},[i("loading")],1)])},staticRenderFns:[]};var d=i("VU/8")(u,f,!1,function(t){i("vXxm")},"data-v-8f662b9a",null).exports,v=i("NYxO"),g={mixins:[i("F4+m").b],data:function(){return{singers:[]}},created:function(){this._getSingerList()},components:{ListView:d},methods:n()({handlePlaylist:function(t){var e=t.length>0?"60px":"";this.$refs.singer.style.bottom=e,this.$refs.list.refresh()},selectSinger:function(t){this.$router.push({path:"/singer/"+t.id}),this.setSinger(t)},_getSingerList:function(){var t=this;Object(r.b)().then(function(e){e.code===a.a&&(t.singers=t._normalizeSinger(e.data.list))})},_normalizeSinger:function(t){var e={hot:{title:"热门",items:[]}};t.forEach(function(t,i){i<10&&e.hot.items.push(new o.a({id:t.Fsinger_mid,name:t.Fsinger_name}));var s=t.Findex;e[s]||(e[s]={title:s,items:[]}),e[s].items.push(new o.a({id:t.Fsinger_mid,name:t.Fsinger_name}))});var i=[],s=[];for(var n in e){var r=e[n];r.title.match(/[a-zA-Z]/)?s.push(r):"热门"===r.title&&i.push(r)}return s.sort(function(t,e){return t.title.charCodeAt(0)-e.title.charCodeAt(0)}),i.concat(s)}},Object(v.d)({setSinger:"SET_SINGER"}))},p={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{ref:"singer",staticClass:"singer-component"},[e("list-view",{ref:"list",attrs:{data:this.singers},on:{select:this.selectSinger}}),this._v(" "),e("router-view")],1)},staticRenderFns:[]};var m=i("VU/8")(g,p,!1,function(t){i("E5o+")},"data-v-82f55174",null);e.default=m.exports},"E5o+":function(t,e){},"Sgn/":function(t,e,i){"use strict";e.b=function(){var t=n()({},a.b,{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:1,loginUin:0,hostUin:0,platform:"yqq",needNewCode:0});return Object(r.a)("https://c.y.qq.com/v8/fcg-bin/v8.fcg",t,a.c)},e.a=function(t){var e=n()({},a.b,{hostUin:0,platform:"yqq",needNewCode:0,order:"listen",begin:0,num:100,songstatus:1,singermid:t});return Object(r.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",e,a.c)};var s=i("woOf"),n=i.n(s),r=i("Gak4"),a=i("T452")},vXxm:function(t,e){}});
//# sourceMappingURL=1.dcbb28dd35c662cf9a11.js.map