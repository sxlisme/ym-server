webpackJsonp([11],{"5OHe":function(t,e){},CR4v:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("lRwf"),o=n.n(i),a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("transition",{attrs:{name:this.transitionName}},[e("router-view",{staticClass:"Router"})],1)],1)},staticRenderFns:[]};var r=n("C7Lr")({name:"App",data:function(){return{transitionName:""}},watch:{$route:function(){this.$router.isleft&&(this.transitionName="slideleft"),this.$router.isright&&(this.transitionName="slideright")}}},a,!1,function(t){n("CR4v")},null,null).exports,s=n("SJI6"),l=n.n(s),c=n("a3Yh"),p={state:{number:1},mutations:n.n(c)()({},"SET_NUM",function(t,e){t.number=e}),actions:{},getters:{number:function(t){return t.number}}},u=n("bg9d"),h=n.n(u);o.a.use(l.a);var m=new l.a.Store({modules:{home:p},plugins:[h()()]}),f=n("pRNm"),d=n.n(f);o.a.use(d.a),d.a.prototype.togo=function(t){this.isleft=!0,this.isright=!1,this.push(t)},d.a.prototype.goRight=function(t){this.isright=!0,this.isleft=!1,this.push(t)},d.a.prototype.goBack=function(){this.isright=!0,this.isleft=!1,this.go(-1)},d.a.prototype.togoback=function(){this.isright=!0,this.isleft=!1},d.a.prototype.togoin=function(){this.isright=!1,this.isleft=!0};var g=new d.a({routes:[{path:"/",name:"index",component:function(t){return n.e(7).then(function(){var e=[n("2NXm")];t.apply(null,e)}.bind(this)).catch(n.oe)},redirect:"/home",children:[{path:"/home",name:"home",component:function(t){return Promise.all([n.e(0),n.e(2)]).then(function(){var e=[n("gpVb")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/gift",name:"gift",component:function(t){return Promise.all([n.e(0),n.e(8)]).then(function(){var e=[n("dDbg")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/footprints",name:"footprints",component:function(t){return Promise.all([n.e(0),n.e(1)]).then(function(){var e=[n("4N/Z")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/me",name:"me",component:function(t){return Promise.all([n.e(0),n.e(3)]).then(function(){var e=[n("HEhS")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/login",name:"login",component:function(t){return Promise.all([n.e(0),n.e(6)]).then(function(){var e=[n("gjGO")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/reg",name:"reg",component:function(t){return Promise.all([n.e(0),n.e(9)]).then(function(){var e=[n("Q01I")];t.apply(null,e)}.bind(this)).catch(n.oe)}}]},{path:"/Home/Detail/:id",name:"Detail",props:!0,component:function(t){return Promise.all([n.e(0),n.e(5)]).then(function(){var e=[n("f2Us")];t.apply(null,e)}.bind(this)).catch(n.oe)}},{path:"/Home/addTask",name:"addTask",component:function(t){return Promise.all([n.e(0),n.e(4)]).then(function(){var e=[n("zkJs")];t.apply(null,e)}.bind(this)).catch(n.oe)}}]}),v=n("Tg7E"),b=n.n(v),y=(n("5OHe"),n("iDdd")),x=n.n(y);n("zzYx");var w=0;window.addEventListener("popstate",function(t){++w<2&&g.beforeEach(function(t,e,n){var i=t.path.split("/"),o=e.path.split("/");2===i.length&&0===i[1].length&&i.splice(1,1),2===o.length&&0===o[1].length&&o.splice(1,1),i.length<o.length?g.togoback():g.togoin(),n()})},!1),g.beforeEach(function(t,e,n){sessionStorage.getItem("username")?n():"login"===t.name||"reg"===t.name?n():n({path:"/login"})}),o.a.use(b.a),o.a.use(l.a),o.a.config.productionTip=!1,x.a.attach(document.body),new o.a({el:"#app",router:g,store:m,components:{App:r},template:"<App/>"})},SJI6:function(t,e){t.exports=Vuex},Tg7E:function(t,e){t.exports=MINT},lRwf:function(t,e){t.exports=Vue},pRNm:function(t,e){t.exports=VueRouter},zzYx:function(t,e){!function(t,e){function n(){var e=a.getBoundingClientRect().width;e/l>540&&(e=540*l);var n=e/10;a.style.fontSize=n+"px",p.rem=t.rem=n}var i,o=t.document,a=o.documentElement,r=o.querySelector('meta[name="viewport"]'),s=o.querySelector('meta[name="flexible"]'),l=0,c=0,p=e.flexible||(e.flexible={});if(r){console.warn("将根据已有的meta标签来设置缩放比例");var u=r.getAttribute("content").match(/initial\-scale=([\d\.]+)/);u&&(c=parseFloat(u[1]),l=parseInt(1/c))}else if(s){var h=s.getAttribute("content");if(h){var m=h.match(/initial\-dpr=([\d\.]+)/),f=h.match(/maximum\-dpr=([\d\.]+)/);m&&(l=parseFloat(m[1]),c=parseFloat((1/l).toFixed(2))),f&&(l=parseFloat(f[1]),c=parseFloat((1/l).toFixed(2)))}}if(!l&&!c){var d=(t.navigator.appVersion.match(/android/gi),t.navigator.appVersion.match(/iphone/gi)),g=t.devicePixelRatio;c=1/(l=d?g>=3&&(!l||l>=3)?3:g>=2&&(!l||l>=2)?2:1:1)}if(a.setAttribute("data-dpr",l),!r)if((r=o.createElement("meta")).setAttribute("name","viewport"),r.setAttribute("content","initial-scale="+c+", maximum-scale="+c+", minimum-scale="+c+", user-scalable=no"),a.firstElementChild)a.firstElementChild.appendChild(r);else{var v=o.createElement("div");v.appendChild(r),o.write(v.innerHTML)}t.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(n,300)},!1),t.addEventListener("pageshow",function(t){t.persisted&&(clearTimeout(i),i=setTimeout(n,300))},!1),"complete"===o.readyState?o.body.style.fontSize=12*l+"px":o.addEventListener("DOMContentLoaded",function(){o.body.style.fontSize=12*l+"px"},!1),n(),p.dpr=t.dpr=l,p.refreshRem=n,p.rem2px=function(t){var e=parseFloat(t)*this.rem;return"string"==typeof t&&t.match(/rem$/)&&(e+="px"),e},p.px2rem=function(t){var e=parseFloat(t)/this.rem;return"string"==typeof t&&t.match(/px$/)&&(e+="rem"),e}}(window,window.lib||(window.lib={}))}},["NHnr"]);