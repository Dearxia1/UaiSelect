var P=Object.defineProperty;var R=(w,h,x)=>h in w?P(w,h,{enumerable:!0,configurable:!0,writable:!0,value:x}):w[h]=x;var N=(w,h,x)=>R(w,typeof h!="symbol"?h+"":h,x);(function(){if(window.__UAISELECT_MAIN_WORLD_INITIALIZED__)return;window.__UAISELECT_MAIN_WORLD_INITIALIZED__=!0;const h=/(?:https?:\/\/[^/\s]+\/|file:\/\/\/?)((?:src|app|pages|components|lib|views)\/[^?:\s"']+\.[a-zA-Z0-9]+)(?:\?[^:\s"']*)?:(\d+)(?::(\d+))?/,x=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function C(t){return!t||typeof t!="string"?!1:x.some(e=>t.startsWith(e)||t===e)}function b(t){if(!t||typeof t!="string")return"";let e=t.replace(/\\/g,"/");return e=e.replace(/^\/@fs\//,"/"),e=e.replace(/\?.*$/,""),e=e.replace(/^webpack:\/\/[^/]*\//,""),e=e.replace(/^file:\/\/\/?/,""),e=e.replace(/^\/([a-zA-Z]:)/,"$1"),e}function k(t){if(!t)return null;let e=t,i=0;for(;e&&i<6;){const a=Object.keys(e);for(let s=0;s<a.length;s++){const o=a[s];if(o.startsWith("__reactFiber$")||o.startsWith("__reactInternalInstance$")){const r=e[o];if(r)return r}}try{const s=Object.getOwnPropertyNames(e);for(let o=0;o<s.length;o++){const r=s[o];if(r.startsWith("__reactFiber$")||r.startsWith("__reactInternalInstance$")){const l=e[r];if(l)return l}}}catch{}e=e.parentElement,i++}return null}function v(t){if(!t)return null;if(typeof t=="string")return t;if(typeof t=="function")return t.displayName||t.name||"AnonymousComponent";if(typeof t=="object"){if(t.$$typeof&&typeof t.$$typeof=="symbol"){const e=t.$$typeof.toString();if(e.includes("react.memo"))return v(t.type)?`Memo(${v(t.type)})`:"Memo";if(e.includes("react.forward_ref"))return t.render&&(t.render.displayName||t.render.name)||"ForwardRef";if(e.includes("react.provider"))return"ContextProvider"}if(t.displayName)return t.displayName;if(t.name)return t.name;if(t.render)return v(t.render)}return null}function _(t){var a,s,o,r,l;if(!t)return null;const e=t._debugSource||((a=t._debugOwner)==null?void 0:a._debugSource);if(e&&e.fileName)return{fileName:b(e.fileName),lineNumber:Number(e.lineNumber)||1,columnNumber:e.columnNumber?Number(e.columnNumber):void 0};const i=((s=t.memoizedProps)==null?void 0:s.__source)||((o=t.pendingProps)==null?void 0:o.__source)||((r=t.memoizedProps)==null?void 0:r._source)||((l=t.pendingProps)==null?void 0:l._source);if(i&&i.fileName)return{fileName:b(i.fileName),lineNumber:Number(i.lineNumber)||1,columnNumber:i.columnNumber?Number(i.columnNumber):void 0};if(Array.isArray(t._debugInfo)){for(const n of t._debugInfo)if(n&&typeof n=="object"){if(n.fileName)return{fileName:b(n.fileName),lineNumber:Number(n.lineNumber)||1,columnNumber:n.columnNumber?Number(n.columnNumber):void 0};if(typeof n.stack=="string"){const m=n.stack.match(h);if(m)return{fileName:b(m[1]),lineNumber:parseInt(m[2],10)||1,columnNumber:m[3]?parseInt(m[3],10):void 0}}}}if(t._debugStack&&typeof t._debugStack=="string"){const n=t._debugStack.match(h);if(n)return{fileName:b(n[1]),lineNumber:parseInt(n[2],10)||1,columnNumber:n[3]?parseInt(n[3],10):void 0}}return null}function M(t){if(!t)return null;let e=null,i=t,a=0;for(;i&&a<30;){const r=_(i);if(r){const l=r.fileName.includes("node_modules");if((r.fileName.includes("/src/")||r.fileName.includes("/app/")||r.fileName.includes("/pages/")||r.fileName.startsWith("src/"))&&!l)return r;!e&&!l&&(e=r)}i=i._debugOwner,a++}let s=t,o=0;for(;s&&o<30;){const r=_(s);if(r){const l=r.fileName.includes("node_modules");if((r.fileName.includes("/src/")||r.fileName.includes("/app/")||r.fileName.includes("/pages/")||r.fileName.startsWith("src/"))&&!l)return r;!e&&!l&&(e=r)}s=s.return,o++}return e}function $(t){var r,l,n;let e;const i=[],a=new Set,s=k(t);if(s){const m=M(s);m&&(e=m);let c=s;for(;c;){const p=v(c.type),f=_(c),d=typeof c.type=="function"||typeof c.type=="object"&&p!==null&&typeof c.type!="string";if(p&&p!=="div"&&p!=="span"&&d&&!a.has(p)){a.add(p);let u;f&&(u={fileName:f.fileName,lineNumber:f.lineNumber,columnNumber:f.columnNumber,componentName:p,framework:"react"}),i.unshift({name:p,tag:typeof c.type=="string"?c.type:"component",source:u,isCustomComponent:!0}),!e&&u&&(e=u)}!e&&f&&(e={fileName:f.fileName,lineNumber:f.lineNumber,columnNumber:f.columnNumber,componentName:p||t.tagName.toLowerCase(),framework:"react"}),c=c.return}}let o=t;for(;o&&o!==document.body&&o!==document.documentElement;){const m=o.getAttribute("data-v-inspector")||o.getAttribute("data-source")||o.getAttribute("data-loc")||o.getAttribute("data-locator")||o.getAttribute("data-source-loc"),c=o.getAttribute("data-inspector-relative-path"),p=o.getAttribute("data-inspector-line");if(m&&!e){const u=m.split(":");if(u.length>=2){let g=u[0],S=parseInt(u[1],10)||1;u[0].length===1&&u.length>=3&&(g=`${u[0]}:${u[1]}`,S=parseInt(u[2],10)||1);const A=((r=g.split("/").pop())==null?void 0:r.replace(/\.[^.]+$/,""))||"Component";e={fileName:b(g),lineNumber:S,componentName:A,framework:g.endsWith(".vue")?"vue":"react"},i.unshift({name:A,tag:o.tagName.toLowerCase(),source:e,isCustomComponent:!0})}}else if(c&&p&&!e){const u=((l=c.split("/").pop())==null?void 0:l.replace(/\.[^.]+$/,""))||"Component";e={fileName:b(c),lineNumber:parseInt(p,10)||1,componentName:u,framework:"react"},i.unshift({name:u,tag:o.tagName.toLowerCase(),source:e,isCustomComponent:!0})}const f=o.__vueParentComponent||o.__vue__;if(f&&f.type){const u=f.type.name||f.type.__name||"VueComponent";!e&&f.type.__file&&(e={fileName:b(f.type.__file),lineNumber:1,componentName:u,framework:"vue"}),i.some(g=>g.name===u)||i.unshift({name:u,tag:o.tagName.toLowerCase(),source:e||void 0,isCustomComponent:!0})}const d=o.__svelte_meta;if(d&&d.loc&&!e){const u=d.loc.file,g=((n=u.split("/").pop())==null?void 0:n.replace(/\.[^.]+$/,""))||"SvelteComponent";e={fileName:b(u),lineNumber:d.loc.line||1,columnNumber:d.loc.column,componentName:g,framework:"svelte"},i.unshift({name:g,tag:o.tagName.toLowerCase(),source:e,isCustomComponent:!0})}o=o.parentElement}return{source:e,hierarchy:i}}function I(t){const e=window.getComputedStyle(t);return{display:e.display,position:e.position,width:`${Math.round(parseFloat(e.width)||0)}px`,height:`${Math.round(parseFloat(e.height)||0)}px`,margin:`${e.marginTop} ${e.marginRight} ${e.marginBottom} ${e.marginLeft}`,padding:`${e.paddingTop} ${e.paddingRight} ${e.paddingBottom} ${e.paddingLeft}`,color:e.color,backgroundColor:e.backgroundColor,fontSize:e.fontSize,fontFamily:e.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:e.borderRadius,border:`${e.borderWidth} ${e.borderStyle} ${e.borderColor}`,gap:e.gap!=="normal"?e.gap:void 0,flexDirection:e.display.includes("flex")?e.flexDirection:void 0}}function T(t,e=2){const i=t.cloneNode(!0);function a(s,o){if(o>=e&&s.children.length>0){s.innerHTML=`<!-- ... ${s.children.length} child elements truncated ... -->`;return}for(let r=0;r<s.children.length;r++)a(s.children[r],o+1)}return a(i,0),{innerSnippet:i.innerHTML.slice(0,1e3),outerSnippet:i.outerHTML.slice(0,1500)}}function y(t,e=0,i=3,a=new WeakSet){if(t==null)return t;const s=typeof t;if(s==="function")return`[Function: ${t.displayName||t.name||"anonymous"}]`;if(s==="symbol")return t.toString();if(s==="bigint")return`${t.toString()}n`;if(s==="string")return t.length>300?`${t.slice(0,300)}...`:t;if(s==="number"||s==="boolean")return t;if(t instanceof Element||t&&t.nodeType)return`<${t.tagName?t.tagName.toLowerCase():"Node"} />`;if(t&&(t.$$typeof||t._isReactElement))return`<${v(t.type)||"ReactNode"} />`;if(e>=i)return Array.isArray(t)?`[Array(${t.length})]`:"[Object]";if(typeof t=="object"){if(a.has(t))return"[Circular]";if(a.add(t),t instanceof Date)return t.toISOString();if(t instanceof RegExp)return t.toString();if(Array.isArray(t))return t.slice(0,25).map(l=>y(l,e+1,i,a));if(t instanceof Map){const l={};let n=0;for(const[m,c]of t.entries()){if(n++>25)break;l[String(m)]=y(c,e+1,i,a)}return l}if(t instanceof Set)return Array.from(t).slice(0,25).map(l=>y(l,e+1,i,a));const o={},r=Object.keys(t).slice(0,35);for(const l of r)if(!(l==="_owner"||l==="_store"||l==="$$typeof"||l==="__self"||l==="__source"||l==="children"))try{o[l]=y(t[l],e+1,i,a)}catch{o[l]="[Unserializable]"}return o}return String(t)}function z(t){const e=[],i=new Set;let a,s;const o=k(t);if(o){let n=o,m=o;for(;n&&!((typeof n.type=="function"||typeof n.type=="object"&&n.type!==null&&typeof n.type!="string")&&(n.memoizedProps||n.memoizedState));)n=n.return;const c=n||m,p=(c==null?void 0:c.memoizedProps)||(c==null?void 0:c.pendingProps)||o.memoizedProps||o.pendingProps;if(p&&typeof p=="object"){const f={};for(const d of Object.keys(p)){if(d==="children"||d==="key"||d==="ref"||d==="__source"||d==="__self")continue;const u=p[d];d.startsWith("on")&&d.length>2&&/[A-Z]/.test(d[2])?i.has(d)||(i.add(d),e.push({name:d,handlerName:typeof u=="function"?u.displayName||u.name||"anonymous":"handler"})):f[d]=u}Object.keys(f).length>0&&(a=y(f))}if(c!=null&&c.memoizedState)if(typeof c.type=="function"){const f={};let d=c.memoizedState,u=0;for(;d&&u<20;){if(d.memoizedState!==void 0&&!(d.memoizedState&&typeof d.memoizedState=="object"&&("create"in d.memoizedState||"destroy"in d.memoizedState||"tag"in d.memoizedState&&"inst"in d.memoizedState))){const S=y(d.memoizedState);S!==void 0&&(f[`state_${u}`]=S)}d=d.next,u++}Object.keys(f).length>0&&(s=f)}else typeof c.memoizedState=="object"&&(s=y(c.memoizedState))}let r=t;for(;r&&r!==document.body&&r!==document.documentElement;){const n=r.__vueParentComponent||r.__vue__;if(n){n.props&&typeof n.props=="object"&&Object.keys(n.props).length>0&&(a={...a,...y(n.props)});const m=n.setupState||n.data;m&&typeof m=="object"&&Object.keys(m).length>0&&(s={...s||{},...y(m)});break}r=r.parentElement}const l=["onclick","onchange","onsubmit","onkeydown","onkeyup","oninput","onfocus","onblur"];for(const n of l){const m=t[n]||t.getAttribute(n);if(m){const c="on"+n.slice(2).charAt(0).toUpperCase()+n.slice(3);i.has(c)||(i.add(c),e.push({name:c,handlerName:typeof m=="function"?m.name||"inline":String(m).slice(0,40)}))}}if(!(!a&&!s&&e.length===0))return{props:a,state:s,events:e.length>0?e:void 0}}function L(t){const e=t.getBoundingClientRect(),i=Array.from(t.classList||[]),a=i.filter(C),s=i.filter(p=>!C(p)),{source:o,hierarchy:r}=$(t);r.length===0&&r.push({name:`<${t.tagName.toLowerCase()}>`,tag:t.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:l,outerSnippet:n}=T(t),m=I(t),c=z(t);return{tagName:t.tagName.toLowerCase(),id:t.id||"",className:t.className||"",classList:i,tailwindClasses:a,customClasses:s,source:o,hierarchy:r,innerHTMLSnippet:l,outerHTMLSnippet:n,innerTextSnippet:(t.innerText||"").slice(0,200).trim(),computedStyles:m,dataContext:c,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class O{constructor(){N(this,"container",null);N(this,"shadowRoot",null);N(this,"highlightBox",null);N(this,"badge",null);N(this,"banner",null);N(this,"currentElement",null);N(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
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
      `,this.highlightBox=document.createElement("div"),this.highlightBox.className="uaiselect-highlight",this.badge=document.createElement("div"),this.badge.className="uaiselect-badge",this.banner=document.createElement("div"),this.banner.className="uaiselect-banner",this.banner.innerHTML=`
        <div class="uaiselect-dot"></div>
        <span><strong>UaiSelect</strong> Inspector activo</span>
        <span class="uaiselect-kbd">ESC para salir</span>
        <span class="uaiselect-kbd">↑ / ↓ navegar</span>
      `,this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),document.documentElement.appendChild(this.container)}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(e){var a;if(!this.isActive)return;const i=document.elementFromPoint(e.clientX,e.clientY);!i||i===this.container||(a=this.container)!=null&&a.contains(i)||this.updateHighlight(i)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(e){if(this.isActive){if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.deactivate();return}if(e.key==="ArrowUp"&&this.currentElement){e.preventDefault(),e.stopPropagation();const i=this.currentElement.parentElement;i&&i!==document.body&&i!==document.documentElement&&this.updateHighlight(i);return}if(e.key==="ArrowDown"&&this.currentElement){e.preventDefault(),e.stopPropagation();const i=this.currentElement.firstElementChild;i&&this.updateHighlight(i);return}}}handleClick(e){if(!this.isActive)return;e.preventDefault(),e.stopPropagation();const i=this.currentElement||document.elementFromPoint(e.clientX,e.clientY);if(!i)return;this.highlightBox&&(this.highlightBox.classList.add("uaiselect-flash-anim"),setTimeout(()=>{var s;(s=this.highlightBox)==null||s.classList.remove("uaiselect-flash-anim")},300));const a=L(i);window.postMessage({type:"UAISELECT_ELEMENT_SELECTED",payload:a},"*"),this.deactivate()}updateHighlight(e){var c;if(this.currentElement=e,!this.highlightBox||!this.badge)return;const i=e.getBoundingClientRect();if(i.width===0&&i.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${i.top}px`,this.highlightBox.style.left=`${i.left}px`,this.highlightBox.style.width=`${i.width}px`,this.highlightBox.style.height=`${i.height}px`;const{source:a,hierarchy:s}=$(e),o=(a==null?void 0:a.componentName)||((c=s[0])==null?void 0:c.name)||`<${e.tagName.toLowerCase()}>`,r=a?`${a.fileName.split("/").pop()}:${a.lineNumber}`:"",l=`${Math.round(i.width)} × ${Math.round(i.height)}`;this.badge.innerHTML=`
        <span class="uaiselect-badge-comp">${o}</span>
        ${r?`<span class="uaiselect-badge-src">${r}</span>`:""}
        <span class="uaiselect-badge-dim">${l}</span>
      `,this.badge.style.display="flex";let n=i.top-32;n<10&&(n=i.bottom+8);let m=Math.max(10,i.left);m+300>window.innerWidth&&(m=window.innerWidth-310),this.badge.style.top=`${n}px`,this.badge.style.left=`${m}px`}}const E=new O;document.addEventListener("UAISELECT_INSPECT_DOM_EVENT",t=>{const e=t.target;if(e)try{const i=L(e);e.setAttribute("data-uaiselect-data",JSON.stringify(i))}catch(i){console.error("[UaiSelect] Error extracting in main world:",i)}},!0),window.addEventListener("message",t=>{t.source===window&&(!t.data||typeof t.data!="object"||(t.data.type==="UAISELECT_TOGGLE_INSPECTOR"?E.toggle():t.data.type==="UAISELECT_START_INSPECTION"?E.activate():t.data.type==="UAISELECT_STOP_INSPECTION"&&E.deactivate()))})})();
