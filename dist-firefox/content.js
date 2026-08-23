var w=Object.defineProperty;var x=(i,e,t)=>e in i?w(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var h=(i,e,t)=>x(i,typeof e!="symbol"?e+"":e,t);function y(i){const t=Object.keys(i).find(n=>n.startsWith("__reactFiber$")||n.startsWith("__reactInternalInstance$"));return t?i[t]:null}function f(i){if(!i)return null;if(typeof i=="string")return i;if(typeof i=="function")return i.displayName||i.name||"AnonymousComponent";if(typeof i=="object"){if(i.$$typeof&&typeof i.$$typeof=="symbol"){const e=i.$$typeof.toString();if(e.includes("react.memo"))return f(i.type)?`Memo(${f(i.type)})`:"Memo";if(e.includes("react.forward_ref"))return i.render&&(i.render.displayName||i.render.name)||"ForwardRef";if(e.includes("react.provider"))return"ContextProvider"}if(i.displayName)return i.displayName;if(i.name)return i.name}return null}function g(i){return i?i.replace(/^webpack:\/\/[^/]*\//,"").replace(/^file:\/\/\/?/,"").replace(/^\/([A-Z]:)/,"$1"):""}function N(i){var r;const e=[];let t;const n=y(i);if(!n)return{hierarchy:e};let o=n;const l=new Set;for(;o;){const a=f(o.type),s=o._debugSource||((r=o._debugOwner)==null?void 0:r._debugSource),d=typeof o.type=="function"||typeof o.type=="object"&&a!==null&&typeof o.type!="string";if(a&&a!=="div"&&a!=="span"&&d&&!l.has(a)){l.add(a);let c;s&&(c={fileName:g(s.fileName),lineNumber:s.lineNumber,columnNumber:s.columnNumber,componentName:a,framework:"react"}),e.unshift({name:a,tag:typeof o.type=="string"?o.type:"component",source:c,isCustomComponent:!0}),!t&&c&&(t=c)}!t&&o._debugSource&&(t={fileName:g(o._debugSource.fileName),lineNumber:o._debugSource.lineNumber,columnNumber:o._debugSource.columnNumber,componentName:a||i.tagName.toLowerCase(),framework:"react"}),o=o.return||null}return{source:t,hierarchy:e}}function C(i,e){var n;if(!i)return;const t=i.split(":");if(t.length>=2){let o="",l=1,r;t[0].length===1&&t.length>=3?(o=`${t[0]}:${t[1]}`,l=parseInt(t[2],10)||1,r=t[3]?parseInt(t[3],10):void 0):(o=t[0],l=parseInt(t[1],10)||1,r=t[2]?parseInt(t[2],10):void 0);const a=((n=o.split("/").pop())==null?void 0:n.replace(/\.[^.]+$/,""))||"Component";return{fileName:o,lineNumber:l,columnNumber:r,componentName:a,framework:e}}}function S(i){var o,l;const e=[];let t,n=i;for(;n&&n!==document.body&&n!==document.documentElement;){const r=n.getAttribute("data-v-inspector");r&&!t&&(t=C(r,"vue"),t!=null&&t.componentName&&e.unshift({name:t.componentName,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0}));const a=n.getAttribute("data-astro-source-file"),s=n.getAttribute("data-astro-source-loc");if(a&&!t){const u=s?parseInt(s.split(":")[0],10):1,p=((o=a.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"AstroComponent";t={fileName:a,lineNumber:u,componentName:p,framework:"unknown"},e.unshift({name:p,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}const d=n.__svelte_meta;d&&d.loc&&!t&&(t={fileName:d.loc.file,lineNumber:d.loc.line,columnNumber:d.loc.column,componentName:((l=d.loc.file.split("/").pop())==null?void 0:l.replace(/\.[^.]+$/,""))||"SvelteComponent",framework:"svelte"},e.unshift({name:t.componentName||"SvelteComponent",tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0}));const c=n.__vueParentComponent;if(c&&c.type){const u=c.type.name||c.type.__name||"VueComponent";e.some(p=>p.name===u)||e.unshift({name:u,tag:n.tagName.toLowerCase(),isCustomComponent:!0})}n=n.parentElement}return{source:t,hierarchy:e}}const E=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function b(i){return!i||typeof i!="string"?!1:E.some(e=>i.startsWith(e)||i===e)}function k(i){const e=window.getComputedStyle(i);return{display:e.display,position:e.position,width:`${Math.round(parseFloat(e.width)||0)}px`,height:`${Math.round(parseFloat(e.height)||0)}px`,margin:`${e.marginTop} ${e.marginRight} ${e.marginBottom} ${e.marginLeft}`,padding:`${e.paddingTop} ${e.paddingRight} ${e.paddingBottom} ${e.paddingLeft}`,color:e.color,backgroundColor:e.backgroundColor,fontSize:e.fontSize,fontFamily:e.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:e.borderRadius,border:`${e.borderWidth} ${e.borderStyle} ${e.borderColor}`,gap:e.gap!=="normal"?e.gap:void 0,flexDirection:e.display.includes("flex")?e.flexDirection:void 0}}function $(i,e=2){const t=i.cloneNode(!0);function n(r,a){if(a>=e&&r.children.length>0){r.innerHTML=`<!-- ... ${r.children.length} child elements truncated ... -->`;return}for(let s=0;s<r.children.length;s++)n(r.children[s],a+1)}n(t,0);const o=t.outerHTML.slice(0,1500);return{innerSnippet:t.innerHTML.slice(0,1e3),outerSnippet:o}}function v(i){const e=i.getBoundingClientRect(),t=Array.from(i.classList||[]),n=t.filter(b),o=t.filter(p=>!b(p)),l=N(i),r=S(i),a=l.source||r.source,s=l.hierarchy.length>0?l.hierarchy:r.hierarchy;s.length===0&&s.push({name:`<${i.tagName.toLowerCase()}>`,tag:i.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:d,outerSnippet:c}=$(i),u=k(i);return{tagName:i.tagName.toLowerCase(),id:i.id||"",className:i.className||"",classList:t,tailwindClasses:n,customClasses:o,source:a,hierarchy:s,innerHTMLSnippet:d,outerHTMLSnippet:c,innerTextSnippet:(i.innerText||"").slice(0,200).trim(),computedStyles:u,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class M{constructor(e){h(this,"container",null);h(this,"shadowRoot",null);h(this,"highlightBox",null);h(this,"badge",null);h(this,"banner",null);h(this,"currentElement",null);h(this,"isActive",!1);h(this,"onSelectCallback");this.onSelectCallback=e,this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
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
      <span class="uaiselect-dot"></span>
      <strong>UaiSelect Inspector</strong>
      <span>Clic para capturar</span>
      <span><span class="uaiselect-kbd">↑ / ↓</span> Cambiar nivel</span>
      <span><span class="uaiselect-kbd">Esc</span> Salir</span>
    `,this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),document.documentElement.appendChild(this.container)}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(e){var n;if(!this.isActive)return;const t=document.elementFromPoint(e.clientX,e.clientY);!t||t===this.container||(n=this.container)!=null&&n.contains(t)||this.updateHighlight(t)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(e){if(this.isActive){if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.deactivate();return}if(e.key==="ArrowUp"&&this.currentElement){e.preventDefault(),e.stopPropagation();const t=this.currentElement.parentElement;t&&t!==document.body&&t!==document.documentElement&&this.updateHighlight(t);return}if(e.key==="ArrowDown"&&this.currentElement){e.preventDefault(),e.stopPropagation();const t=this.currentElement.firstElementChild;t&&this.updateHighlight(t);return}}}handleClick(e){if(!this.isActive)return;e.preventDefault(),e.stopPropagation();const t=this.currentElement||document.elementFromPoint(e.clientX,e.clientY);if(!t)return;this.highlightBox&&(this.highlightBox.classList.add("uaiselect-flash-anim"),setTimeout(()=>{var o;(o=this.highlightBox)==null||o.classList.remove("uaiselect-flash-anim")},300));const n=v(t);this.onSelectCallback&&this.onSelectCallback(n),this.deactivate()}updateHighlight(e){var d,c;if(this.currentElement=e,!this.highlightBox||!this.badge)return;const t=e.getBoundingClientRect();if(t.width===0&&t.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${t.top}px`,this.highlightBox.style.left=`${t.left}px`,this.highlightBox.style.width=`${t.width}px`,this.highlightBox.style.height=`${t.height}px`;const n=v(e),o=((d=n.source)==null?void 0:d.componentName)||((c=n.hierarchy[0])==null?void 0:c.name)||`<${e.tagName.toLowerCase()}>`,l=n.source?`${n.source.fileName.split("/").pop()}:${n.source.lineNumber}`:"",r=`${Math.round(t.width)} × ${Math.round(t.height)}`;this.badge.innerHTML=`
      <span class="uaiselect-badge-comp">${o}</span>
      ${l?`<span class="uaiselect-badge-src">${l}</span>`:""}
      <span class="uaiselect-badge-dim">${r}</span>
    `,this.badge.style.display="flex";let a=t.top-32;a<10&&(a=t.bottom+8);let s=Math.max(10,t.left);s+300>window.innerWidth&&(s=window.innerWidth-310),this.badge.style.top=`${a}px`,this.badge.style.left=`${s}px`}}const m=new M(i=>{chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:i})});chrome.runtime.onMessage.addListener((i,e,t)=>{if(i.type==="TOGGLE_INSPECTOR"){const n=m.toggle();return t({active:n}),!0}if(i.type==="START_INSPECTION")return m.activate(),t({active:!0}),!0;if(i.type==="STOP_INSPECTION")return m.deactivate(),t({active:!1}),!0});
