var P=Object.defineProperty;var O=(v,b,w)=>b in v?P(v,b,{enumerable:!0,configurable:!0,writable:!0,value:w}):v[b]=w;var y=(v,b,w)=>O(v,typeof b!="symbol"?b+"":b,w);(function(){if(window.__UAISELECT_CONTENT_INITIALIZED__)return;window.__UAISELECT_CONTENT_INITIALIZED__=!0;const b=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function w(i){return!i||typeof i!="string"?!1:b.some(t=>i.startsWith(t)||i===t)}function S(i){if(!i||typeof i!="string")return"";let t=i.replace(/\\/g,"/");return t=t.replace(/^\/@fs\//,"/"),t=t.replace(/\?.*$/,""),t=t.replace(/^webpack:\/\/[^/]*\//,""),t=t.replace(/^file:\/\/\/?/,""),t=t.replace(/^\/([a-zA-Z]:)/,"$1"),t}const M=["docs.google.com","drive.google.com","mail.google.com","calendar.google.com","meet.google.com"];function T(){try{const i=window.location.hostname;return M.some(t=>i===t||i.endsWith(`.${t}`))}catch{return!1}}function C(){if(!T()&&!document.getElementById("uaiselect-main-world-bridge"))try{const i=document.createElement("script");i.id="uaiselect-main-world-bridge",typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL&&(i.src=chrome.runtime.getURL("mainWorld.js"),i.onload=()=>{i.setAttribute("data-loaded","true")},(document.head||document.documentElement).appendChild(i))}catch(i){console.error("[UaiSelect] Bridge injection error:",i)}}C();function N(i){C();try{i.dispatchEvent(new CustomEvent("UAISELECT_INSPECT_DOM_EVENT",{bubbles:!0,cancelable:!0}));const t=i.getAttribute("data-uaiselect-data");if(t)return i.removeAttribute("data-uaiselect-data"),JSON.parse(t)}catch(t){console.error("[UaiSelect] Error querying main world bridge:",t)}return null}function L(i){var a,o;let t;const e=[];let n=i;for(;n&&n!==document.body&&n!==document.documentElement;){const l=n.getAttribute("data-v-inspector")||n.getAttribute("data-source")||n.getAttribute("data-loc")||n.getAttribute("data-locator")||n.getAttribute("data-source-loc"),r=n.getAttribute("data-inspector-relative-path"),h=n.getAttribute("data-inspector-line");if(l&&!t){const s=l.split(":");if(s.length>=2){let p=s[0],m=parseInt(s[1],10)||1;s[0].length===1&&s.length>=3&&(p=`${s[0]}:${s[1]}`,m=parseInt(s[2],10)||1);const f=((a=p.split("/").pop())==null?void 0:a.replace(/\.[^.]+$/,""))||"Component";t={fileName:S(p),lineNumber:m,componentName:f,framework:p.endsWith(".vue")?"vue":"react"},e.unshift({name:f,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}}else if(r&&h&&!t){const s=((o=r.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"Component";t={fileName:S(r),lineNumber:parseInt(h,10)||1,componentName:s,framework:"react"},e.unshift({name:s,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}n=n.parentElement}return{source:t,hierarchy:e}}function k(i){const t=window.getComputedStyle(i);return{display:t.display,position:t.position,width:`${Math.round(parseFloat(t.width)||0)}px`,height:`${Math.round(parseFloat(t.height)||0)}px`,margin:`${t.marginTop} ${t.marginRight} ${t.marginBottom} ${t.marginLeft}`,padding:`${t.paddingTop} ${t.paddingRight} ${t.paddingBottom} ${t.paddingLeft}`,color:t.color,backgroundColor:t.backgroundColor,fontSize:t.fontSize,fontFamily:t.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:t.borderRadius,border:`${t.borderWidth} ${t.borderStyle} ${t.borderColor}`,gap:t.gap!=="normal"?t.gap:void 0,flexDirection:t.display.includes("flex")?t.flexDirection:void 0}}function A(i,t=2){const e=i.cloneNode(!0);function n(a,o){if(o>=t&&a.children.length>0){a.textContent=`<!-- ... ${a.children.length} child elements truncated ... -->`;return}for(let l=0;l<a.children.length;l++)n(a.children[l],o+1)}return n(e,0),{innerSnippet:e.innerHTML.slice(0,1e3),outerSnippet:e.outerHTML.slice(0,1500)}}function I(i){const t=N(i);if(t)return t;const e=i.getBoundingClientRect(),n=Array.from(i.classList||[]),a=n.filter(w),o=n.filter(m=>!w(m)),{source:l,hierarchy:r}=L(i);r.length===0&&r.push({name:`<${i.tagName.toLowerCase()}>`,tag:i.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:h,outerSnippet:s}=A(i),p=k(i);return{tagName:i.tagName.toLowerCase(),id:i.id||"",className:i.className||"",classList:n,tailwindClasses:a,customClasses:o,source:l,hierarchy:r,innerHTMLSnippet:h,outerHTMLSnippet:s,innerTextSnippet:(i.innerText||"").slice(0,200).trim(),computedStyles:p,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class ${constructor(){y(this,"container",null);y(this,"shadowRoot",null);y(this,"highlightBox",null);y(this,"badge",null);y(this,"banner",null);y(this,"currentElement",null);y(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,C(),this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=`
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
      `,this.highlightBox=document.createElement("div"),this.highlightBox.className="uaiselect-highlight",this.badge=document.createElement("div"),this.badge.className="uaiselect-badge",this.banner=document.createElement("div"),this.banner.className="uaiselect-banner";const e=document.createElement("div");e.className="uaiselect-dot";const n=document.createElement("span"),a=document.createElement("strong");a.textContent="UaiSelect",n.appendChild(a),n.appendChild(document.createTextNode(" Inspector activo"));const o=document.createElement("span");o.className="uaiselect-kbd",o.textContent="ESC para salir";const l=document.createElement("span");l.className="uaiselect-kbd",l.textContent="↑ / ↓ navegar",this.banner.replaceChildren(e,n,o,l),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),typeof chrome<"u"&&chrome.storage&&chrome.storage.local&&chrome.storage.local.get(["settings"],r=>{var h;r.settings&&r.settings.showFloatingBanner===!1&&this.banner&&(this.banner.style.display="none"),this.applyAccentColor((h=r.settings)==null?void 0:h.highlightColor)}),(document.documentElement||document.body).appendChild(this.container)}applyAccentColor(t){this.container&&this.container.style.setProperty("--uaiselect-accent",t||"#ffffff")}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(t){var n;if(!this.isActive)return;const e=document.elementFromPoint(t.clientX,t.clientY);!e||e===this.container||(n=this.container)!=null&&n.contains(e)||this.updateHighlight(e)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(t){if(this.isActive){if(t.key==="Escape"){t.preventDefault(),t.stopPropagation(),this.deactivate();return}if(t.key==="ArrowUp"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.parentElement;e&&e!==document.body&&e!==document.documentElement&&this.updateHighlight(e);return}if(t.key==="ArrowDown"&&this.currentElement){t.preventDefault(),t.stopPropagation();const e=this.currentElement.firstElementChild;e&&this.updateHighlight(e);return}}}handleClick(t){if(!this.isActive)return;t.preventDefault(),t.stopPropagation();const e=this.currentElement||document.elementFromPoint(t.clientX,t.clientY);if(!e)return;this.container&&(this.container.style.display="none");const n=[];try{const o=document.querySelectorAll("*");for(let l=0;l<o.length;l++){const r=o[l];if(r.id==="uaiselect-overlay-root"||r.contains(e)||e.contains(r))continue;const h=window.getComputedStyle(r);(h.position==="fixed"||h.position==="sticky")&&(n.push({elem:r,origVisibility:r.style.visibility}),r.style.visibility="hidden")}}catch{}const a=I(e);chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:a}).catch(()=>{}),setTimeout(()=>{n.forEach(o=>{o.elem.style.visibility=o.origVisibility})},150),this.deactivate()}updateHighlight(t){var c,u;if(this.currentElement=t,!this.highlightBox||!this.badge)return;const e=t.getBoundingClientRect();if(e.width===0&&e.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${e.top}px`,this.highlightBox.style.left=`${e.left}px`,this.highlightBox.style.width=`${e.width}px`,this.highlightBox.style.height=`${e.height}px`;const n=N(t),a=n==null?void 0:n.source,o=(n==null?void 0:n.hierarchy)||[],l=(a==null?void 0:a.componentName)||(o.length>0?((c=o.find(d=>d.isCustomComponent))==null?void 0:c.name)||((u=o[0])==null?void 0:u.name):`<${t.tagName.toLowerCase()}>`),r=a?`${a.fileName.split("/").pop()}:${a.lineNumber}`:"",h=`${Math.round(e.width)} × ${Math.round(e.height)}`,s=document.createElement("span");s.className="uaiselect-badge-comp",s.textContent=l;const p=[s];if(r){const d=document.createElement("span");d.className="uaiselect-badge-src",d.textContent=r,p.push(d)}const m=document.createElement("span");m.className="uaiselect-badge-dim",m.textContent=h,p.push(m),this.badge.replaceChildren(...p),this.badge.style.display="flex";let f=e.top-32;f<10&&(f=e.bottom+8);let x=Math.max(10,e.left);x+300>window.innerWidth&&(x=window.innerWidth-310),this.badge.style.top=`${f}px`,this.badge.style.left=`${x}px`}}const E=new $;async function D(){const i=window.scrollX,t=window.scrollY,e=document.documentElement.style.overflow,n=document.body.style.overflow;E.deactivate();const a=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth,window.innerWidth),o=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,window.innerHeight),l=window.innerHeight,r=window.devicePixelRatio||1,h=[];try{const c=document.querySelectorAll("*");for(let u=0;u<c.length;u++){const d=c[u];if(d.id==="uaiselect-overlay-root")continue;const g=window.getComputedStyle(d);(g.position==="fixed"||g.position==="sticky")&&h.push({elem:d,origVisibility:d.style.visibility})}}catch{}const s=[],p=[];for(let c=0;c<o;c+=l-16){const u=Math.min(c,Math.max(0,o-l));if(p.push(u),c+l>=o)break}const m=Array.from(new Set(p));for(let c=0;c<m.length;c++){const u=m[c];window.scrollTo(0,u),c>0?h.forEach(g=>{g.elem.style.visibility="hidden"}):h.forEach(g=>{g.elem.style.visibility=g.origVisibility}),await new Promise(g=>setTimeout(g,100));const d=await new Promise(g=>{chrome.runtime.sendMessage({type:"CAPTURE_SLICE_REQUEST"},_=>{g(_)})});d&&d.dataUrl&&s.push({y:u,dataUrl:d.dataUrl})}if(h.forEach(c=>{c.elem.style.visibility=c.origVisibility}),document.documentElement.style.overflow=e,document.body.style.overflow=n,window.scrollTo(i,t),s.length===0)return"";if(s.length===1&&o<=l+10)return s[0].dataUrl;const f=document.createElement("canvas");f.width=Math.round(a*r),f.height=Math.round(o*r);const x=f.getContext("2d");if(!x)return s[0].dataUrl;for(const c of s)await new Promise(u=>{const d=new Image;d.onload=()=>{x.drawImage(d,0,Math.round(c.y*r)),u()},d.onerror=()=>u(),d.src=c.dataUrl});return f.toDataURL("image/png")}chrome.runtime.onMessage.addListener((i,t,e)=>{if(i.type==="TOGGLE_INSPECTOR"){const n=E.toggle();return e({active:n}),!0}if(i.type==="START_INSPECTION")return E.activate(),e({active:!0}),!0;if(i.type==="STOP_INSPECTION")return E.deactivate(),e({active:!1}),!0;if(i.type==="DO_FULL_PAGE_CAPTURE")return D().then(n=>{e({screenshotUrl:n})}).catch(()=>{e({screenshotUrl:""})}),!0})})();
