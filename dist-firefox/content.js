var D=Object.defineProperty;var _=(v,b,y)=>b in v?D(v,b,{enumerable:!0,configurable:!0,writable:!0,value:y}):v[b]=y;var w=(v,b,y)=>_(v,typeof b!="symbol"?b+"":b,y);(function(){if(window.__UAISELECT_CONTENT_INITIALIZED__)return;window.__UAISELECT_CONTENT_INITIALIZED__=!0;const b=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function y(i){return!i||typeof i!="string"?!1:b.some(t=>i.startsWith(t)||i===t)}function M(i){if(!i||typeof i!="string")return"";let t=i.replace(/\\/g,"/");return t=t.replace(/^\/@fs\//,"/"),t=t.replace(/\?.*$/,""),t=t.replace(/^webpack:\/\/[^/]*\//,""),t=t.replace(/^file:\/\/\/?/,""),t=t.replace(/^\/([a-zA-Z]:)/,"$1"),t}function C(){if(!document.getElementById("uaiselect-main-world-bridge"))try{const i=document.createElement("script");i.id="uaiselect-main-world-bridge",typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL&&(i.src=chrome.runtime.getURL("mainWorld.js"),i.onload=()=>{i.setAttribute("data-loaded","true")},(document.head||document.documentElement).appendChild(i))}catch(i){console.error("[UaiSelect] Bridge injection error:",i)}}C();function S(i){C();try{i.dispatchEvent(new CustomEvent("UAISELECT_INSPECT_DOM_EVENT",{bubbles:!0,cancelable:!0}));const t=i.getAttribute("data-uaiselect-data");if(t)return i.removeAttribute("data-uaiselect-data"),JSON.parse(t)}catch(t){console.error("[UaiSelect] Error querying main world bridge:",t)}return null}function N(i){var s,r;let t;const e=[];let n=i;for(;n&&n!==document.body&&n!==document.documentElement;){const l=n.getAttribute("data-v-inspector")||n.getAttribute("data-source")||n.getAttribute("data-loc")||n.getAttribute("data-locator")||n.getAttribute("data-source-loc"),a=n.getAttribute("data-inspector-relative-path"),d=n.getAttribute("data-inspector-line");if(l&&!t){const o=l.split(":");if(o.length>=2){let h=o[0],g=parseInt(o[1],10)||1;o[0].length===1&&o.length>=3&&(h=`${o[0]}:${o[1]}`,g=parseInt(o[2],10)||1);const f=((s=h.split("/").pop())==null?void 0:s.replace(/\.[^.]+$/,""))||"Component";t={fileName:M(h),lineNumber:g,componentName:f,framework:h.endsWith(".vue")?"vue":"react"},e.unshift({name:f,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}}else if(a&&d&&!t){const o=((r=a.split("/").pop())==null?void 0:r.replace(/\.[^.]+$/,""))||"Component";t={fileName:M(a),lineNumber:parseInt(d,10)||1,componentName:o,framework:"react"},e.unshift({name:o,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}n=n.parentElement}return{source:t,hierarchy:e}}function T(i){const t=window.getComputedStyle(i);return{display:t.display,position:t.position,width:`${Math.round(parseFloat(t.width)||0)}px`,height:`${Math.round(parseFloat(t.height)||0)}px`,margin:`${t.marginTop} ${t.marginRight} ${t.marginBottom} ${t.marginLeft}`,padding:`${t.paddingTop} ${t.paddingRight} ${t.paddingBottom} ${t.paddingLeft}`,color:t.color,backgroundColor:t.backgroundColor,fontSize:t.fontSize,fontFamily:t.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:t.borderRadius,border:`${t.borderWidth} ${t.borderStyle} ${t.borderColor}`,gap:t.gap!=="normal"?t.gap:void 0,flexDirection:t.display.includes("flex")?t.flexDirection:void 0}}function L(i,t=2){const e=i.cloneNode(!0);function n(s,r){if(r>=t&&s.children.length>0){s.innerHTML=`<!-- ... ${s.children.length} child elements truncated ... -->`;return}for(let l=0;l<s.children.length;l++)n(s.children[l],r+1)}return n(e,0),{innerSnippet:e.innerHTML.slice(0,1e3),outerSnippet:e.outerHTML.slice(0,1500)}}function k(i){const t=S(i);if(t)return t;const e=i.getBoundingClientRect(),n=Array.from(i.classList||[]),s=n.filter(y),r=n.filter(g=>!y(g)),{source:l,hierarchy:a}=N(i);a.length===0&&a.push({name:`<${i.tagName.toLowerCase()}>`,tag:i.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:d,outerSnippet:o}=L(i),h=T(i);return{tagName:i.tagName.toLowerCase(),id:i.id||"",className:i.className||"",classList:n,tailwindClasses:s,customClasses:r,source:l,hierarchy:a,innerHTMLSnippet:d,outerHTMLSnippet:o,innerTextSnippet:(i.innerText||"").slice(0,200).trim(),computedStyles:h,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class A{constructor(){w(this,"container",null);w(this,"shadowRoot",null);w(this,"highlightBox",null);w(this,"badge",null);w(this,"banner",null);w(this,"currentElement",null);w(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,C(),this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=`
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
      `,this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),typeof chrome<"u"&&chrome.storage&&chrome.storage.local&&chrome.storage.local.get(["settings"],e=>{e.settings&&e.settings.showFloatingBanner===!1&&this.banner&&(this.banner.style.display="none")}),(document.documentElement||document.body).appendChild(this.container)}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(t){var n;if(!this.isActive)return;const e=document.elementFromPoint(t.clientX,t.clientY);!e||e===this.container||(n=this.container)!=null&&n.contains(e)||this.updateHighlight(e)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(t){if(this.isActive){if(t.key==="Escape"){t.preventDefault(),t.stopPropagation(),this.deactivate();return}if(t.key==="ArrowUp"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.parentElement;e&&e!==document.body&&e!==document.documentElement&&this.updateHighlight(e);return}if(t.key==="ArrowDown"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.firstElementChild;e&&this.updateHighlight(e);return}}}handleClick(t){if(!this.isActive)return;t.preventDefault(),t.stopPropagation();const e=this.currentElement||document.elementFromPoint(t.clientX,t.clientY);if(!e)return;this.container&&(this.container.style.display="none");const n=[];try{const r=document.querySelectorAll("*");for(let l=0;l<r.length;l++){const a=r[l];if(a.id==="uaiselect-overlay-root"||a.contains(e)||e.contains(a))continue;const d=window.getComputedStyle(a);(d.position==="fixed"||d.position==="sticky")&&(n.push({elem:a,origVisibility:a.style.visibility}),a.style.visibility="hidden")}}catch{}const s=k(e);chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:s}).catch(()=>{}),setTimeout(()=>{n.forEach(r=>{r.elem.style.visibility=r.origVisibility})},150),this.deactivate()}updateHighlight(t){var g,f;if(this.currentElement=t,!this.highlightBox||!this.badge)return;const e=t.getBoundingClientRect();if(e.width===0&&e.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${e.top}px`,this.highlightBox.style.left=`${e.left}px`,this.highlightBox.style.width=`${e.width}px`,this.highlightBox.style.height=`${e.height}px`;const n=S(t),s=n==null?void 0:n.source,r=(n==null?void 0:n.hierarchy)||[],l=(s==null?void 0:s.componentName)||(r.length>0?((g=r.find(E=>E.isCustomComponent))==null?void 0:g.name)||((f=r[0])==null?void 0:f.name):`<${t.tagName.toLowerCase()}>`),a=s?`${s.fileName.split("/").pop()}:${s.lineNumber}`:"",d=`${Math.round(e.width)} × ${Math.round(e.height)}`;this.badge.innerHTML=`
        <span class="uaiselect-badge-comp">${l}</span>
        ${a?`<span class="uaiselect-badge-src">${a}</span>`:""}
        <span class="uaiselect-badge-dim">${d}</span>
      `,this.badge.style.display="flex";let o=e.top-32;o<10&&(o=e.bottom+8);let h=Math.max(10,e.left);h+300>window.innerWidth&&(h=window.innerWidth-310),this.badge.style.top=`${o}px`,this.badge.style.left=`${h}px`}}const x=new A;async function $(){const i=window.scrollX,t=window.scrollY,e=document.documentElement.style.overflow,n=document.body.style.overflow;x.deactivate();const s=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth,window.innerWidth),r=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,window.innerHeight),l=window.innerHeight,a=window.devicePixelRatio||1,d=[];try{const c=document.querySelectorAll("*");for(let p=0;p<c.length;p++){const u=c[p];if(u.id==="uaiselect-overlay-root")continue;const m=window.getComputedStyle(u);(m.position==="fixed"||m.position==="sticky")&&d.push({elem:u,origVisibility:u.style.visibility})}}catch{}const o=[],h=[];for(let c=0;c<r;c+=l-16){const p=Math.min(c,Math.max(0,r-l));if(h.push(p),c+l>=r)break}const g=Array.from(new Set(h));for(let c=0;c<g.length;c++){const p=g[c];window.scrollTo(0,p),c>0?d.forEach(m=>{m.elem.style.visibility="hidden"}):d.forEach(m=>{m.elem.style.visibility=m.origVisibility}),await new Promise(m=>setTimeout(m,100));const u=await new Promise(m=>{chrome.runtime.sendMessage({type:"CAPTURE_SLICE_REQUEST"},I=>{m(I)})});u&&u.dataUrl&&o.push({y:p,dataUrl:u.dataUrl})}if(d.forEach(c=>{c.elem.style.visibility=c.origVisibility}),document.documentElement.style.overflow=e,document.body.style.overflow=n,window.scrollTo(i,t),o.length===0)return"";if(o.length===1&&r<=l+10)return o[0].dataUrl;const f=document.createElement("canvas");f.width=Math.round(s*a),f.height=Math.round(r*a);const E=f.getContext("2d");if(!E)return o[0].dataUrl;for(const c of o)await new Promise(p=>{const u=new Image;u.onload=()=>{E.drawImage(u,0,Math.round(c.y*a)),p()},u.onerror=()=>p(),u.src=c.dataUrl});return f.toDataURL("image/png")}chrome.runtime.onMessage.addListener((i,t,e)=>{if(i.type==="TOGGLE_INSPECTOR"){const n=x.toggle();return e({active:n}),!0}if(i.type==="START_INSPECTION")return x.activate(),e({active:!0}),!0;if(i.type==="STOP_INSPECTION")return x.deactivate(),e({active:!1}),!0;if(i.type==="DO_FULL_PAGE_CAPTURE")return $().then(n=>{e({screenshotUrl:n})}).catch(()=>{e({screenshotUrl:""})}),!0})})();
