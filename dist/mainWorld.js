var P=Object.defineProperty;var R=(w,h,x)=>h in w?P(w,h,{enumerable:!0,configurable:!0,writable:!0,value:x}):w[h]=x;var N=(w,h,x)=>R(w,typeof h!="symbol"?h+"":h,x);(function(){if(window.__UAISELECT_MAIN_WORLD_INITIALIZED__)return;window.__UAISELECT_MAIN_WORLD_INITIALIZED__=!0;const h=/(?:https?:\/\/[^/\s]+\/|file:\/\/\/?)((?:src|app|pages|components|lib|views)\/[^?:\s"']+\.[a-zA-Z0-9]+)(?:\?[^:\s"']*)?:(\d+)(?::(\d+))?/,x=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function _(t){return!t||typeof t!="string"?!1:x.some(e=>t.startsWith(e)||t===e)}function b(t){if(!t||typeof t!="string")return"";let e=t.replace(/\\/g,"/");return e=e.replace(/^\/@fs\//,"/"),e=e.replace(/\?.*$/,""),e=e.replace(/^webpack:\/\/[^/]*\//,""),e=e.replace(/^file:\/\/\/?/,""),e=e.replace(/^\/([a-zA-Z]:)/,"$1"),e}function k(t){if(!t)return null;let e=t,n=0;for(;e&&n<6;){try{const a=Object.keys(e);for(let s=0;s<a.length;s++){const i=a[s];if(i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$")){const o=e[i];if(o)return o}}}catch{}try{const a=Object.getOwnPropertyNames(e);for(let s=0;s<a.length;s++){const i=a[s];if(i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$")){const o=e[i];if(o)return o}}}catch{}e=e.parentElement,n++}return null}function C(t){if(!t)return null;if(typeof t=="string")return t;if(typeof t=="function")return t.displayName||t.name||"AnonymousComponent";if(typeof t=="object"){if(t.$$typeof&&typeof t.$$typeof=="symbol"){const e=t.$$typeof.toString();if(e.includes("react.memo"))return C(t.type)?`Memo(${C(t.type)})`:"Memo";if(e.includes("react.forward_ref"))return t.render&&(t.render.displayName||t.render.name)||"ForwardRef";if(e.includes("react.provider"))return"ContextProvider"}if(t.displayName)return t.displayName;if(t.name)return t.name;if(t.render)return C(t.render)}return null}function S(t){var a,s,i,o,u;if(!t)return null;const e=t._debugSource||((a=t._debugOwner)==null?void 0:a._debugSource);if(e&&e.fileName)return{fileName:b(e.fileName),lineNumber:Number(e.lineNumber)||1,columnNumber:e.columnNumber?Number(e.columnNumber):void 0};const n=((s=t.memoizedProps)==null?void 0:s.__source)||((i=t.pendingProps)==null?void 0:i.__source)||((o=t.memoizedProps)==null?void 0:o._source)||((u=t.pendingProps)==null?void 0:u._source);if(n&&n.fileName)return{fileName:b(n.fileName),lineNumber:Number(n.lineNumber)||1,columnNumber:n.columnNumber?Number(n.columnNumber):void 0};if(Array.isArray(t._debugInfo)){for(const r of t._debugInfo)if(r&&typeof r=="object"){if(r.fileName)return{fileName:b(r.fileName),lineNumber:Number(r.lineNumber)||1,columnNumber:r.columnNumber?Number(r.columnNumber):void 0};if(typeof r.stack=="string"){const m=r.stack.match(h);if(m)return{fileName:b(m[1]),lineNumber:parseInt(m[2],10)||1,columnNumber:m[3]?parseInt(m[3],10):void 0}}}}if(t._debugStack&&typeof t._debugStack=="string"){const r=t._debugStack.match(h);if(r)return{fileName:b(r[1]),lineNumber:parseInt(r[2],10)||1,columnNumber:r[3]?parseInt(r[3],10):void 0}}return null}function L(t){if(!t)return null;let e=null,n=t,a=0;for(;n&&a<30;){const o=S(n);if(o){const u=o.fileName.includes("node_modules");if((o.fileName.includes("/src/")||o.fileName.includes("/app/")||o.fileName.includes("/pages/")||o.fileName.startsWith("src/"))&&!u)return o;!e&&!u&&(e=o)}n=n._debugOwner,a++}let s=t,i=0;for(;s&&i<30;){const o=S(s);if(o){const u=o.fileName.includes("node_modules");if((o.fileName.includes("/src/")||o.fileName.includes("/app/")||o.fileName.includes("/pages/")||o.fileName.startsWith("src/"))&&!u)return o;!e&&!u&&(e=o)}s=s.return,i++}return e}function $(t){var o,u,r;let e;const n=[],a=new Set,s=k(t);if(s){const m=L(s);m&&(e=m);let c=s;for(;c;){const p=C(c.type),f=S(c),l=typeof c.type=="function"||typeof c.type=="object"&&p!==null&&typeof c.type!="string";if(p&&p!=="div"&&p!=="span"&&l&&!a.has(p)){a.add(p);let d;f&&(d={fileName:f.fileName,lineNumber:f.lineNumber,columnNumber:f.columnNumber,componentName:p,framework:"react"}),n.unshift({name:p,tag:typeof c.type=="string"?c.type:"component",source:d,isCustomComponent:!0}),!e&&d&&(e=d)}!e&&f&&(e={fileName:f.fileName,lineNumber:f.lineNumber,columnNumber:f.columnNumber,componentName:p||t.tagName.toLowerCase(),framework:"react"}),c=c.return}}let i=t;for(;i&&i!==document.body&&i!==document.documentElement;){const m=i.getAttribute("data-v-inspector")||i.getAttribute("data-source")||i.getAttribute("data-loc")||i.getAttribute("data-locator")||i.getAttribute("data-source-loc"),c=i.getAttribute("data-inspector-relative-path"),p=i.getAttribute("data-inspector-line");if(m&&!e){const d=m.split(":");if(d.length>=2){let g=d[0],E=parseInt(d[1],10)||1;d[0].length===1&&d.length>=3&&(g=`${d[0]}:${d[1]}`,E=parseInt(d[2],10)||1);const I=((o=g.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"Component";e={fileName:b(g),lineNumber:E,componentName:I,framework:g.endsWith(".vue")?"vue":"react"},n.unshift({name:I,tag:i.tagName.toLowerCase(),source:e,isCustomComponent:!0})}}else if(c&&p&&!e){const d=((u=c.split("/").pop())==null?void 0:u.replace(/\.[^.]+$/,""))||"Component";e={fileName:b(c),lineNumber:parseInt(p,10)||1,componentName:d,framework:"react"},n.unshift({name:d,tag:i.tagName.toLowerCase(),source:e,isCustomComponent:!0})}const f=i.__vueParentComponent||i.__vue__;if(f&&f.type){const d=f.type.name||f.type.__name||"VueComponent";!e&&f.type.__file&&(e={fileName:b(f.type.__file),lineNumber:1,componentName:d,framework:"vue"}),n.some(g=>g.name===d)||n.unshift({name:d,tag:i.tagName.toLowerCase(),source:e||void 0,isCustomComponent:!0})}const l=i.__svelte_meta;if(l&&l.loc&&!e){const d=l.loc.file,g=((r=d.split("/").pop())==null?void 0:r.replace(/\.[^.]+$/,""))||"SvelteComponent";e={fileName:b(d),lineNumber:l.loc.line||1,columnNumber:l.loc.column,componentName:g,framework:"svelte"},n.unshift({name:g,tag:i.tagName.toLowerCase(),source:e,isCustomComponent:!0})}i=i.parentElement}return{source:e,hierarchy:n}}function M(t){const e=window.getComputedStyle(t);return{display:e.display,position:e.position,width:`${Math.round(parseFloat(e.width)||0)}px`,height:`${Math.round(parseFloat(e.height)||0)}px`,margin:`${e.marginTop} ${e.marginRight} ${e.marginBottom} ${e.marginLeft}`,padding:`${e.paddingTop} ${e.paddingRight} ${e.paddingBottom} ${e.paddingLeft}`,color:e.color,backgroundColor:e.backgroundColor,fontSize:e.fontSize,fontFamily:e.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:e.borderRadius,border:`${e.borderWidth} ${e.borderStyle} ${e.borderColor}`,gap:e.gap!=="normal"?e.gap:void 0,flexDirection:e.display.includes("flex")?e.flexDirection:void 0}}function z(t,e=2){const n=t.cloneNode(!0);function a(s,i){if(i>=e&&s.children.length>0){s.textContent=`<!-- ... ${s.children.length} child elements truncated ... -->`;return}for(let o=0;o<s.children.length;o++)a(s.children[o],i+1)}return a(n,0),{innerSnippet:n.innerHTML.slice(0,1e3),outerSnippet:n.outerHTML.slice(0,1500)}}function y(t,e=0,n=3,a=new WeakSet){if(t==null)return t;const s=typeof t;if(s==="function")return`[Function: ${t.displayName||t.name||"anonymous"}]`;if(s==="symbol")return t.toString();if(s==="bigint")return`${t.toString()}n`;if(s==="string")return t.length>300?`${t.slice(0,300)}...`:t;if(s==="number"||s==="boolean")return t;if(t instanceof Element||t&&t.nodeType)return`<${t.tagName?t.tagName.toLowerCase():"Node"} />`;if(t&&(t.$$typeof||t._isReactElement))return`<${C(t.type)||"ReactNode"} />`;if(e>=n)return Array.isArray(t)?`[Array(${t.length})]`:"[Object]";if(typeof t=="object"){if(a.has(t))return"[Circular]";if(a.add(t),t instanceof Date)return t.toISOString();if(t instanceof RegExp)return t.toString();if(Array.isArray(t))return t.slice(0,25).map(u=>y(u,e+1,n,a));if(t instanceof Map){const u={};let r=0;for(const[m,c]of t.entries()){if(r++>25)break;u[String(m)]=y(c,e+1,n,a)}return u}if(t instanceof Set)return Array.from(t).slice(0,25).map(u=>y(u,e+1,n,a));const i={},o=Object.keys(t).slice(0,35);for(const u of o)if(!(u==="_owner"||u==="_store"||u==="$$typeof"||u==="__self"||u==="__source"||u==="children"))try{i[u]=y(t[u],e+1,n,a)}catch{i[u]="[Unserializable]"}return i}return String(t)}function T(t){const e=[],n=new Set;let a,s;const i=k(t);if(i){let r=i,m=i;for(;r&&!((typeof r.type=="function"||typeof r.type=="object"&&r.type!==null&&typeof r.type!="string")&&(r.memoizedProps||r.memoizedState));)r=r.return;const c=r||m,p=(c==null?void 0:c.memoizedProps)||(c==null?void 0:c.pendingProps)||i.memoizedProps||i.pendingProps;if(p&&typeof p=="object"){const f={};for(const l of Object.keys(p)){if(l==="children"||l==="key"||l==="ref"||l==="__source"||l==="__self")continue;const d=p[l];l.startsWith("on")&&l.length>2&&/[A-Z]/.test(l[2])?n.has(l)||(n.add(l),e.push({name:l,handlerName:typeof d=="function"?d.displayName||d.name||"anonymous":"handler"})):f[l]=d}Object.keys(f).length>0&&(a=y(f))}if(c!=null&&c.memoizedState)if(typeof c.type=="function"){const f={};let l=c.memoizedState,d=0;for(;l&&d<20;){if(l.memoizedState!==void 0&&!(l.memoizedState&&typeof l.memoizedState=="object"&&("create"in l.memoizedState||"destroy"in l.memoizedState||"tag"in l.memoizedState&&"inst"in l.memoizedState))){const E=y(l.memoizedState);E!==void 0&&(f[`state_${d}`]=E)}l=l.next,d++}Object.keys(f).length>0&&(s=f)}else typeof c.memoizedState=="object"&&(s=y(c.memoizedState))}let o=t;for(;o&&o!==document.body&&o!==document.documentElement;){const r=o.__vueParentComponent||o.__vue__;if(r){r.props&&typeof r.props=="object"&&Object.keys(r.props).length>0&&(a={...a,...y(r.props)});const m=r.setupState||r.data;m&&typeof m=="object"&&Object.keys(m).length>0&&(s={...s||{},...y(m)});break}o=o.parentElement}const u=["onclick","onchange","onsubmit","onkeydown","onkeyup","oninput","onfocus","onblur"];for(const r of u){const m=t[r]||t.getAttribute(r);if(m){const c="on"+r.slice(2).charAt(0).toUpperCase()+r.slice(3);n.has(c)||(n.add(c),e.push({name:c,handlerName:typeof m=="function"?m.name||"inline":String(m).slice(0,40)}))}}if(!(!a&&!s&&e.length===0))return{props:a,state:s,events:e.length>0?e:void 0}}function A(t){const e=t.getBoundingClientRect(),n=Array.from(t.classList||[]),a=n.filter(_),s=n.filter(p=>!_(p)),{source:i,hierarchy:o}=$(t);o.length===0&&o.push({name:`<${t.tagName.toLowerCase()}>`,tag:t.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:u,outerSnippet:r}=z(t),m=M(t),c=T(t);return{tagName:t.tagName.toLowerCase(),id:t.id||"",className:t.className||"",classList:n,tailwindClasses:a,customClasses:s,source:i,hierarchy:o,innerHTMLSnippet:u,outerHTMLSnippet:r,innerTextSnippet:(t.innerText||"").slice(0,200).trim(),computedStyles:m,dataContext:c,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class O{constructor(){N(this,"container",null);N(this,"shadowRoot",null);N(this,"highlightBox",null);N(this,"badge",null);N(this,"banner",null);N(this,"currentElement",null);N(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .uaiselect-highlight {
          position: fixed;
          border: 1.5px solid #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.5);
          pointer-events: none;
          transition: all 0.06s cubic-bezier(0.4, 0, 0.2, 1);
          display: none;
          z-index: 2147483645;
        }
        .uaiselect-badge {
          position: fixed;
          background: #09090b;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          display: none;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          border: 1px solid #27272a;
          z-index: 2147483646;
          pointer-events: none;
          max-width: 380px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.06s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .uaiselect-badge-comp {
          color: #ffffff;
          font-weight: 700;
        }
        .uaiselect-badge-src {
          color: #a1a1aa;
          font-size: 10px;
          background: #18181b;
          padding: 2px 5px;
          border-radius: 4px;
          border: 1px solid #27272a;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .uaiselect-badge-dim {
          color: #71717a;
          font-size: 10px;
          font-family: monospace;
        }
        .uaiselect-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(12px);
          color: #f4f4f5;
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 0 1px #27272a;
          z-index: 2147483647;
          pointer-events: auto;
          animation: uaiselect-fade-in 0.2s ease-out;
        }
        .uaiselect-kbd {
          background: #18181b;
          color: #d4d4d8;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          border: 1px solid #3f3f46;
          font-family: monospace;
        }
        .uaiselect-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px #ffffff;
        }
        @keyframes uaiselect-fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes uaiselect-flash {
          0% { background: rgba(255, 255, 255, 0.3); transform: scale(1); }
          50% { background: rgba(255, 255, 255, 0.6); transform: scale(1.01); }
          100% { background: rgba(255, 255, 255, 0.08); transform: scale(1); }
        }
        .uaiselect-flash-anim {
          animation: uaiselect-flash 0.25s ease-out;
        }
      `,this.highlightBox=document.createElement("div"),this.highlightBox.className="uaiselect-highlight",this.badge=document.createElement("div"),this.badge.className="uaiselect-badge",this.banner=document.createElement("div"),this.banner.className="uaiselect-banner";const n=document.createElement("div");n.className="uaiselect-dot";const a=document.createElement("span"),s=document.createElement("strong");s.textContent="UaiSelect",a.appendChild(s),a.appendChild(document.createTextNode(" Inspector activo"));const i=document.createElement("span");i.className="uaiselect-kbd",i.textContent="ESC para salir";const o=document.createElement("span");o.className="uaiselect-kbd",o.textContent="↑ / ↓ navegar",this.banner.replaceChildren(n,a,i,o),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),document.documentElement.appendChild(this.container)}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(e){var a;if(!this.isActive)return;const n=document.elementFromPoint(e.clientX,e.clientY);!n||n===this.container||(a=this.container)!=null&&a.contains(n)||this.updateHighlight(n)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(e){if(this.isActive){if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.deactivate();return}if(e.key==="ArrowUp"&&this.currentElement){e.preventDefault(),e.stopPropagation();const n=this.currentElement.parentElement;n&&n!==document.body&&n!==document.documentElement&&this.updateHighlight(n);return}if(e.key==="ArrowDown"&&this.currentElement){e.preventDefault(),e.stopPropagation();const n=this.currentElement.firstElementChild;n&&this.updateHighlight(n);return}}}handleClick(e){if(!this.isActive)return;e.preventDefault(),e.stopPropagation();const n=this.currentElement||document.elementFromPoint(e.clientX,e.clientY);if(!n)return;this.highlightBox&&(this.highlightBox.classList.add("uaiselect-flash-anim"),setTimeout(()=>{var s;(s=this.highlightBox)==null||s.classList.remove("uaiselect-flash-anim")},300));const a=A(n);window.postMessage({type:"UAISELECT_ELEMENT_SELECTED",payload:a},"*"),this.deactivate()}updateHighlight(e){var l;if(this.currentElement=e,!this.highlightBox||!this.badge)return;const n=e.getBoundingClientRect();if(n.width===0&&n.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${n.top}px`,this.highlightBox.style.left=`${n.left}px`,this.highlightBox.style.width=`${n.width}px`,this.highlightBox.style.height=`${n.height}px`;const{source:a,hierarchy:s}=$(e),i=(a==null?void 0:a.componentName)||((l=s[0])==null?void 0:l.name)||`<${e.tagName.toLowerCase()}>`,o=a?`${a.fileName.split("/").pop()}:${a.lineNumber}`:"",u=`${Math.round(n.width)} × ${Math.round(n.height)}`,r=document.createElement("span");r.className="uaiselect-badge-comp",r.textContent=i;const m=[r];if(o){const d=document.createElement("span");d.className="uaiselect-badge-src",d.textContent=o,m.push(d)}const c=document.createElement("span");c.className="uaiselect-badge-dim",c.textContent=u,m.push(c),this.badge.replaceChildren(...m),this.badge.style.display="flex";let p=n.top-32;p<10&&(p=n.bottom+8);let f=Math.max(10,n.left);f+300>window.innerWidth&&(f=window.innerWidth-310),this.badge.style.top=`${p}px`,this.badge.style.left=`${f}px`}}const v=new O;document.addEventListener("UAISELECT_INSPECT_DOM_EVENT",t=>{const e=t.target;if(e)try{const n=A(e);e.setAttribute("data-uaiselect-data",JSON.stringify(n))}catch(n){console.error("[UaiSelect] Error extracting in main world:",n)}},!0),window.addEventListener("message",t=>{t.source===window&&(!t.data||typeof t.data!="object"||(t.data.type==="UAISELECT_TOGGLE_INSPECTOR"?v.toggle():t.data.type==="UAISELECT_START_INSPECTION"?v.activate():t.data.type==="UAISELECT_STOP_INSPECTION"&&v.deactivate()))})})();
