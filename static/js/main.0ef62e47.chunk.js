(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{282:function(e,t,n){e.exports=n(445)},287:function(e,t,n){},288:function(e,t,n){},290:function(e,t,n){},291:function(e,t,n){},328:function(e,t,n){},391:function(e,t,n){},439:function(e,t,n){},445:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(9),o=n.n(c),i=(n(287),n(288),n(15)),l=n(198),u=n(454),s=n(200),d=(n(289),n(290),n(33)),m=n(26),f=(n(291),n(87)),b=n.n(f),v=n(452),p=n(451),g=n(455),E=n(456),O=n(91),h=n(46),j=n(69),w=n(141),k=(window.location.host,"http://localhost:9000"),y={},S={};function T(e,t){S[e]=t}function C(e){var t=e.keyword,n=e.color,a=new WebSocket("ws://localhost:9000/tweets?keywords="+encodeURIComponent(t));y[t]=a,a.onmessage=function(e){var a=JSON.parse(e.data),r=Object(d.a)(Object(d.a)({},a),{},{date:new Date(a.date),key:t,color:n});Object.entries(S).forEach((function(e){var t=Object(i.a)(e,2);t[0];return(0,t[1])(r)}))}}var A=n(448),N=n(54),L=n.n(N),x=n(256),z=n.n(x),D=n(17),R=null,B=0,F=void 0,M=void 0;function I(e){R=L.a.map(e,{center:[0,0],zoom:1,layers:[L.a.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})]})}function H(){M&&M.clearLayers(),B=0}function P(e){M||(M=L.a.layerGroup().addTo(R));var t=L.a.marker(e.position,{icon:L.a.divIcon({className:"css-icon",html:'<div class="tweet-map-marker"\n            style="background-color:'.concat(e.color,'"></div>')})}).bindPopup(function(e){var t=r.a.createElement(A.a,{author:e.userName,content:r.a.createElement("p",null,e.text),datetime:e.date.toLocaleTimeString()});return z.a.renderToString(t)}(e));return t.id=e.id,t}function U(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2e4,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(M||(M=L.a.layerGroup().addTo(R)),e.position){var a=P(e).addTo(M);n||setTimeout((function(){a.remove()}),t)}else B+=1,G()}function G(){var e="".concat(B,B>1?" tweets sem localiza\xe7\xe3o":" tweet sem localiza\xe7\xe3o");F?0===B?F.remove():D.select(".map-legend").text(e):((F=L.a.control({position:"bottomright"})).onAdd=function(t){var n=L.a.DomUtil.create("div","map-legend");return n.innerHTML+=e,n},F.addTo(R))}var Q=n(258),V=n.n(Q),W=n(271),q=n(453);n(328);function J(e){var t=e.statistics,n=e.selectable,a=void 0!==n&&n,c=e.onClick,o=void 0===c?function(){return!1}:c,i=e.selected,l=void 0===i?[]:i,u=t.users,s=void 0===u?0:u,d=t.retweets,m=void 0===d?0:d,f=t.mediaAndLinks,b=void 0===f?0:f,v=t.total,p=void 0===v?0:v,g=t.mentions,E=void 0===g?0:g,j=t.replies,w=void 0===j?0:j,k=t.geolocated,y=void 0===k?0:k,S=t.originals,T=void 0===S?0:S;return r.a.createElement("div",{className:"tweets-statistics-container"},r.a.createElement(O.a,{gutter:[8,16]},r.a.createElement(W.a,{title:"Total de tweets",trigger:"hover",onVisibleChange:console.log},r.a.createElement(h.a,{span:3},r.a.createElement(q.a,{title:"Total",value:p}))),r.a.createElement(W.a,{title:"Total de tweets com localiza\xe7\xe3o"},r.a.createElement(h.a,{span:3},r.a.createElement(q.a,{title:"Geolocalizados",value:y}))),r.a.createElement(W.a,{title:"N\xfamero de usu\xe1rios distintos twittando"},r.a.createElement(h.a,{span:3},r.a.createElement(q.a,{title:"Usu\xe1rios",value:s}))),r.a.createElement(W.a,{title:"Quantidade de m\xeddia e links compartilhadas"},r.a.createElement(h.a,{span:3},r.a.createElement(q.a,{title:"M\xeddia e Links",value:b}))),r.a.createElement(W.a,{title:"Quantidade de men\xe7\xf5es realizadas"},r.a.createElement(h.a,{span:3},r.a.createElement(q.a,{title:"Men\xe7\xf5es",value:E}))),r.a.createElement(W.a,{title:"Total de retweets"},r.a.createElement(h.a,{span:3},r.a.createElement("div",{onClick:function(e){return o("retweet")}},r.a.createElement(q.a,{className:"retweets ".concat(a?"selectable":""," ").concat(l.includes("retweet")?"selected":""),title:"Retweets",value:m})))),r.a.createElement(W.a,{title:"Total de respostas"},r.a.createElement(h.a,{span:3},r.a.createElement("div",{onClick:function(e){return o("reply")}},r.a.createElement(q.a,{className:"".concat(a?"selectable":""," ").concat(l.includes("reply")?"selected":""),title:"Respostas",value:w})))),r.a.createElement(W.a,{title:"Total de tweets que n\xe3o s\xe3o retweets ou respostas"},r.a.createElement(h.a,{span:3},r.a.createElement("div",{onClick:function(e){return o("original")}},r.a.createElement(q.a,{className:"".concat(a?"selectable":""," ").concat(l.includes("original")?"selected":""),title:"Originais",value:T}))))))}n(391);var $=n(103),Y=n.n($);function Z(e){var t=e.onClick,n=e.disabled,c=Object(a.useState)([]),o=Object(i.a)(c,2),l=o[0],u=o[1];return Object(a.useEffect)((function(){Y.a.get(k+"/trends",{}).then((function(e){return u(e.data)}))}),[]),r.a.createElement(r.a.Fragment,null,!n&&r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Selecione um tema:"),r.a.createElement("div",{className:"trends"},Object.entries(l).map((function(e){var n=Object(i.a)(e,2),a=n[0],c=n[1];return r.a.createElement(g.a,{onClick:function(e){return t(a)},key:a},"".concat(a," (").concat(c,")"))})))))}var _=v.a.Search;function K(e){var t=e.onBack,n=Object(a.useState)({}),c=Object(i.a)(n,2),o=c[0],l=c[1],u=Object(a.useState)(),s=Object(i.a)(u,2),f=s[0],v=s[1],k=Object(a.useState)(),S=Object(i.a)(k,2),A=S[0],N=S[1],L=Object(a.useRef)({users:new Set}),x=Object(a.useState)(),z=Object(i.a)(x,2),D=z[0],R=z[1],B=Object(a.useState)(""),F=Object(i.a)(B,2),M=F[0],P=F[1],G=["#1F77B4","#278944"],Q=Object(a.useState)([]),W=Object(i.a)(Q,2),q=W[0],$=W[1],Y=Object(a.useRef)([]),K=Object(a.useRef)([]),X=Object(a.useRef)({});function ee(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";P(""),console.log("socket:",e);var t=G.filter((function(e){return!q.map((function(e){return e[1]})).includes(e)}))[0];X.current[e]={value:0,color:t},$([].concat(Object(m.a)(q),[[e,t]])),C({keyword:e,color:t}),v((new Date).getTime()+1500)}function te(e){var t;y[t=e].close(3e3),delete y[t],delete X.current[e],$(q.filter((function(t){return t[0]!==e})))}function ne(){var e=function(){if(Object(w.a)(K.current))return[];var e=K.current[K.current.length-1].date.getTime()-1e3,t=K.current.filter((function(t){return t.date.getTime()<e&&e-t.date.getTime()<3e4}));return b()(t).dimension((function(e){return[e.key,e.date,e.color]})).group().reduceSum((function(e){return 1})).all().sort((function(e,t){return e.key[1]<t.key[1]})).map((function(e){return{keyword:e.key[0],date:e.key[1].toLocaleTimeString(),color:e.key[2],value:e.value}}))}();if(!Object(w.a)(e))if(A)A.changeData(e);else{var t=new j.a({container:"series",autoFit:!0,height:200,renderer:"svg"});t.data(e),t.line().position("date*value").color("keyword",(function(e){return Y.current.filter((function(t){return t[0]===e}))[0][1]})).label(!1),t.tooltip({showCrosshairs:!0,shared:!0}),t.axis("date",{animateOption:{update:{duration:1e3,easing:"easeLinear"}}}),t.render(),N(t)}}function ae(){var e=Object.entries(X.current).map((function(e){var t=Object(i.a)(e,2),n=t[0],a=t[1];return Object(d.a)(Object(d.a)({},a),{},{key:n})})).sort((function(e,t){return e.value<t.value}));if(!Object(w.a)(e)){if(D)return D.annotation().clear(!0),void D.changeData(e);var t=new j.a({container:"bar",autoFit:!0,height:300,renderer:"svg"});t.data(e),t.coordinate("rect").transpose(),t.legend(!1),t.tooltip(!0),t.interval().position("key*value").color("key",(function(e){return Y.current.filter((function(t){return t[0]===e}))[0][1]})).animate({appear:{duration:1e3,easing:"easeLinear"},update:{duration:500,easing:"easeLinear"}}),t.render(),R(t)}}return Object(a.useEffect)((function(){T("time",(function(e){var t=e.color,n=e.key,a=e.date;X.current[n].value+=1,K.current.push({color:t,key:n,date:a})})),T("map",(function(e){U(e)})),T("metrics",(function(e){var t=e.userName,n=e.retweet,a=e.reply,r=e.mediasAndLink,c=e.mentions,o=e.position;L.current.users.add(t),n?L.current.retweets=(L.current.retweets||0)+1:a?L.current.replies=(L.current.replies||0)+1:L.current.original=(L.current.original||0)+1,o&&(L.current.geolocated=(L.current.geolocated||0)+1),L.current.mediasAndLink=(L.current.mediasAndLink||0)+r,L.current.total=(L.current.total||0)+1,L.current.mentions=(L.current.mentions||0)+c})),I("map"),ne(),ae()}),[]),Object(a.useEffect)((function(){Object.keys(L.current).forEach((function(e){return L.current[e]=0})),L.current.users=new Set,K.current.splice(0,K.current.length),Object.keys(X.current).forEach((function(e){return X.current[e].key=0})),H(),Y.current=q}),[q]),r.a.createElement("div",{className:"main-container"},r.a.createElement(p.a,{title:"Tweets monitor",subTitle:"Monitore assuntos em tempo real (ou quase isso)",onBack:function(){Object.keys(X.current).map(te),t()}},r.a.createElement("div",{className:"trends-container"},r.a.createElement(Z,{onClick:ee,disabled:2==q.length})),r.a.createElement("div",{className:"tweets-search-container"},r.a.createElement(_,{enterButton:!0,disabled:2==q.length,placeholder:"Ou entre seu",onSearch:ee,value:M,onChange:function(e){return P(e.target.value)},className:"tweets-search"}),r.a.createElement("div",{className:"tags-container"},q.map((function(e){var t=Object(i.a)(e,2),n=t[0],a=t[1];return r.a.createElement(g.a,{key:n,closable:!0,color:a,onClose:function(e){return te(n)}},r.a.createElement("p",null,n))}))))),r.a.createElement(E.a,{title:"M\xe9tricas",bordered:!1},r.a.createElement(J,{statistics:o})),r.a.createElement(E.a,{title:"Contagem temporal",bordered:!1},r.a.createElement("div",{className:"series-container"},r.a.createElement("div",{id:"series"}))),r.a.createElement(O.a,{gutter:[16,16]},r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Localiza\xe7\xe3o",bordered:!1},r.a.createElement("div",{className:"map-container"},r.a.createElement("div",{id:"map"})))),r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Contagem total",bordered:!1},r.a.createElement("div",{className:"bars-container"},r.a.createElement("div",{id:"bar"}))))),r.a.createElement(V.a,{className:"count-down-refresh",target:f,onEnd:function(){ne(),ae(),l({users:L.current.users.size,retweets:L.current.retweets||0,mediaAndLinks:L.current.mediasAndLink,total:L.current.total,mentions:L.current.mentions,geolocated:L.current.geolocated,replies:L.current.replies,originals:L.current.original}),v((new Date).getTime()+1500)}}))}var X=n(449),ee=n(13),te=n(90),ne=n.n(te),ae=n(269),re=n.n(ae),ce=n(50),oe=n(450),ie=(n(439),Y.a.create({baseURL:"http://localhost:9000"})),le=function(){return ie.get("/historical-tweets").then((function(e){return e.data}))},ue=function(){return Y.a.get(window.location.href+"data.json").then((function(e){return e.data}))},se=X.a.Option,de=["#646464","#818181","#a2a2a2","#ffffff"],me={minutes:D.timeMinute,seconds:D.timeSecond,hour:D.timeHour,day:D.timeDay};function fe(e){var t=e.onBack,n=Object(a.useState)(),c=Object(i.a)(n,2),o=c[0],l=c[1],u=Object(a.useState)(),s=Object(i.a)(u,2),f=s[0],v=s[1],g=Object(a.useState)([]),w=Object(i.a)(g,2),k=w[0],y=w[1],S=Object(a.useState)([]),T=Object(i.a)(S,2),C=T[0],A=T[1],N=Object(a.useState)(),L=Object(i.a)(N,2),x=L[0],z=L[1],R=function(e){return!x||e.date.getTime()>=x[0]&&e.date.getTime()<=x[1]},B=Object(a.useRef)(),F=Object(a.useState)(),M=Object(i.a)(F,2),P=M[0],G=M[1],Q=Object(a.useState)(),V=Object(i.a)(Q,2),q=V[0],$=V[1],Y=(o||[]).filter((function(e){return 0===k.length||k.includes(e.key)})).filter((function(e){return 0===C.length||C.includes(e.type)})).filter(R),Z=["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac"],_=Object(a.useState)({}),K=Object(i.a)(_,2),ae=K[0],ie=K[1],fe=Object(a.useRef)({users:new Set}),be=Object(a.useState)([]),ve=Object(i.a)(be,2),pe=ve[0],ge=ve[1],Ee=Object(a.useState)((function(){return me.seconds})),Oe=Object(i.a)(Ee,2),he=Oe[0],je=Oe[1],we=r.a.createElement(X.a,{defaultValue:"seconds",onChange:function(e){return je((function(){return me[e]}))}},r.a.createElement(se,{key:0,value:"seconds"},"Segundos"),r.a.createElement(se,{key:1,value:"minutes"},"Minutos"),r.a.createElement(se,{key:1,value:"hour"},"Hora"),r.a.createElement(se,{key:1,value:"day"},"Dia")),ke=r.a.createElement(W.a,{title:"AVISO: enquanto o zoom est\xe1 ativo, outros gr\xe1ficos n\xe3o conseguem aplicar seus filtros a este"},r.a.createElement(ee.a,{type:"warning"})),ye=r.a.createElement(W.a,{title:"Remover zoom"},r.a.createElement(ee.a,{onClick:function(e){return z()},className:"white-icon",type:"zoom-out"})),Se=Object(a.useState)(),Te=Object(i.a)(Se,2),Ce=Te[0],Ae=Te[1];function Ne(e){e.forEach((function(e){var t;e.date=new Date(parseInt(e.date.$numberLong)),e.type=(t=e).retweet?"Retweet":t.reply?"Resposta":"Original"})),l(function(e){var t={},n=0,a=e.map((function(e){return t[e.key]?Object(d.a)(Object(d.a)({},e),{},{color:t[e.key]}):n>Z.length-1?e:(t[e.key]=Z[n],n+=1,Object(d.a)(Object(d.a)({},e),{},{color:t[e.key]}))})).filter((function(e){return e.color}));return ge(t),a}(e))}function Le(){var e=function(){var e=function(){var e={};Y.forEach((function(t){var n=t.wordCount;Object.entries(n).map((function(t){var n=Object(i.a)(t,2),a=n[0],r=n[1];return e[a]=r+(e[a]||0)}))}));var t=Object.entries(e).map((function(e){var t=Object(i.a)(e,2);return{key:t[0],value:t[1]}}));return t.sort((function(e,t){return t.value-e.value})),t.length<=50?t:t.slice(0,50)}();if(Object(te.isEmpty)(e))return;var t=(new re.a.View).source(e),n=t.range("value"),a=Object(i.a)(n,2),r=a[0],c=a[1];return t.transform({spiral:"rectangular",type:"tag-cloud",fields:["key","value"],font:"serif",size:[600,300],padding:0,timeInterval:1/0,rotate:function(){var e=~~(4*Math.random())%4;return 2===e&&(e=0),90*e},fontSize:function(e){return(e.value-r)/(c-r)*56+24}}),t}();if(e){var t=e.range("value"),n=Object(i.a)(t,2),a=(n[0],n[1],D.scaleQuantize().domain(Object(oe.a)(e.rows.map((function(e){return e.value})),[0,.33,.66,1])).range(de));B.current&&B.current.destroy();var r=new j.a({container:"word-cloud",autoFit:!0,height:300,padding:0});r.data(e.rows),r.scale({x:{nice:!1},y:{nice:!1}}),r.legend(!1),r.axis(!1),r.tooltip({showTitle:!1,showMarkers:!1}),r.coordinate().reflect(),r.point().position("x*y").color("value",(function(e){return a(e)})).shape("cloud"),r.render(),B.current=r}}function xe(e){var t=e.dimension((function(e){return e.key})),n=t.group(),a=D.scaleOrdinal().domain(Object.keys(pe)),r=ce.barChart(D.select("#bar"));return r.width(600).height(300).dimension(t).xUnits(ce.units.ordinal).margins({top:10,right:20,bottom:50,left:50}).x(a).colors((function(e){return pe[e]})).colorAccessor((function(e){return e.key})).gap(50).renderHorizontalGridLines(!0).group(n,"Contagem dos tipos de crimes"),r.on("filtered.monitor",(function(e,t){k.includes(t)?y(k.filter((function(e){return e!==t}))):y([].concat(Object(m.a)(k),[t]))})),G(r),r}function ze(e){var t=e.dimension((function(e){return[e.key,he(e.date)]})),n=t.group(),a=D.extent(o||[],(function(e){return he(e.date)})),r=Object(i.a)(a,2),c=r[0],l=r[1],u=D.scaleTime().domain([c,l]),s=new ce.SeriesChart(D.select("#series"));return s.width(1200).height(300).chart((function(e){return new ce.LineChart(e).curve(D.curveCardinal)})).x(u).margins({top:10,right:10,bottom:50,left:80}).brushOn(!1).yAxisLabel("Quantidade de Tweets").xAxisLabel("Hor\xe1rio").clipPadding(10).elasticY(!0).dimension(t).group(n).mouseZoomable(!0).seriesAccessor((function(e){return e.key[0]})).keyAccessor((function(e){return e.key[1]})).valueAccessor((function(e){return+e.value})).legend(ce.legend().x(80).y(284).itemHeight(13).autoItemWidth(!0).horizontal(1)).colors((function(e){return pe[e]})).colorAccessor((function(e){return e.key[0]})),s.on("filtered.monitor",(function(e,t){Object(te.isEmpty)(t)||t[0].getTime()===c.getTime()&&t[1].getTime()===l.getTime()?z():z(t)})),s}function De(e){var t=e.dimension((function(e){return e.type})),n=t.group(),a=D.scaleOrdinal().domain(["Resposta","Retweet","Original"]).range(["#46EDC8","#374D7C","#FDF289"]),r=ce.pieChart(D.select("#sunburst"));return r.width(600).height(295).innerRadius(0).dimension(t).group(n).colors(a).colorAccessor((function(e){return e.key})).legend(ce.legend()),r.on("filtered.monitor",(function(e,t){C.includes(t)?A(C.filter((function(e){return e!==t}))):A([].concat(Object(m.a)(C),[t]))})),$(r),r}function Re(){Y.forEach((function(e){e.date=new Date(e.date),U(e,ne.a,!0)}))}return Object(a.useEffect)((function(){le().then((function(e){v(!1),Ne(e)})).catch((function(e){v(!0),ue().then(Ne)}))}),[]),Object(a.useEffect)((function(){o&&(I("map"),function(){if(o){var e=o||[],t=b()(e);Ae(t),xe(t),ze(t),fe.current={users:new Set},o.forEach((function(e){e.retweet?fe.current.retweets=(fe.current.retweets||0)+1:e.reply?fe.current.replies=(fe.current.replies||0)+1:fe.current.original=(fe.current.original||0)+1,fe.current.users.add(e.userName),e.position&&(fe.current.geolocated=(fe.current.geolocated||0)+1),fe.current.mediasAndLink=(fe.current.mediasAndLink||0)+e.mediasAndLink,fe.current.mentions=(fe.current.mentions||0)+e.mentions,fe.current.total=(fe.current.total||0)+1})),ie({users:fe.current.users.size,retweets:fe.current.retweets||0,mediaAndLinks:fe.current.mediasAndLink,total:fe.current.total,mentions:fe.current.mentions,geolocated:fe.current.geolocated,replies:fe.current.replies,originals:fe.current.original}),Re(),Le(),De(t),ce.renderAll()}}())}),[o]),Object(a.useEffect)((function(){Ce&&ze(Ce).render()}),[he,Ce]),Object(a.useEffect)((function(){if(Ce)if(x){var e=b()(o.filter(R));xe(e).render(),De(e).render()}else{var t=o||[],n=b()(t);xe(n),ze(n),De(n),ce.renderAll()}}),[x,Ce]),Object(a.useEffect)((function(){H(),Object(te.isEmpty)(o)||(P&&P.on("filtered.monitor",(function(e,t){k.includes(t)?y(k.filter((function(e){return e!==t}))):y([].concat(Object(m.a)(k),[t]))})),q&&q.on("filtered.monitor",(function(e,t){C.includes(t)?A(C.filter((function(e){return e!==t}))):A([].concat(Object(m.a)(C),[t]))})),Le(),Re())}),[k,C,x]),Object(j.c)("point","cloud",{draw:function(e,t){var n=function(e){return Object(d.a)(Object(d.a)(Object(d.a)({},e.defaultStyle),e.style),{},{fontSize:e.data.size,text:e.data.text,textAlign:"center",fontFamily:e.data.font,fill:e.color||e.defaultStyle.stroke,textBaseline:"Alphabetic"})}(e),a=t.addShape("text",{attrs:Object(d.a)(Object(d.a)({},n),{},{x:e.x,y:e.y})});return e.data.rotate&&j.b.rotate(a,e.data.rotate*Math.PI/180),a}}),r.a.createElement("div",{className:"main-container"},r.a.createElement(p.a,{title:"Tweets Analyzer",subTitle:"An\xe1lise hist\xf3rica dos tweets consumidos",onBack:t,backIcon:!f&&r.a.createElement(ee.a,{type:"arrow-left"})}),r.a.createElement(E.a,{title:"M\xe9tricas",bordered:!1},r.a.createElement(J,{statistics:ae,selectable:!1})),r.a.createElement("br",null),r.a.createElement(O.a,null,r.a.createElement(E.a,{title:r.a.createElement(r.a.Fragment,null,"Contagem temporal ",x&&r.a.createElement(r.a.Fragment,null," ",ke," ",ye," ")),bordered:!1,extra:we},r.a.createElement("div",{className:"static-series-container"},r.a.createElement("div",{id:"series"}),r.a.createElement("div",{id:"series-range"})))),r.a.createElement("br",null),r.a.createElement(O.a,{gutter:[16,16]},r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Localiza\xe7\xe3o",bordered:!1},r.a.createElement("div",{className:"map-container"},r.a.createElement("div",{id:"map"})))),r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Contagem total",bordered:!1},r.a.createElement("div",{className:"static-bars-container"},r.a.createElement("div",{id:"bar"}))))),r.a.createElement("br",null),r.a.createElement(O.a,{gutter:[16,16]},r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Contagem por tipo",bordered:!1},r.a.createElement("div",{className:"static-sunburst-container"},r.a.createElement("div",{id:"sunburst"})))),r.a.createElement(h.a,{span:12},r.a.createElement(E.a,{title:"Palavras mais utilizadas",bordered:!1},r.a.createElement("div",{className:"word-cloud-container"},r.a.createElement("div",{id:"word-cloud"}))))),r.a.createElement("br",null),r.a.createElement(O.a,null))}l.a.TabPane;function be(){var e=Object(a.useState)(r.a.createElement(fe,{key:+new Date,onBack:function(){return m(!0)}})),t=Object(i.a)(e,2),n=t[0],c=t[1],o=Object(a.useState)(!1),l=Object(i.a)(o,2),d=l[0],m=l[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement(u.a,{title:"Selecione um painel",placement:"left",visible:d,onClose:function(){return m(!1)}},r.a.createElement(s.a,{type:"link",onClick:function(){m(!1),c(r.a.createElement(fe,{key:+new Date,onBack:function(){return m(!0)}}))}},"An\xe1lise hist\xf3rica"),r.a.createElement(s.a,{type:"link",onClick:function(){m(!1),c(r.a.createElement(K,{key:+new Date,onBack:function(){return m(!0)}}))}},"An\xe1lise em tempo real")),r.a.createElement("div",{className:"view-container"},n))}var ve=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(be,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(ve,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[282,1,2]]]);
//# sourceMappingURL=main.0ef62e47.chunk.js.map