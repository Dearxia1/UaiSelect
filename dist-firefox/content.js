var v=Object.defineProperty;var y=(r,e,t)=>e in r?v(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var d=(r,e,t)=>y(r,typeof e!="symbol"?e+"":e,t);const N=`
(function() {
  if (window.__UAISELECT_BRIDGE_READY__) return;
  window.__UAISELECT_BRIDGE_READY__ = true;

  function cleanPath(p) {
    if (!p || typeof p !== 'string') return '';
    return p
      .replace(/\\\\/g, '/')
      .replace(/^webpack:\\/\\/[^/]*\\//, '')
      .replace(/^file:\\/\\/\\/?/, '')
      .replace(/^\\/([A-Z]:)/, '$1')
      .replace(/^.*\\/(src\\/.*)$/, '$1')
      .replace(/\\?.*$/, '');
  }

  function getComponentName(type) {
    if (!type) return null;
    if (typeof type === 'string') return type;
    if (typeof type === 'function') return type.displayName || type.name || 'Component';
    if (typeof type === 'object') {
      if (type.displayName) return type.displayName;
      if (type.name) return type.name;
      if (type.render) return type.render.displayName || type.render.name || 'ForwardRef';
      if (type.type) return getComponentName(type.type);
    }
    return null;
  }

  function findFiber(node) {
    var curr = node;
    var depth = 0;
    while (curr && depth < 6) {
      var keys = Object.keys(curr);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')) {
          var fiber = curr[k];
          if (fiber) return fiber;
        }
      }
      curr = curr.parentElement;
      depth++;
    }
    return null;
  }

  function extractFiberSource(fiber) {
    if (!fiber) return null;

    // 1. Standard _debugSource (React 16, 17, 18, Vite Babel, Next.js)
    var dbg = fiber._debugSource || (fiber._debugOwner && fiber._debugOwner._debugSource);
    if (dbg && dbg.fileName) {
      return {
        fileName: cleanPath(dbg.fileName),
        lineNumber: Number(dbg.lineNumber) || 1,
        columnNumber: Number(dbg.columnNumber) || undefined
      };
    }

    // 2. Props __source / _source (Babel / SWC JSX Dev)
    var props = fiber.memoizedProps || fiber.pendingProps;
    if (props && (props.__source || props._source)) {
      var s = props.__source || props._source;
      if (s.fileName) {
        return {
          fileName: cleanPath(s.fileName),
          lineNumber: Number(s.lineNumber) || 1,
          columnNumber: Number(s.columnNumber) || undefined
        };
      }
    }

    // 3. React 19 _debugInfo array
    if (Array.isArray(fiber._debugInfo)) {
      for (var i = 0; i < fiber._debugInfo.length; i++) {
        var info = fiber._debugInfo[i];
        if (info && info.fileName) {
          return {
            fileName: cleanPath(info.fileName),
            lineNumber: Number(info.lineNumber) || 1,
            columnNumber: Number(info.columnNumber) || undefined
          };
        }
      }
    }

    // 4. React 19 _debugStack regex
    if (fiber._debugStack && typeof fiber._debugStack === 'string') {
      var match = fiber._debugStack.match(/((?:src|app|pages|components|lib)\\b[^?:\\s"']+\\.[a-zA-Z0-9]+)(?:\\?[^:\\s"']*)?:(\\d+)/);
      if (match) {
        return {
          fileName: cleanPath(match[1]),
          lineNumber: parseInt(match[2], 10) || 1
        };
      }
    }

    return null;
  }

  document.addEventListener('UAISELECT_INSPECT_DOM_EVENT', function(e) {
    var target = e.target;
    if (!target) return;

    var result = { source: null, hierarchy: [] };
    var visitedNames = {};

    // 1. React Fiber Traversal
    var fiber = findFiber(target);
    if (fiber) {
      var current = fiber;
      while (current) {
        var compName = getComponentName(current.type);
        var src = extractFiberSource(current);
        var isCustom = typeof current.type === 'function' || (typeof current.type === 'object' && compName !== null && typeof current.type !== 'string');

        if (compName && compName !== 'div' && compName !== 'span' && isCustom) {
          if (!visitedNames[compName]) {
            visitedNames[compName] = true;
            var nodeSource = null;
            if (src) {
              nodeSource = {
                fileName: src.fileName,
                lineNumber: src.lineNumber,
                columnNumber: src.columnNumber,
                componentName: compName,
                framework: 'react'
              };
            }

            result.hierarchy.unshift({
              name: compName,
              tag: typeof current.type === 'string' ? current.type : 'component',
              source: nodeSource,
              isCustomComponent: true
            });

            if (!result.source && nodeSource) {
              result.source = nodeSource;
            }
          }
        }

        if (!result.source && src) {
          result.source = {
            fileName: src.fileName,
            lineNumber: src.lineNumber,
            columnNumber: src.columnNumber,
            componentName: compName || target.tagName.toLowerCase(),
            framework: 'react'
          };
        }

        current = current.return;
      }
    }

    // 2. Vue / Vite Inspector Traversal
    var currElem = target;
    while (currElem && currElem !== document.body && currElem !== document.documentElement) {
      var vInspector = currElem.getAttribute('data-v-inspector') || currElem.getAttribute('data-source') || currElem.getAttribute('data-loc');
      if (vInspector && !result.source) {
        var parts = vInspector.split(':');
        if (parts.length >= 2) {
          var fName = parts[0];
          var lNum = parseInt(parts[1], 10) || 1;
          if (parts[0].length === 1 && parts.length >= 3) {
            fName = parts[0] + ':' + parts[1];
            lNum = parseInt(parts[2], 10) || 1;
          }
          var cName = fName.split('/').pop().replace(/\\.[^.]+$/, '') || 'Component';
          result.source = {
            fileName: cleanPath(fName),
            lineNumber: lNum,
            componentName: cName,
            framework: 'vue'
          };
          result.hierarchy.unshift({
            name: cName,
            tag: currElem.tagName.toLowerCase(),
            source: result.source,
            isCustomComponent: true
          });
        }
      }

      var vueComp = currElem.__vueParentComponent || currElem.__vue__;
      if (vueComp && vueComp.type && !result.source) {
        var vName = vueComp.type.name || vueComp.type.__name || 'VueComponent';
        if (vueComp.type.__file) {
          result.source = {
            fileName: cleanPath(vueComp.type.__file),
            lineNumber: 1,
            componentName: vName,
            framework: 'vue'
          };
        }
        result.hierarchy.unshift({
          name: vName,
          tag: currElem.tagName.toLowerCase(),
          source: result.source,
          isCustomComponent: true
        });
      }

      currElem = currElem.parentElement;
    }

    target.setAttribute('data-uaiselect-result', JSON.stringify(result));
  }, true);
})();
`;function w(){if(!document.getElementById("uaiselect-inline-bridge"))try{const r=document.createElement("script");r.id="uaiselect-inline-bridge",r.textContent=N,(document.head||document.documentElement).appendChild(r)}catch(r){console.error("UaiSelect bridge error:",r)}}function x(r){w();try{r.dispatchEvent(new CustomEvent("UAISELECT_INSPECT_DOM_EVENT",{bubbles:!0,cancelable:!0}));const e=r.getAttribute("data-uaiselect-result");if(r.removeAttribute("data-uaiselect-result"),e){const t=JSON.parse(e);return{source:t.source||void 0,hierarchy:t.hierarchy||[]}}}catch(e){console.error("Error querying UaiSelect DOM bridge:",e)}return{hierarchy:[]}}function C(r,e){var i;if(!r)return;const t=r.split(":");if(t.length>=2){let a="",o=1,n;t[0].length===1&&t.length>=3?(a=`${t[0]}:${t[1]}`,o=parseInt(t[2],10)||1,n=t[3]?parseInt(t[3],10):void 0):(a=t[0],o=parseInt(t[1],10)||1,n=t[2]?parseInt(t[2],10):void 0);const s=((i=a.split("/").pop())==null?void 0:i.replace(/\.[^.]+$/,""))||"Component";return{fileName:a,lineNumber:o,columnNumber:n,componentName:s,framework:e}}}function E(r){var a,o;const e=[];let t,i=r;for(;i&&i!==document.body&&i!==document.documentElement;){const n=i.getAttribute("data-v-inspector");n&&!t&&(t=C(n,"vue"),t!=null&&t.componentName&&e.unshift({name:t.componentName,tag:i.tagName.toLowerCase(),source:t,isCustomComponent:!0}));const s=i.getAttribute("data-astro-source-file"),l=i.getAttribute("data-astro-source-loc");if(s&&!t){const p=l?parseInt(l.split(":")[0],10):1,m=((a=s.split("/").pop())==null?void 0:a.replace(/\.[^.]+$/,""))||"AstroComponent";t={fileName:s,lineNumber:p,componentName:m,framework:"unknown"},e.unshift({name:m,tag:i.tagName.toLowerCase(),source:t,isCustomComponent:!0})}const c=i.__svelte_meta;c&&c.loc&&!t&&(t={fileName:c.loc.file,lineNumber:c.loc.line,columnNumber:c.loc.column,componentName:((o=c.loc.file.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"SvelteComponent",framework:"svelte"},e.unshift({name:t.componentName||"SvelteComponent",tag:i.tagName.toLowerCase(),source:t,isCustomComponent:!0}));const u=i.__vueParentComponent;if(u&&u.type){const p=u.type.name||u.type.__name||"VueComponent";e.some(m=>m.name===p)||e.unshift({name:p,tag:i.tagName.toLowerCase(),isCustomComponent:!0})}i=i.parentElement}return{source:t,hierarchy:e}}const _=["flex","grid","inline","block","hidden","p-","px-","py-","pt-","pb-","pl-","pr-","m-","mx-","my-","mt-","mb-","ml-","mr-","bg-","text-","border-","rounded-","shadow-","w-","h-","min-w-","max-w-","min-h-","max-h-","gap-","space-","items-","justify-","self-","opacity-","transition-","duration-","ease-","font-","tracking-","leading-","text-","relative","absolute","fixed","sticky","inset-","top-","bottom-","left-","right-","z-","hover:","focus:","active:","dark:","sm:","md:","lg:","xl:","2xl:","group-hover:","cursor-","overflow-","select-"];function g(r){return!r||typeof r!="string"?!1:_.some(e=>r.startsWith(e)||r===e)}function S(r){const e=window.getComputedStyle(r);return{display:e.display,position:e.position,width:`${Math.round(parseFloat(e.width)||0)}px`,height:`${Math.round(parseFloat(e.height)||0)}px`,margin:`${e.marginTop} ${e.marginRight} ${e.marginBottom} ${e.marginLeft}`,padding:`${e.paddingTop} ${e.paddingRight} ${e.paddingBottom} ${e.paddingLeft}`,color:e.color,backgroundColor:e.backgroundColor,fontSize:e.fontSize,fontFamily:e.fontFamily.split(",")[0].replace(/['"]/g,""),borderRadius:e.borderRadius,border:`${e.borderWidth} ${e.borderStyle} ${e.borderColor}`,gap:e.gap!=="normal"?e.gap:void 0,flexDirection:e.display.includes("flex")?e.flexDirection:void 0}}function k(r,e=2){const t=r.cloneNode(!0);function i(n,s){if(s>=e&&n.children.length>0){n.innerHTML=`<!-- ... ${n.children.length} child elements truncated ... -->`;return}for(let l=0;l<n.children.length;l++)i(n.children[l],s+1)}i(t,0);const a=t.outerHTML.slice(0,1500);return{innerSnippet:t.innerHTML.slice(0,1e3),outerSnippet:a}}function b(r){const e=r.getBoundingClientRect(),t=Array.from(r.classList||[]),i=t.filter(g),a=t.filter(m=>!g(m)),o=x(r),n=E(r),s=o.source||n.source,l=o.hierarchy.length>0?o.hierarchy:n.hierarchy;l.length===0&&l.push({name:`<${r.tagName.toLowerCase()}>`,tag:r.tagName.toLowerCase(),isCustomComponent:!1});const{innerSnippet:c,outerSnippet:u}=k(r),p=S(r);return{tagName:r.tagName.toLowerCase(),id:r.id||"",className:r.className||"",classList:t,tailwindClasses:i,customClasses:a,source:s,hierarchy:l,innerHTMLSnippet:c,outerHTMLSnippet:u,innerTextSnippet:(r.innerText||"").slice(0,200).trim(),computedStyles:p,rect:{x:Math.round(e.x),y:Math.round(e.y),width:Math.round(e.width),height:Math.round(e.height),top:Math.round(e.top),left:Math.round(e.left),bottom:Math.round(e.bottom),right:Math.round(e.right)},viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1},url:window.location.href,pageTitle:document.title,timestamp:Date.now()}}class M{constructor(e){d(this,"container",null);d(this,"shadowRoot",null);d(this,"highlightBox",null);d(this,"badge",null);d(this,"banner",null);d(this,"currentElement",null);d(this,"isActive",!1);d(this,"onSelectCallback");this.onSelectCallback=e,this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleScroll=this.handleScroll.bind(this)}activate(){this.isActive||(this.isActive=!0,this.createOverlayDOM(),this.bindEvents())}deactivate(){this.isActive&&(this.isActive=!1,this.unbindEvents(),this.removeOverlayDOM(),this.currentElement=null)}toggle(){return this.isActive?(this.deactivate(),!1):(this.activate(),!0)}createOverlayDOM(){if(document.getElementById("uaiselect-overlay-root"))return;this.container=document.createElement("div"),this.container.id="uaiselect-overlay-root",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100vw",this.container.style.height="100vh",this.container.style.zIndex="2147483647",this.container.style.pointerEvents="none",this.shadowRoot=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=`
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
    `,this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(this.highlightBox),this.shadowRoot.appendChild(this.badge),this.shadowRoot.appendChild(this.banner),document.documentElement.appendChild(this.container)}removeOverlayDOM(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.shadowRoot=null,this.highlightBox=null,this.badge=null,this.banner=null}bindEvents(){window.addEventListener("mousemove",this.handleMouseMove,!0),window.addEventListener("click",this.handleClick,!0),window.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0)}unbindEvents(){window.removeEventListener("mousemove",this.handleMouseMove,!0),window.removeEventListener("click",this.handleClick,!0),window.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0)}handleMouseMove(e){var i;if(!this.isActive)return;const t=document.elementFromPoint(e.clientX,e.clientY);!t||t===this.container||(i=this.container)!=null&&i.contains(t)||this.updateHighlight(t)}handleScroll(){this.currentElement&&this.isActive&&this.updateHighlight(this.currentElement)}handleKeyDown(e){if(this.isActive){if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.deactivate();return}if(e.key==="ArrowUp"&&this.currentElement){e.preventDefault(),e.stopPropagation();const t=this.currentElement.parentElement;t&&t!==document.body&&t!==document.documentElement&&this.updateHighlight(t);return}if(e.key==="ArrowDown"&&this.currentElement){e.preventDefault(),e.stopPropagation();const t=this.currentElement.firstElementChild;t&&this.updateHighlight(t);return}}}handleClick(e){if(!this.isActive)return;e.preventDefault(),e.stopPropagation();const t=this.currentElement||document.elementFromPoint(e.clientX,e.clientY);if(!t)return;this.highlightBox&&(this.highlightBox.classList.add("uaiselect-flash-anim"),setTimeout(()=>{var a;(a=this.highlightBox)==null||a.classList.remove("uaiselect-flash-anim")},300));const i=b(t);this.onSelectCallback&&this.onSelectCallback(i),this.deactivate()}updateHighlight(e){var c,u;if(this.currentElement=e,!this.highlightBox||!this.badge)return;const t=e.getBoundingClientRect();if(t.width===0&&t.height===0)return;this.highlightBox.style.display="block",this.highlightBox.style.top=`${t.top}px`,this.highlightBox.style.left=`${t.left}px`,this.highlightBox.style.width=`${t.width}px`,this.highlightBox.style.height=`${t.height}px`;const i=b(e),a=((c=i.source)==null?void 0:c.componentName)||((u=i.hierarchy[0])==null?void 0:u.name)||`<${e.tagName.toLowerCase()}>`,o=i.source?`${i.source.fileName.split("/").pop()}:${i.source.lineNumber}`:"",n=`${Math.round(t.width)} × ${Math.round(t.height)}`;this.badge.innerHTML=`
      <span class="uaiselect-badge-comp">${a}</span>
      ${o?`<span class="uaiselect-badge-src">${o}</span>`:""}
      <span class="uaiselect-badge-dim">${n}</span>
    `,this.badge.style.display="flex";let s=t.top-32;s<10&&(s=t.bottom+8);let l=Math.max(10,t.left);l+300>window.innerWidth&&(l=window.innerWidth-310),this.badge.style.top=`${s}px`,this.badge.style.left=`${l}px`}}function f(){if(document.getElementById("uaiselect-main-world-bridge"))return;const r=document.createElement("script");r.id="uaiselect-main-world-bridge",r.src=chrome.runtime.getURL("mainWorld.js"),(document.head||document.documentElement).appendChild(r)}try{f()}catch(r){console.error("Failed to inject UaiSelect Main World bridge:",r)}const h=new M(r=>{chrome.runtime.sendMessage({type:"ELEMENT_SELECTED",payload:r})});chrome.runtime.onMessage.addListener((r,e,t)=>{if(r.type==="TOGGLE_INSPECTOR"){f();const i=h.toggle();return t({active:i}),!0}if(r.type==="START_INSPECTION")return f(),h.activate(),t({active:!0}),!0;if(r.type==="STOP_INSPECTION")return h.deactivate(),t({active:!1}),!0});
