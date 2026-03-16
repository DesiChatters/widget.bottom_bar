!function(){
const config={
  delay:3000,
  buttons:[
    {text:"Home",url:"#"},
    {text:"Services",url:"#"},
    {text:"Contact",url:"#"},
    {text:"Support",url:"#"},
    {text:"Chat",url:"#"}
  ]
};

function track(event,data){
  window.dispatchEvent(new CustomEvent("DUA_WIDGET_EVENT",{detail:{event,data,time:Date.now()}}));
}

function getContrastColor(bg){
  // Simple luminance-based contrast: returns black or white for best readability
  if(!bg) return "#fff";
  let color = bg.replace(/\s/g,'');
  if(color.startsWith("rgb")){
    const nums=color.match(/\d+/g).map(Number);
    const luminance=(0.299*nums[0]+0.587*nums[1]+0.114*nums[2])/255;
    return luminance>0.6?"#000":"#fff";
  }
  return "#fff";
}

function createWidget(){
  track("script_initialized");

  // Compute adaptive colors
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const textColor = getContrastColor(bodyBg);
  const buttonBg = "#2563eb"; // brand accent
  const buttonText = "#fff";

  // Inject styles
  const style=document.createElement("style");
  style.innerHTML=`
#dua-bar{position:fixed;bottom:-120px;left:0;width:100%;max-width:100%;background:${bodyBg};color:${textColor};display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;padding:12px;box-shadow:0 -2px 10px rgba(0,0,0,.25);transition:bottom .4s;z-index:999999;font-family:Arial,sans-serif;font-size:14px;box-sizing:border-box;}
#dua-bar.show{bottom:0;}
#dua-bar a{background:${buttonBg};padding:8px 14px;border-radius:6px;color:${buttonText};text-decoration:none;transition:background .2s;font-size:1rem;}
#dua-bar a:hover,#dua-bar a:focus{background:#1d4ed8;outline:none;}
#dua-close{position:absolute;right:12px;top:6px;cursor:pointer;font-size:18px;color:${textColor};}
#dua-arrow{position:fixed;bottom:20px;right:20px;width:42px;height:42px;border-radius:50%;background:${bodyBg};color:${textColor};display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.25);display:none;z-index:999999;transition:opacity .3s;}
@media (max-width:600px){#dua-bar{flex-direction:column;gap:8px;font-size:13px;padding:10px;} #dua-bar a{width:90%;text-align:center;}}
`;
  document.head.appendChild(style);

  // Create bar
  const bar=document.createElement("div");
  bar.id="dua-bar";

  // Close button
  const close=document.createElement("div");
  close.id="dua-close";
  close.setAttribute("aria-label","Minimize floating bar");
  close.setAttribute("role","button");
  close.tabIndex=0;
  close.innerHTML="−";
  bar.appendChild(close);

  // Buttons
  config.buttons.slice(0,5).forEach(btn=>{
    const a=document.createElement("a");
    a.innerText=btn.text;
    a.href=btn.url;
    a.tabIndex=0;
    a.setAttribute("aria-label",btn.text+" button");
    a.onclick=function(){track("button_click",btn.text);};
    bar.appendChild(a);
  });

  document.body.appendChild(bar);

  // Restore arrow
  const arrow=document.createElement("div");
  arrow.id="dua-arrow";
  arrow.setAttribute("role","button");
  arrow.setAttribute("aria-label","Restore floating bar");
  arrow.tabIndex=0;
  arrow.innerHTML="↑";
  document.body.appendChild(arrow);

  // Show bar after delay
  setTimeout(()=>{
    bar.classList.add("show");
    track("bar_visible");
  },config.delay);

  // Minimize interaction
  close.onclick=close.onkeypress=function(e){
    if(e.type==="click"||(e.type==="keypress"&& (e.key==="Enter"||e.key===" "))){
      track("bar_minimized");
      bar.classList.remove("show");
      setTimeout(()=>{
        arrow.style.display="flex";
        arrow.style.opacity="1";
        track("arrow_visible");
      },400);
    }
  };

  // Restore interaction
  arrow.onclick=arrow.onkeypress=function(e){
    if(e.type==="click"||(e.type==="keypress"&& (e.key==="Enter"||e.key===" "))){
      track("bar_restored");
      arrow.style.display="none";
      bar.classList.add("show");
    }
  };
}

// Initialize
if(document.readyState==="complete"){
  createWidget();
}else{
  window.addEventListener("load",createWidget);
}
}();