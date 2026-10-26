var K=Object.defineProperty;var j=(E,b,w)=>b in E?K(E,b,{enumerable:!0,configurable:!0,writable:!0,value:w}):E[b]=w;var v=(E,b,w)=>j(E,typeof b!="symbol"?b+"":b,w);(function(){if(window.__UAISELECT_CONTENT_INITIALIZED__)return;window.__UAISELECT_CONTENT_INITIALIZED__=!0;const b=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function w(e){return!e||typeof e!="string"?!1:b.some(t=>e.startsWith(t)||e===t)}function T(e){if(!e||typeof e!="string")return"";let t=e.replace(/\\/g,"/");return t=t.replace(/^\/@fs\//,"/"),t=t.replace(/\?.*$/,""),t=t.replace(/^webpack:\/\/[^/]*\//,""),t=t.replace(/^file:\/\/\/?/,""),t=t.replace(/^\/([a-zA-Z]:)/,"$1"),t}const D=["docs.google.com","drive.google.com","mail.google.com","calendar.google.com","meet.google.com"];function P(){try{const e=window.location.hostname;return D.some(t=>e===t||e.endsWith(`.${t}`))}catch{return!1}}function A(){if(!P()&&!document.getElementById("uaiselect-main-world-bridge-v103"))try{const e=document.getElementById("uaiselect-main-world-bridge");e&&e.remove();const t=document.createElement("script");t.id="uaiselect-main-world-bridge-v103",typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL&&(t.src=chrome.runtime.getURL("mainWorld.js"),t.onload=()=>{t.setAttribute("data-loaded","true")},(document.head||document.documentElement).appendChild(t))}catch(e){console.error("[UaiSelect] Bridge injection error:",e)}}A();function L(e){A();try{e.dispatchEvent(new CustomEvent("UAISELECT_INSPECT_DOM_EVENT",{bubbles:!0,cancelable:!0}));const t=e.getAttribute("data-uaiselect-data");if(t)return e.removeAttribute("data-uaiselect-data"),JSON.parse(t)}catch(t){console.error("[UaiSelect] Error querying main world bridge:",t)}return null}function B(e){var o,s;let t;const i=[];let n=e;for(;n&&n!==document.body&&n!==document.documentElement;){const r=n.getAttribute("data-v-inspector")||n.getAttribute("data-source")||n.getAttribute("data-loc")||n.getAttribute("data-locator")||n.getAttribute("data-source-loc"),a=n.getAttribute("data-inspector-relative-path"),l=n.getAttribute("data-inspector-line");if(r&&!t){const c=r.split(":");if(c.length>=2){let f=c[0],g=parseInt(c[1],10)||1;c[0].length===1&&c.length>=3&&(f=`${c[0]}:${c[1]}`,g=parseInt(c[2],10)||1);const p=((o=f.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"Component";t={fileName:T(f),lineNumber:g,componentName:p,framework:f.endsWith(".vue")?"vue":"react"},i.unshift({name:p,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}}else if(a&&l&&!t){const c=((s=a.split("/").pop())==null?void 0:s.replace(/\.[^.]+$/,""))||"Component";t={fileName:T(a),lineNumber:parseInt(l,10)||1,componentName:c,framework:"react"},i.unshift({name:c,tag:n.tagName.toLowerCase(),source:t,isCustomComponent:!0})}n=n.parentElement}return{source:t,hierarchy:i}}function k(e){const t=window.getComputedStyle(e);return{display:t.display,position:t.position,width:`${Math.round(parseFloat(t.width)||0)}px`,height:`${Math.round(parseFloat(t.height)||0)}px`,margin:`${t.marginTop} ${t.marginRight} ${t.marginBottom} ${t.marginLeft}`,padding:`${t.paddingTop} ${t.paddingRight} ${t.paddingBottom} ${t.paddingLeft}`,color:t.color,backgroundColor:t.backgroundColor,fontSize:t.fontSize,fontFamily:t.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:t.borderRadius,border:`${t.borderWidth} ${t.borderStyle} ${t.borderColor}`,gap:t.gap!=="normal"?t.gap:void 0,flexDirection:t.display.includes("flex")?t.flexDirection:void 0}}function U(e){const t=e.parentElement;if(!(!t||t===document.body||t===document.documentElement))try{const i=window.getComputedStyle(t),n=i.display.includes("flex"),o=i.display.includes("grid");return{tagName:t.tagName.toLowerCase(),id:t.id||void 0,classes:Array.from(t.classList||[]).slice(0,12),display:i.display,position:i.position!=="static"?i.position:void 0,flexDirection:n?i.flexDirection:void 0,justifyContent:(n||o)&&i.justifyContent!=="normal"?i.justifyContent:void 0,alignItems:(n||o)&&i.alignItems!=="normal"?i.alignItems:void 0,gap:i.gap!=="normal"&&i.gap!=="0px"?i.gap:void 0}}catch{return}}function H(e){const t=e.getAttribute("data-testid")||e.getAttribute("data-test")||e.getAttribute("data-cy")||e.getAttribute("data-qa")||void 0,i=e.getAttribute("aria-label")||e.getAttribute("title")||e.getAttribute("alt")||void 0,n=e.getAttribute("role")||void 0,o=e.getAttribute("name")||void 0,s=e.getAttribute("placeholder")||void 0,r=e.getAttribute("href")||void 0,a=(e.innerText||e.textContent||"").replace(/\s+/g," ").trim(),l=a.length>0?a.slice(0,80):void 0;return{testId:t,ariaLabel:i,role:n,name:o,placeholder:s,href:r,textAnchor:l}}function O(e,t=2){const i=e.cloneNode(!0);function n(o,s){if(!o||!o.tagName)return;const r=o.tagName.toLowerCase();o.removeAttribute("data-uaiselect-data"),o.removeAttribute("data-uaiselect-result"),o.removeAttribute("data-uaiselect-id");const a=o.getAttribute("src");if(a&&a.startsWith("data:")&&a.length>64&&o.setAttribute("src",`${a.slice(0,32)}...[base64]`),r==="svg"){o.children.length>0&&(o.innerHTML="<!-- svg icon -->");return}if(s>=t&&o.children.length>0){o.textContent=`<!-- ... ${o.children.length} child elements truncated ... -->`;return}for(let l=0;l<o.children.length;l++)n(o.children[l],s+1)}return n(i,0),{innerSnippet:i.innerHTML.slice(0,1e3),outerSnippet:i.outerHTML.slice(0,1500)}}function I(e){const t=L(e);if(t)return t;const i=e.getBoundingClientRect(),n=Array.from(e.classList||[]),o=n.filter(w),s=n.filter(x=>!w(x)),{source:r,hierarchy:a}=B(e);a.length===0&&a.push({name:`<${e.tagName.toLowerCase()}>`,tag:e.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:l,outerSnippet:c}=O(e),f=k(e),g=U(e),p=H(e);return{tagName:e.tagName.toLowerCase(),id:e.id||"",className:typeof e.className=="string"?e.className:"",classList:n,tailwindClasses:o,customClasses:s,source:r,hierarchy:a,innerHTMLSnippet:l,outerHTMLSnippet:c,innerTextSnippet:(e.innerText||"").slice(0,200).trim(),computedStyles:f,parentContext:g,anchors:p,rect:{x:Math.round(i.x),y:Math.round(i.y),width:Math.round(i.width),height:Math.round(i.height),top:Math.round(i.top),left:Math.round(i.left),bottom:Math.round(i.bottom),right:Math.round(i.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}let m=null,S=[];const C=new Set,N=new Set;function $(e){m=e,S=Array.from(e.classList||[]),C.clear(),N.clear()}function R(e){try{const t=document.createElement("div");t.textContent=e,t.style.position="fixed",t.style.bottom="28px",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.background="#09090b",t.style.color="#f4f4f5",t.style.padding="8px 16px",t.style.borderRadius="9999px",t.style.fontSize="12px",t.style.fontWeight="600",t.style.fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',t.style.boxShadow="0 10px 30px rgba(0, 0, 0, 0.85), 0 0 0 1px #27272a",t.style.zIndex="2147483647",t.style.pointerEvents="none",t.style.transition="opacity 0.25s ease, transform 0.25s ease",document.documentElement.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transform="translate(-50%, 8px)",setTimeout(()=>t.remove(),250)},1800)}catch{}}function W(e){var s,r,a;const t=(e.hierarchy||[]).filter(l=>!l.isWrapper&&l.name.length>2),i=((s=t[t.length-1])==null?void 0:s.name)||((r=e.source)==null?void 0:r.componentName)||`<${e.tagName}>`,n=e.source?`- Archivo: \`${e.source.fileName}:${e.source.lineNumber}\`
`:"",o=(a=e.anchors)!=null&&a.uniqueSelector?`- Selector DOM: \`${e.anchors.uniqueSelector}\`
`:"";return`### Contexto UI (${i})
${n}- Elemento: \`<${e.tagName}>\` (${e.rect.width}×${e.rect.height}px)
${o}- Clases: \`${e.classList.join(" ")||"ninguna"}\`

\`\`\`html
${e.outerHTMLSnippet}
\`\`\``}function _(e){try{const t=e.getBoundingClientRect();if(t.width===0&&t.height===0)return;const i=document.createElement("div");i.style.position="fixed",i.style.top=`${t.top}px`,i.style.left=`${t.left}px`,i.style.width=`${t.width}px`,i.style.height=`${t.height}px`,i.style.border="2px solid #22d3ee",i.style.background="rgba(34, 211, 238, 0.12)",i.style.borderRadius="4px",i.style.pointerEvents="none",i.style.zIndex="2147483647",i.style.transition="opacity 0.35s ease-out",document.documentElement.appendChild(i),setTimeout(()=>{i.style.opacity="0",setTimeout(()=>i.remove(),350)},250)}catch{}}class z{constructor(){v(this,"container",null);v(this,"shadowRoot",null);v(this,"highlightBox",null);v(this,"badge",null);v(this,"banner",null);v(this,"currentElement",null);v(this,"isActive",!1);this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,A(),this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=`
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
      `,this.highlightBox=document.createElement("div"),this.highlightBox.className="uaiselect-highlight",this.badge=document.createElement("div"),this.badge.className="uaiselect-badge",this.banner=document.createElement("div"),this.banner.className="uaiselect-banner";const i=document.createElement("div");i.className="uaiselect-dot";const n=document.createElement("span"),o=document.createElement("strong");o.textContent="UaiSelect",n.appendChild(o),n.appendChild(document.createTextNode(" Inspector activo"));const s=document.createElement("span");s.className="uaiselect-kbd",s.textContent="ESC para salir";const r=document.createElement("span");r.className="uaiselect-kbd",r.textContent="↑ / ↓ navegar";const a=document.createElement("span");a.className="uaiselect-kbd",a.textContent="Shift+Click copiar",this.banner.replaceChildren(i,n,s,r,a),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),typeof chrome<"u"&&chrome.storage&&chrome.storage.local&&chrome.storage.local.get(["settings"],l=>{var c;l.settings&&l.settings.showFloatingBanner===!1&&this.banner&&(this.banner.style.display="none"),this.applyAccentColor((c=l.settings)==null?void 0:c.highlightColor)}),(document.documentElement||document.body).appendChild(this.container)}applyAccentColor(t){this.container&&this.container.style.setProperty("--uaiselect-accent",t||"#ffffff")}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(t){var n;if(!this.isActive)return;const i=document.elementFromPoint(t.clientX,t.clientY);!i||i===this.container||(n=this.container)!=null&&n.contains(i)||this.updateHighlight(i)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(t){if(this.isActive){if(t.key==="Escape"){t.preventDefault(),t.stopPropagation(),this.deactivate();return}if(t.key==="ArrowUp"&&this.currentElement){t.preventDefault(),t.stopPropagation();const i=this.currentElement.parentElement;i&&i!==document.body&&i!==document.documentElement&&this.updateHighlight(i);return}if(t.key==="ArrowDown"&&this.currentElement){t.preventDefault(),t.stopPropagation();const i=this.currentElement.firstElementChild;i&&this.updateHighlight(i);return}}}handleClick(t){if(!this.isActive)return;t.preventDefault(),t.stopPropagation();const i=this.currentElement||document.elementFromPoint(t.clientX,t.clientY);if(!i)return;$(i);const n=t.shiftKey;this.container&&(this.container.style.display="none");const o=[];try{const r=document.querySelectorAll("*");for(let a=0;a<r.length;a++){const l=r[a];if(l.id==="uaiselect-overlay-root"||l.contains(i)||i.contains(l))continue;const c=window.getComputedStyle(l);(c.position==="fixed"||c.position==="sticky")&&(o.push({elem:l,origVisibility:l.style.visibility}),l.style.visibility="hidden")}}catch{}const s=I(i);if(n){const r=W(s);navigator.clipboard.writeText(r).then(()=>{R("✓ Contexto UI copiado al portapapeles")}).catch(()=>{})}chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:s}).catch(()=>{}),setTimeout(()=>{o.forEach(r=>{r.elem.style.visibility=r.origVisibility})},150),this.deactivate()}updateHighlight(t){if(this.currentElement=t,!this.highlightBox||!this.badge)return;const i=t.getBoundingClientRect();if(i.width===0&&i.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${i.top}px`,this.highlightBox.style.left=`${i.left}px`,this.highlightBox.style.width=`${i.width}px`,this.highlightBox.style.height=`${i.height}px`;const n=L(t),o=n==null?void 0:n.source,s=(n==null?void 0:n.hierarchy)||[],r=s.filter(u=>u.isCustomComponent&&!u.isWrapper),a=r[r.length-1]||s[s.length-1],l=(a==null?void 0:a.name)||(o==null?void 0:o.componentName)||`<${t.tagName.toLowerCase()}>`,c=o?`${o.fileName.split("/").pop()}:${o.lineNumber}`:"",f=`${Math.round(i.width)} × ${Math.round(i.height)}`,g=document.createElement("span");g.className="uaiselect-badge-comp",g.textContent=l;const p=[g];if(c){const u=document.createElement("span");u.className="uaiselect-badge-src",u.textContent=c,p.push(u)}const x=document.createElement("span");x.className="uaiselect-badge-dim",x.textContent=f,p.push(x),this.badge.replaceChildren(...p),this.badge.style.display="flex";let d=i.top-32;d<10&&(d=i.bottom+8);let h=Math.max(10,i.left);h+300>window.innerWidth&&(h=window.innerWidth-310),this.badge.style.top=`${d}px`,this.badge.style.left=`${h}px`}}const M=new z;async function F(){const e=window.scrollX,t=window.scrollY,i=document.documentElement.style.overflow,n=document.body.style.overflow;M.deactivate();const o=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth,window.innerWidth),s=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,window.innerHeight),r=window.innerHeight,a=window.devicePixelRatio||1,l=[];try{const d=document.querySelectorAll("*");for(let h=0;h<d.length;h++){const u=d[h];if(u.id==="uaiselect-overlay-root")continue;const y=window.getComputedStyle(u);(y.position==="fixed"||y.position==="sticky")&&l.push({elem:u,origVisibility:u.style.visibility})}}catch{}const c=[],f=[];for(let d=0;d<s;d+=r-16){const h=Math.min(d,Math.max(0,s-r));if(f.push(h),d+r>=s)break}const g=Array.from(new Set(f));for(let d=0;d<g.length;d++){const h=g[d];window.scrollTo(0,h),d>0?l.forEach(y=>{y.elem.style.visibility="hidden"}):l.forEach(y=>{y.elem.style.visibility=y.origVisibility}),await new Promise(y=>setTimeout(y,100));const u=await new Promise(y=>{chrome.runtime.sendMessage({type:"CAPTURE_SLICE_REQUEST"},q=>{y(q)})});u&&u.dataUrl&&c.push({y:h,dataUrl:u.dataUrl})}if(l.forEach(d=>{d.elem.style.visibility=d.origVisibility}),document.documentElement.style.overflow=i,document.body.style.overflow=n,window.scrollTo(e,t),c.length===0)return"";if(c.length===1&&s<=r+10)return c[0].dataUrl;const p=document.createElement("canvas");p.width=Math.round(o*a),p.height=Math.round(s*a);const x=p.getContext("2d");if(!x)return c[0].dataUrl;for(const d of c)await new Promise(h=>{const u=new Image;u.onload=()=>{x.drawImage(u,0,Math.round(d.y*a)),h()},u.onerror=()=>h(),u.src=d.dataUrl});return p.toDataURL("image/png")}chrome.runtime.onMessage.addListener((e,t,i)=>{if(e.type==="TOGGLE_INSPECTOR"){const n=M.toggle();return i({active:n}),!0}if(e.type==="START_INSPECTION")return M.activate(),i({active:!0}),!0;if(e.type==="STOP_INSPECTION")return M.deactivate(),i({active:!1}),!0;if(e.type==="SELECT_RELATIVE_ELEMENT"){if(!m||!document.contains(m))return i({ok:!1}),!0;let n=null;if(e.direction==="parent"){const o=m.parentElement;o&&o!==document.body&&o!==document.documentElement&&(n=o)}else e.direction==="child"&&(n=m.firstElementChild);if(n){$(n);const o=I(n);chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:o}).catch(()=>{}),setTimeout(()=>_(n),120),i({ok:!0})}else i({ok:!1});return!0}if(e.type==="PING_HIGHLIGHT_ELEMENT")return m&&document.contains(m)?(_(m),i({ok:!0})):i({ok:!1}),!0;if(e.type==="MUTATE_ELEMENT_CLASSES"){if(!m||!document.contains(m))return i({ok:!1}),!0;const n=m;if(e.action==="toggle"&&e.className){const r=e.className.trim();n.classList.contains(r)?(n.classList.remove(r),S.includes(r)&&N.add(r),C.delete(r)):(n.classList.add(r),N.delete(r),S.includes(r)||C.add(r))}else if(e.action==="add"&&e.className){const r=e.className.split(/\s+/).map(a=>a.trim()).filter(Boolean);for(const a of r)n.classList.add(a),N.delete(a),S.includes(a)||C.add(a)}else e.action==="reset"&&(n.className=S.join(" "),C.clear(),N.clear());const o=k(n),s=n.getBoundingClientRect();return i({ok:!0,computedStyles:o,rect:{x:Math.round(s.x),y:Math.round(s.y),width:Math.round(s.width),height:Math.round(s.height),top:Math.round(s.top),left:Math.round(s.left),bottom:Math.round(s.bottom),right:Math.round(s.right)},liveClassChanges:{added:Array.from(C),removed:Array.from(N)}}),!0}if(e.type==="DO_FULL_PAGE_CAPTURE")return F().then(n=>{i({screenshotUrl:n})}).catch(()=>{i({screenshotUrl:""})}),!0})})();
