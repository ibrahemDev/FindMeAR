(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{559:function(e,t,a){"use strict";var n=a(1),r=a(5),i=a(13),o=a(0),c=(a(3),a(2)),s=a(6),p=a(10),b=o.forwardRef((function(e,t){var a=e.classes,i=e.className,s=e.component,b=void 0===s?"div":s,d=e.disableGutters,l=void 0!==d&&d,u=e.fixed,m=void 0!==u&&u,x=e.maxWidth,f=void 0===x?"lg":x,g=Object(r.a)(e,["classes","className","component","disableGutters","fixed","maxWidth"]);return o.createElement(b,Object(n.a)({className:Object(c.a)(a.root,i,m&&a.fixed,l&&a.disableGutters,!1!==f&&a["maxWidth".concat(Object(p.a)(String(f)))]),ref:t},g))}));t.a=Object(s.a)((function(e){return{root:Object(i.a)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:e.spacing(2),paddingRight:e.spacing(2)},e.breakpoints.up("sm"),{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(e.breakpoints.values).reduce((function(t,a){var n=e.breakpoints.values[a];return 0!==n&&(t[e.breakpoints.up(a)]={maxWidth:n}),t}),{}),maxWidthXs:Object(i.a)({},e.breakpoints.up("xs"),{maxWidth:Math.max(e.breakpoints.values.xs,444)}),maxWidthSm:Object(i.a)({},e.breakpoints.up("sm"),{maxWidth:e.breakpoints.values.sm}),maxWidthMd:Object(i.a)({},e.breakpoints.up("md"),{maxWidth:e.breakpoints.values.md}),maxWidthLg:Object(i.a)({},e.breakpoints.up("lg"),{maxWidth:e.breakpoints.values.lg}),maxWidthXl:Object(i.a)({},e.breakpoints.up("xl"),{maxWidth:e.breakpoints.values.xl})}}),{name:"MuiContainer"})(b)},580:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return l}));var n=a(0),r=a.n(n),i=a(541),o=a(559),c=a(534);function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){b(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function b(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}const d=Object(c.a)(e=>({root:{width:"100%",maxWidth:500},floor:{"text-align":"center",color:"#5254ae","font-size":"12em","font-weight":"bold","font-family":"Helvetica","text-shadow":"0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa,  0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1),  0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)"},content:{flexGrow:1},toolbar:p({display:"flex",alignItems:"center",justifyContent:"flex-end",padding:e.spacing(0,1)},e.mixins.toolbar)}));function l(){const e=d();return r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,null),r.a.createElement(o.a,{fixed:!0},r.a.createElement("main",{className:e.content},r.a.createElement("div",{className:e.toolbar}),r.a.createElement("div",{className:e.floor},"Home"))))}}}]);