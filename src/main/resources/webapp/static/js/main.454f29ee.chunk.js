(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{279:function(e,t,n){e.exports=n(442)},284:function(e,t,n){},285:function(e,t,n){},287:function(e,t,n){},288:function(e,t,n){},325:function(e,t,n){},388:function(e,t,n){},436:function(e,t,n){},442:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(11),c=n.n(i),o=(n(284),n(285),n(195)),l=(n(286),n(287),n(33)),s=n(26),u=n(19),d=(n(288),n(127)),m=n.n(d),f=n(449),v=n(448),p=(n(451),n(452)),b=n(88),g=n(47),E=n(69);n(138),window.location.host;var h=n(445),w=n(54),y=n.n(w),O=n(252),j=n.n(O),k=n(13),x=null,A=0,S=void 0,T=void 0;function C(e){x=y.a.map(e,{center:[0,0],zoom:1,layers:[y.a.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})]})}function L(){T&&T.clearLayers(),A=0}function z(e){T||(T=y.a.layerGroup().addTo(x));var t=y.a.marker(e.position,{icon:y.a.divIcon({className:"css-icon",html:'<div class="tweet-map-marker"\n            style="background-color:'.concat(e.color,'"></div>')})}).bindPopup(function(e){var t=r.a.createElement(h.a,{author:e.userName,content:r.a.createElement("p",null,e.text),datetime:e.date.toLocaleTimeString()});return j.a.renderToString(t)}(e));return t.id=e.id,t}function N(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2e4,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(T||(T=y.a.layerGroup().addTo(x)),e.position){var a=z(e).addTo(T);n||setTimeout((function(){a.remove()}),t)}else A+=1,M()}function M(){var e="".concat(A,A>1?" tweets sem localiza\xe7\xe3o":" tweet sem localiza\xe7\xe3o");S?0===A?S.remove():k.select(".map-legend").text(e):((S=y.a.control({position:"bottomright"})).onAdd=function(t){var n=y.a.DomUtil.create("div","map-legend");return n.innerHTML+=e,n},S.addTo(x))}n(254);var R=n(269),D=n(450);n(325);function H(e){var t=e.statistics,n=e.selectable,a=void 0!==n&&n,i=e.onClick,c=void 0===i?function(){return!1}:i,o=e.selected,l=void 0===o?[]:o,s=t.users,u=void 0===s?0:s,d=t.retweets,m=void 0===d?0:d,f=t.mediaAndLinks,v=void 0===f?0:f,p=t.total,E=void 0===p?0:p,h=t.mentions,w=void 0===h?0:h,y=t.replies,O=void 0===y?0:y,j=t.geolocated,k=void 0===j?0:j,x=t.originals,A=void 0===x?0:x;return r.a.createElement("div",{className:"tweets-statistics-container"},r.a.createElement(b.a,{gutter:[8,16]},r.a.createElement(R.a,{title:"Total de tweets",trigger:"hover",onVisibleChange:console.log},r.a.createElement(g.a,{span:3},r.a.createElement(D.a,{title:"Total",value:E}))),r.a.createElement(R.a,{title:"Total de tweets com localiza\xe7\xe3o"},r.a.createElement(g.a,{span:3},r.a.createElement(D.a,{title:"Geolocalizados",value:k}))),r.a.createElement(R.a,{title:"N\xfamero de usu\xe1rios distintos twittando"},r.a.createElement(g.a,{span:3},r.a.createElement(D.a,{title:"Usu\xe1rios",value:u}))),r.a.createElement(R.a,{title:"Quantidade de m\xeddia e links compartilhadas"},r.a.createElement(g.a,{span:3},r.a.createElement(D.a,{title:"M\xeddia e Links",value:v}))),r.a.createElement(R.a,{title:"Quantidade de men\xe7\xf5es realizadas"},r.a.createElement(g.a,{span:3},r.a.createElement(D.a,{title:"Men\xe7\xf5es",value:w}))),r.a.createElement(R.a,{title:"Total de retweets"},r.a.createElement(g.a,{span:3},r.a.createElement("div",{onClick:function(e){return c("retweet")}},r.a.createElement(D.a,{className:"retweets ".concat(a?"selectable":""," ").concat(l.includes("retweet")?"selected":""),title:"Retweets",value:m})))),r.a.createElement(R.a,{title:"Total de respostas"},r.a.createElement(g.a,{span:3},r.a.createElement("div",{onClick:function(e){return c("reply")}},r.a.createElement(D.a,{className:"".concat(a?"selectable":""," ").concat(l.includes("reply")?"selected":""),title:"Respostas",value:O})))),r.a.createElement(R.a,{title:"Total de tweets que n\xe3o s\xe3o retweets ou respostas"},r.a.createElement(g.a,{span:3},r.a.createElement("div",{onClick:function(e){return c("original")}},r.a.createElement(D.a,{className:"".concat(a?"selectable":""," ").concat(l.includes("original")?"selected":""),title:"Originais",value:A}))))))}n(388);var I=n(100),P=n.n(I);f.a.Search;o.a.TabPane;var Q=n(446),F=n(101),G=n.n(F),U=n(267),B=n.n(U),V=n(46),W=n(447),J=(n(436),P.a.create({baseURL:"http://localhost:9000"})),Y=function(){return J.get("/historical-tweets").then((function(e){return e.data}))},Z=function(){return P.a.get(window.location.href+"data.json").then((function(e){return e.data}))},$=Q.a.Option,q=["#646464","#818181","#a2a2a2","#ffffff"],_={minutes:k.timeMinute,seconds:k.timeSecond,hour:k.timeHour,day:k.timeDay};function K(){var e=Object(a.useState)(),t=Object(u.a)(e,2),n=t[0],i=t[1],c=Object(a.useState)([]),o=Object(u.a)(c,2),d=o[0],f=o[1],h=Object(a.useState)([]),w=Object(u.a)(h,2),y=w[0],O=w[1],j=Object(a.useRef)(),x=Object(a.useState)(),A=Object(u.a)(x,2),S=A[0],T=A[1],z=Object(a.useState)(),M=Object(u.a)(z,2),R=M[0],D=M[1],I=(n||[]).filter((function(e){return 0===d.length||d.includes(e.key)})).filter((function(e){return 0===y.length||y.includes(e.type)})),P=["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac"],U=Object(a.useState)({}),J=Object(u.a)(U,2),K=J[0],X=J[1],ee=Object(a.useRef)({users:new Set}),te=Object(a.useState)([]),ne=Object(u.a)(te,2),ae=ne[0],re=ne[1],ie=Object(a.useState)((function(){return _.seconds})),ce=Object(u.a)(ie,2),oe=ce[0],le=ce[1],se=r.a.createElement(Q.a,{defaultValue:"seconds",onChange:function(e){return le((function(){return _[e]}))}},r.a.createElement($,{key:0,value:"seconds"},"Segundos"),r.a.createElement($,{key:1,value:"minutes"},"Minutos"),r.a.createElement($,{key:1,value:"hour"},"Hora"),r.a.createElement($,{key:1,value:"day"},"Dia")),ue=Object(a.useState)(),de=Object(u.a)(ue,2),me=de[0],fe=de[1];function ve(e){e.forEach((function(e){var t;e.date=new Date(parseInt(e.date.$numberLong)),e.type=(t=e).retweet?"Retweet":t.reply?"Resposta":"Original"})),i(function(e){var t={},n=0,a=e.map((function(e){return t[e.key]?Object(l.a)(Object(l.a)({},e),{},{color:t[e.key]}):n>P.length-1?e:(t[e.key]=P[n],n+=1,Object(l.a)(Object(l.a)({},e),{},{color:t[e.key]}))})).filter((function(e){return e.color}));return re(t),a}(e))}function pe(){var e=function(){var e=function(){var e={};I.forEach((function(t){var n=t.wordCount;Object.entries(n).map((function(t){var n=Object(u.a)(t,2),a=n[0],r=n[1];return e[a]=r+(e[a]||0)}))}));var t=Object.entries(e).map((function(e){var t=Object(u.a)(e,2);return{key:t[0],value:t[1]}}));return t.sort((function(e,t){return t.value-e.value})),t.length<=50?t:t.slice(0,50)}();if(Object(F.isEmpty)(e))return;var t=(new B.a.View).source(e),n=t.range("value"),a=Object(u.a)(n,2),r=a[0],i=a[1];return t.transform({spiral:"rectangular",type:"tag-cloud",fields:["key","value"],font:"serif",size:[600,300],padding:0,timeInterval:1/0,rotate:function(){var e=~~(4*Math.random())%4;return 2===e&&(e=0),90*e},fontSize:function(e){return(e.value-r)/(i-r)*56+24}}),t}();if(e){var t=e.range("value"),n=Object(u.a)(t,2),a=(n[0],n[1],k.scaleQuantize().domain(Object(W.a)(e.rows.map((function(e){return e.value})),[0,.33,.66,1])).range(q));j.current&&j.current.destroy();var r=new E.a({container:"word-cloud",autoFit:!0,height:300,padding:0});r.data(e.rows),r.scale({x:{nice:!1},y:{nice:!1}}),r.legend(!1),r.axis(!1),r.tooltip({showTitle:!1,showMarkers:!1}),r.coordinate().reflect(),r.point().position("x*y").color("value",(function(e){return a(e)})).shape("cloud"),r.render(),j.current=r}}function be(e){var t=e.dimension((function(e){return[e.key,oe(e.date)]})),a=t.group(),r=(e.dimension((function(e){return[e.key,oe(e.date)]})).group(),k.scaleTime().domain([k.min(n||[],(function(e){return oe(e.date)})),k.max(n||[],(function(e){return oe(e.date)}))])),i=k.scaleTime().domain([k.min(n||[],(function(e){return oe(e.date)})),k.max(n||[],(function(e){return oe(e.date)}))]),c=new V.SeriesChart(k.select("#series")),o=new V.SeriesChart(k.select("#series-range"));return c.width(1200).height(300).chart((function(e){return new V.LineChart(e).curve(k.curveCardinal)})).x(r).margins({top:10,right:10,bottom:50,left:80}).brushOn(!1).yAxisLabel("Quantidade de Tweets").xAxisLabel("Hor\xe1rio").clipPadding(10).elasticY(!0).dimension(t).group(a).mouseZoomable(!0).seriesAccessor((function(e){return e.key[0]})).keyAccessor((function(e){return e.key[1]})).valueAccessor((function(e){return+e.value})).legend(V.legend().x(80).y(284).itemHeight(13).autoItemWidth(!0).horizontal(1)).colors((function(e){return ae[e]})).colorAccessor((function(e){return e.key[0]})),o.width(1200).height(300).chart((function(e){return new V.LineChart(e).curve(k.curveCardinal)})).x(i).margins({top:10,right:10,bottom:50,left:80}).brushOn(!0).mouseZoomable(!0).yAxisLabel("Quantidade de Tweets").xAxisLabel("Hor\xe1rio").clipPadding(10).elasticY(!0).dimension(t).group(a).seriesAccessor((function(e){return e.key[0]})).keyAccessor((function(e){return e.key[1]})).valueAccessor((function(e){return+e.value})).colors((function(e){return ae[e]})).colorAccessor((function(e){return e.key[0]})),c}function ge(){I.forEach((function(e){e.date=new Date(e.date),N(e,G.a,!0)}))}return Object(a.useEffect)((function(){Y().then(ve).catch((function(e){Z().then(ve)}))}),[]),Object(a.useEffect)((function(){n&&(C("map"),function(){if(n){var e=n||[],t=m()(e);fe(t),function(e){var t=e.dimension((function(e){return e.key})),n=t.group(),a=k.scaleOrdinal().domain(Object.keys(ae)),r=V.barChart(k.select("#bar"));r.width(600).height(300).dimension(t).xUnits(V.units.ordinal).margins({top:10,right:20,bottom:50,left:50}).x(a).colors((function(e){return ae[e]})).colorAccessor((function(e){return e.key})).gap(50).renderHorizontalGridLines(!0).group(n,"Contagem dos tipos de crimes"),r.on("filtered.monitor",(function(e,t){d.includes(t)?f(d.filter((function(e){return e!==t}))):f([].concat(Object(s.a)(d),[t]))})),T(r)}(t),be(t),ee.current={users:new Set},n.forEach((function(e){e.retweet?ee.current.retweets=(ee.current.retweets||0)+1:e.reply?ee.current.replies=(ee.current.replies||0)+1:ee.current.original=(ee.current.original||0)+1,ee.current.users.add(e.userName),e.position&&(ee.current.geolocated=(ee.current.geolocated||0)+1),ee.current.mediasAndLink=(ee.current.mediasAndLink||0)+e.mediasAndLink,ee.current.mentions=(ee.current.mentions||0)+e.mentions,ee.current.total=(ee.current.total||0)+1})),X({users:ee.current.users.size,retweets:ee.current.retweets||0,mediaAndLinks:ee.current.mediasAndLink,total:ee.current.total,mentions:ee.current.mentions,geolocated:ee.current.geolocated,replies:ee.current.replies,originals:ee.current.original}),ge(),pe(),function(e){var t=e.dimension((function(e){return e.type})),n=t.group(),a=k.scaleOrdinal().domain(["Resposta","Retweet","Original"]).range(["#46EDC8","#374D7C","#FDF289"]),r=V.pieChart(k.select("#sunburst"));r.width(600).height(295).innerRadius(0).dimension(t).group(n).colors(a).colorAccessor((function(e){return e.key})).legend(V.legend()),r.on("filtered.monitor",(function(e,t){y.includes(t)?O(y.filter((function(e){return e!==t}))):O([].concat(Object(s.a)(y),[t]))})),D(r)}(t),V.renderAll()}}())}),[n]),Object(a.useEffect)((function(){me&&be(me).render()}),[oe,me]),Object(a.useEffect)((function(){L(),Object(F.isEmpty)(n)||(S&&S.on("filtered.monitor",(function(e,t){d.includes(t)?f(d.filter((function(e){return e!==t}))):f([].concat(Object(s.a)(d),[t]))})),R&&R.on("filtered.monitor",(function(e,t){y.includes(t)?O(y.filter((function(e){return e!==t}))):O([].concat(Object(s.a)(y),[t]))})),pe(),ge())}),[d,y]),Object(E.c)("point","cloud",{draw:function(e,t){var n=function(e){return Object(l.a)(Object(l.a)(Object(l.a)({},e.defaultStyle),e.style),{},{fontSize:e.data.size,text:e.data.text,textAlign:"center",fontFamily:e.data.font,fill:e.color||e.defaultStyle.stroke,textBaseline:"Alphabetic"})}(e),a=t.addShape("text",{attrs:Object(l.a)(Object(l.a)({},n),{},{x:e.x,y:e.y})});return e.data.rotate&&E.b.rotate(a,e.data.rotate*Math.PI/180),a}}),r.a.createElement("div",{className:"main-container"},r.a.createElement(v.a,{title:"Tweets Analyzer",subTitle:"An\xe1lise hist\xf3rica dos tweets consumidos"}),r.a.createElement(p.a,{title:"M\xe9tricas",bordered:!1},r.a.createElement(H,{statistics:K,selectable:!1})),r.a.createElement("br",null),r.a.createElement(b.a,null,r.a.createElement(p.a,{title:"Contagem temporal",bordered:!1,extra:se},r.a.createElement("div",{className:"static-series-container"},r.a.createElement("div",{id:"series"}),r.a.createElement("div",{id:"series-range"})))),r.a.createElement("br",null),r.a.createElement(b.a,{gutter:[16,16]},r.a.createElement(g.a,{span:12},r.a.createElement(p.a,{title:"Localiza\xe7\xe3o",bordered:!1},r.a.createElement("div",{className:"map-container"},r.a.createElement("div",{id:"map"})))),r.a.createElement(g.a,{span:12},r.a.createElement(p.a,{title:"Contagem total",bordered:!1},r.a.createElement("div",{className:"static-bars-container"},r.a.createElement("div",{id:"bar"}))))),r.a.createElement("br",null),r.a.createElement(b.a,{gutter:[16,16]},r.a.createElement(g.a,{span:12},r.a.createElement(p.a,{title:"Contagem por tipo",bordered:!1},r.a.createElement("div",{className:"static-sunburst-container"},r.a.createElement("div",{id:"sunburst"})))),r.a.createElement(g.a,{span:12},r.a.createElement(p.a,{title:"Palavras mais utilizadas",bordered:!1},r.a.createElement("div",{className:"word-cloud-container"},r.a.createElement("div",{id:"word-cloud"}))))),r.a.createElement("br",null),r.a.createElement(b.a,null))}var X=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(K,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(X,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[279,1,2]]]);
//# sourceMappingURL=main.454f29ee.chunk.js.map