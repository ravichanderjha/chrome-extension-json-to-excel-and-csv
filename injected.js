(function(a){a=XMLHttpRequest.prototype;var c=a.open,b=a.send;a.open=function(d,e){this._method=d;this._url=e;return c.apply(this,arguments)};a.send=function(d){this.addEventListener("readystatechange",function(){this._url.startsWith("/search")&&4===this.readyState&&window.postMessage({type:"xhr",data:this.response},"*")});return b.apply(this,arguments)}})(XMLHttpRequest);const {fetch:origFetch}=window;
window.fetch=async(...a)=>{const c=await origFetch(...a);console.log("injected script fetch request:",a);c.clone().blob().then(b=>{window.postMessage({type:"fetch",data:b},"*")}).catch(b=>console.error(b));return c};
