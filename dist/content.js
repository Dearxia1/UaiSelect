var U=Object.defineProperty;var H=(x,y,v)=>y in x?U(x,y,{enumerable:!0,configurable:!0,writable:!0,value:v}):x[y]=v;var w=(x,y,v)=>H(x,typeof y!="symbol"?y+"":y,v);(function(){if(window.__UAISELECT_CONTENT_INITIALIZED__)return;window.__UAISELECT_CONTENT_INITIALIZED__=!0;const y=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function v(i){return!i||typeof i!="string"?!1:y.some(t=>i.startsWith(t)||i===t)}function N(i){if(!i||typeof i!="string")return"";let t=i.replace(/\\/g,"/");return t=t.replace(/^\/@fs\//,"/"),t=t.replace(/\?.*$/,""),t=t.replace(/^webpack:\/\/[^/]*\//,""),t=t.replace(/^file:\/\/\/?/,""),t=t.replace(/^\/([a-zA-Z]:)/,"$1"),t}const T=["docs.google.com","drive.google.com","mail.google.com","calendar.google.com","meet.google.com"];function L(){try{const i=window.location.hostname;return T.some(t=>i===t||i.endsWith(`.${t}`))}catch{return!1}}function A(){if(!L()&&!document.getElementById("uaiselect-main-world-bridge"))try{const i=document.createElement("script");i.id="uaiselect-main-world-bridge",typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL&&(i.src=chrome.runtime.getURL("mainWorld.js"),i.onload=()=>{i.setAttribute("data-loaded","true")},(document.head||document.documentElement).appendChild(i))}catch(i){console.error("[UaiSelect] Bridge injection error:",i)}}A();function S(i){A();try{i.dispatchEvent(new CustomEvent("UAISELECT_INSPECT_DOM_EVENT",{bubbles:!0,cancelable:!0}));const t=i.getAttribute("data-uaiselect-data");if(t)return i.removeAttribute("data-uaiselect-data"),JSON.parse(t)}catch(t){console.error("[UaiSelect] Error querying main world bridge:",t)}return null}function k(i){var o,a;let t;const e=[];let n=i;for(;n&&n!==document.body&&n!==document.documentElement;){const s=n.getAttribute("data-v-inspector")||n.getAttribute("data-source")||n.getAttribute("data-loc")||n.getAttribute("data-locator")||n.getAttribute("data-source-loc"),r=n.getAttribute("data-inspector-relative-path"),l=n.getAttribute("data-inspector-line");if(s&&!t){const c=s.split(":");if(c.length>=2){let m=c[0],f=parseInt(c[1],10)||1;c[0].length===1&&c.length>=3&&(m=`${c[0]}:${c[1]}`,f=parseInt(c[2],10)||1);const p=((o=m.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"Component";t={fileName:N(m),lineNumber:f,componentName:p,framework:m.endsWith(".vue")?"vue":"react"},e.unshift({name:p,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}}else if(r&&l&&!t){const c=((a=r.split("/").pop())==null?void 0:a.replace(/\.[^.]+$/,""))||"Component";t={fileName:N(r),lineNumber:parseInt(l,10)||1,componentName:c,framework:"react"},e.unshift({name:c,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}n=n.parentElement}return{source:t,hierarchy:e}}function I(i){const t=window.getComputedStyle(i);return{display:t.display,position:t.position,width:`${Math.round(parseFloat(t.width)||0)}px`,height:`${Math.round(parseFloat(t.height)||0)}px`,margin:`${t.marginTop} ${t.marginRight} ${t.marginBottom} ${t.marginLeft}`,padding:`${t.paddingTop} ${t.paddingRight} ${t.paddingBottom} ${t.paddingLeft}`,color:t.color,backgroundColor:t.backgroundColor,fontSize:t.fontSize,fontFamily:t.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:t.borderRadius,border:`${t.borderWidth} ${t.borderStyle} ${t.borderColor}`,gap:t.gap!=="normal"?t.gap:void 0,flexDirection:t.display.includes("flex")?t.flexDirection:void 0}}function $(i){const t=i.parentElement;if(!(!t||t===document.body||t===document.documentElement))try{const e=window.getComputedStyle(t),n=e.display.includes("flex"),o=e.display.includes("grid");return{tagName:t.tagName.toLowerCase(),id:t.id||void 0,classes:Array.from(t.classList||[]).slice(0,12),display:e.display,position:e.position!=="static"?e.position:void 0,flexDirection:n?e.flexDirection:void 0,justifyContent:(n||o)&&e.justifyContent!=="normal"?e.justifyContent:void 0,alignItems:(n||o)&&e.alignItems!=="normal"?e.alignItems:void 0,gap:e.gap!=="normal"&&e.gap!=="0px"?e.gap:void 0}}catch{return}}function D(i){const t=i.getAttribute("data-testid")||i.getAttribute("data-test")||i.getAttribute("data-cy")||i.getAttribute("data-qa")||void 0,e=i.getAttribute("aria-label")||i.getAttribute("title")||i.getAttribute("alt")||void 0,n=i.getAttribute("role")||void 0,o=i.getAttribute("name")||void 0,a=i.getAttribute("placeholder")||void 0,s=i.getAttribute("href")||void 0,r=(i.innerText||i.textContent||"").replace(/\s+/g," ").trim(),l=r.length>0?r.slice(0,80):void 0;return{testId:t,ariaLabel:e,role:n,name:o,placeholder:a,href:s,textAnchor:l}}function _(i,t=2){const e=i.cloneNode(!0);function n(o,a){if(!o||!o.tagName)return;const s=o.tagName.toLowerCase();o.removeAttribute("data-uaiselect-data"),o.removeAttribute("data-uaiselect-result"),o.removeAttribute("data-uaiselect-id");const r=o.getAttribute("src");if(r&&r.startsWith("data:")&&r.length>64&&o.setAttribute("src",`${r.slice(0,32)}...[base64]`),s==="svg"){o.children.length>0&&(o.innerHTML="<!-- svg icon -->");return}if(a>=t&&o.children.length>0){o.textContent=`<!-- ... ${o.children.length} child elements truncated ... -->`;return}for(let l=0;l<o.children.length;l++)n(o.children[l],a+1)}return n(e,0),{innerSnippet:e.innerHTML.slice(0,1e3),outerSnippet:e.outerHTML.slice(0,1500)}}function M(i){const t=S(i);if(t)return t;const e=i.getBoundingClientRect(),n=Array.from(i.classList||[]),o=n.filter(v),a=n.filter(b=>!v(b)),{source:s,hierarchy:r}=k(i);r.length===0&&r.push({name:`<${i.tagName.toLowerCase()}>`,tag:i.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:l,outerSnippet:c}=_(i),m=I(i),f=$(i),p=D(i);return{tagName:i.tagName.toLowerCase(),id:i.id||"",className:typeof i.className=="string"?i.className:"",classList:n,tailwindClasses:o,customClasses:a,source:s,hierarchy:r,innerHTMLSnippet:l,outerHTMLSnippet:c,innerTextSnippet:(i.innerText||"").slice(0,200).trim(),computedStyles:m,parentContext:f,anchors:p,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}let E=null;function P(i){try{const t=i.getBoundingClientRect();if(t.width===0&&t.height===0)return;const e=document.createElement("div");e.style.position="fixed",e.style.top=`${t.top}px`,e.style.left=`${t.left}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`,e.style.border="2px solid #22d3ee",e.style.background="rgba(34, 211, 238, 0.12)",e.style.borderRadius="4px",e.style.pointerEvents="none",e.style.zIndex="2147483647",e.style.transition="opacity 0.35s ease-out",document.documentElement.appendChild(e),setTimeout(()=>{e.style.opacity="0",setTimeout(()=>e.remove(),350)},250)}catch{}}class O{constructor(){w(this,"container",null);w(this,"shadowRoot",null);w(this,"highlightBox",null);w(this,"badge",null);w(this,"banner",null);w(this,"currentElement",null);w(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,A(),this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .uaiselect-highlight {
          position: fixed;
          border: 1.5px solid var(--uaiselect-accent, #ffffff);
          background: color-mix(in srgb, var(--uaiselect-accent, #ffffff) 8%, transparent);
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
          color: var(--uaiselect-accent, #ffffff);
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
          background: var(--uaiselect-accent, #ffffff);
          box-shadow: 0 0 8px var(--uaiselect-accent, #ffffff);
        }
        @keyframes uaiselect-fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes uaiselect-flash {
          0% { background: color-mix(in srgb, var(--uaiselect-accent, #ffffff) 30%, transparent); transform: scale(1); }
          50% { background: color-mix(in srgb, var(--uaiselect-accent, #ffffff) 60%, transparent); transform: scale(1.01); }
          100% { background: color-mix(in srgb, var(--uaiselect-accent, #ffffff) 8%, transparent); transform: scale(1); }
        }
        .uaiselect-flash-anim {
          animation: uaiselect-flash 0.25s ease-out;
        }
      `,this.highlightBox=document.createElement("div"),this.highlightBox.className="uaiselect-highlight",this.badge=document.createElement("div"),this.badge.className="uaiselect-badge",this.banner=document.createElement("div"),this.banner.className="uaiselect-banner";const e=document.createElement("div");e.className="uaiselect-dot";const n=document.createElement("span"),o=document.createElement("strong");o.textContent="UaiSelect",n.appendChild(o),n.appendChild(document.createTextNode(" Inspector activo"));const a=document.createElement("span");a.className="uaiselect-kbd",a.textContent="ESC para salir";const s=document.createElement("span");s.className="uaiselect-kbd",s.textContent="↑ / ↓ navegar",this.banner.replaceChildren(e,n,a,s),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),typeof chrome<"u"&&chrome.storage&&chrome.storage.local&&chrome.storage.local.get(["settings"],r=>{var l;r.settings&&r.settings.showFloatingBanner===!1&&this.banner&&(this.banner.style.display="none"),this.applyAccentColor((l=r.settings)==null?void 0:l.highlightColor)}),(document.documentElement||document.body).appendChild(this.container)}applyAccentColor(t){this.container&&this.container.style.setProperty("--uaiselect-accent",t||"#ffffff")}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(t){var n;if(!this.isActive)return;const e=document.elementFromPoint(t.clientX,t.clientY);!e||e===this.container||(n=this.container)!=null&&n.contains(e)||this.updateHighlight(e)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(t){if(this.isActive){if(t.key==="Escape"){t.preventDefault(),t.stopPropagation(),this.deactivate();return}if(t.key==="ArrowUp"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.parentElement;e&&e!==document.body&&e!==document.documentElement&&this.updateHighlight(e);return}if(t.key==="ArrowDown"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.firstElementChild;e&&this.updateHighlight(e);return}}}handleClick(t){if(!this.isActive)return;t.preventDefault(),t.stopPropagation();const e=this.currentElement||document.elementFromPoint(t.clientX,t.clientY);if(!e)return;E=e,this.container&&(this.container.style.display="none");const n=[];try{const a=document.querySelectorAll("*");for(let s=0;s<a.length;s++){const r=a[s];if(r.id==="uaiselect-overlay-root"||r.contains(e)||e.contains(r))continue;const l=window.getComputedStyle(r);(l.position==="fixed"||l.position==="sticky")&&(n.push({elem:r,origVisibility:r.style.visibility}),r.style.visibility="hidden")}}catch{}const o=M(e);chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:o}).catch(()=>{}),setTimeout(()=>{n.forEach(a=>{a.elem.style.visibility=a.origVisibility})},150),this.deactivate()}updateHighlight(t){if(this.currentElement=t,!this.highlightBox||!this.badge)return;const e=t.getBoundingClientRect();if(e.width===0&&e.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${e.top}px`,this.highlightBox.style.left=`${e.left}px`,this.highlightBox.style.width=`${e.width}px`,this.highlightBox.style.height=`${e.height}px`;const n=S(t),o=n==null?void 0:n.source,a=(n==null?void 0:n.hierarchy)||[],s=a.filter(h=>h.isCustomComponent&&!h.isWrapper),r=s[s.length-1]||a[a.length-1],l=(r==null?void 0:r.name)||(o==null?void 0:o.componentName)||`<${t.tagName.toLowerCase()}>`,c=o?`${o.fileName.split("/").pop()}:${o.lineNumber}`:"",m=`${Math.round(e.width)} × ${Math.round(e.height)}`,f=document.createElement("span");f.className="uaiselect-badge-comp",f.textContent=l;const p=[f];if(c){const h=document.createElement("span");h.className="uaiselect-badge-src",h.textContent=c,p.push(h)}const b=document.createElement("span");b.className="uaiselect-badge-dim",b.textContent=m,p.push(b),this.badge.replaceChildren(...p),this.badge.style.display="flex";let d=e.top-32;d<10&&(d=e.bottom+8);let u=Math.max(10,e.left);u+300>window.innerWidth&&(u=window.innerWidth-310),this.badge.style.top=`${d}px`,this.badge.style.left=`${u}px`}}const C=new O;async function B(){const i=window.scrollX,t=window.scrollY,e=document.documentElement.style.overflow,n=document.body.style.overflow;C.deactivate();const o=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth,window.innerWidth),a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,window.innerHeight),s=window.innerHeight,r=window.devicePixelRatio||1,l=[];try{const d=document.querySelectorAll("*");for(let u=0;u<d.length;u++){const h=d[u];if(h.id==="uaiselect-overlay-root")continue;const g=window.getComputedStyle(h);(g.position==="fixed"||g.position==="sticky")&&l.push({elem:h,origVisibility:h.style.visibility})}}catch{}const c=[],m=[];for(let d=0;d<a;d+=s-16){const u=Math.min(d,Math.max(0,a-s));if(m.push(u),d+s>=a)break}const f=Array.from(new Set(m));for(let d=0;d<f.length;d++){const u=f[d];window.scrollTo(0,u),d>0?l.forEach(g=>{g.elem.style.visibility="hidden"}):l.forEach(g=>{g.elem.style.visibility=g.origVisibility}),await new Promise(g=>setTimeout(g,100));const h=await new Promise(g=>{chrome.runtime.sendMessage({type:"CAPTURE_SLICE_REQUEST"},R=>{g(R)})});h&&h.dataUrl&&c.push({y:u,dataUrl:h.dataUrl})}if(l.forEach(d=>{d.elem.style.visibility=d.origVisibility}),document.documentElement.style.overflow=e,document.body.style.overflow=n,window.scrollTo(i,t),c.length===0)return"";if(c.length===1&&a<=s+10)return c[0].dataUrl;const p=document.createElement("canvas");p.width=Math.round(o*r),p.height=Math.round(a*r);const b=p.getContext("2d");if(!b)return c[0].dataUrl;for(const d of c)await new Promise(u=>{const h=new Image;h.onload=()=>{b.drawImage(h,0,Math.round(d.y*r)),u()},h.onerror=()=>u(),h.src=d.dataUrl});return p.toDataURL("image/png")}chrome.runtime.onMessage.addListener((i,t,e)=>{if(i.type==="TOGGLE_INSPECTOR"){const n=C.toggle();return e({active:n}),!0}if(i.type==="START_INSPECTION")return C.activate(),e({active:!0}),!0;if(i.type==="STOP_INSPECTION")return C.deactivate(),e({active:!1}),!0;if(i.type==="SELECT_RELATIVE_ELEMENT"){if(!E||!document.contains(E))return e({ok:!1}),!0;let n=null;if(i.direction==="parent"){const o=E.parentElement;o&&o!==document.body&&o!==document.documentElement&&(n=o)}else i.direction==="child"&&(n=E.firstElementChild);if(n){E=n;const o=M(n);chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:o}).catch(()=>{}),setTimeout(()=>P(n),120),e({ok:!0})}else e({ok:!1});return!0}if(i.type==="DO_FULL_PAGE_CAPTURE")return B().then(n=>{e({screenshotUrl:n})}).catch(()=>{e({screenshotUrl:""})}),!0})})();
