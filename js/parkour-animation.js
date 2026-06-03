(function () {
  var CITIES = ['berlin','hamburg','muenchen','koeln','frankfurt','stuttgart','duesseldorf','dortmund','leipzig','bremen','hannover','nuernberg','freiburg','mainz','karlsruhe','bonn','muenster','wiesbaden','wien','zuerich','bern','basel','salzburg','graz','amsterdam'];
  var FINAL='eure', LONGEST='neubrandenburg-am-main', SUFFIX='.parkour.community';
  var MAX_SIZE=96, MIN_SIZE=14, SLOT_FACTOR=1.3;
  var clipEl=document.getElementById('pkr-clip');
  var drumEl=document.getElementById('pkr-drum');
  var winEl=document.getElementById('pkr-window');
  var ghost=document.getElementById('pkr-ghost');
  var domEl=document.querySelector('.pkr-domain');
  var inp=document.getElementById('pkr-input');
  var setBtn=document.getElementById('pkr-set');
  var warnEl=document.getElementById('pkr-warn');
  var sugEl=document.getElementById('pkr-suggestions');
  var fallbackEl=document.getElementById('pkr-fallback');
  var formCityEl=document.getElementById('pkr-form-city');
  var formEl=document.getElementById('pkr-form');
  var formConfirmEl=document.getElementById('pkr-form-confirm');
  if(!drumEl||!winEl||!ghost||!domEl||!clipEl)return;
  var busy=false, fontSize=16, activeIdx=-1, selectedFromList=false, debTimer=null;
  function getW(){var dw=domEl.getBoundingClientRect().width;if(dw>0)return dw;var bw=document.body.getBoundingClientRect().width;return bw>0?bw-32:window.innerWidth-32;}
  function calcSize(){var sz=MAX_SIZE;ghost.style.fontSize=sz+'px';ghost.textContent=LONGEST+SUFFIX;var av=getW();while(ghost.scrollWidth>av&&sz>MIN_SIZE){sz-=0.5;ghost.style.fontSize=sz+'px';}return sz;}
  function applySize(sz){fontSize=sz;domEl.style.fontSize=sz+'px';ghost.style.fontSize=sz+'px';}
  function meas(t){ghost.textContent=t;return ghost.scrollWidth+1;}
  function slotH(){return Math.ceil(fontSize*SLOT_FACTOR);}
  function setW(){var w=meas(LONGEST);winEl.style.width=w+'px';clipEl.style.width=w+'px';}
  function syncH(){var sh=slotH();clipEl.style.height=sh+'px';winEl.style.height=sh+'px';var sp=drumEl.querySelectorAll('span');for(var i=0;i<sp.length;i++){sp[i].style.height=sh+'px';sp[i].style.lineHeight=sh+'px';}return sh;}
  function fill(list){drumEl.innerHTML='';for(var i=0;i<list.length;i++){var s=document.createElement('span');s.textContent=list[i];drumEl.appendChild(s);}}
  function roll(list,cb){if(busy)return;busy=true;fill(list);var sh=syncH();gsap.set(drumEl,{y:0});var endY=-sh*(list.length-1);var dur=list.length*0.11;gsap.timeline({onComplete:function(){busy=false;if(cb)cb();}}).to(drumEl,{y:endY+sh,duration:dur,ease:'power2.in'}).to(drumEl,{y:endY,duration:0.55,ease:'power4.out'}).to(drumEl,{y:endY-sh*0.025,duration:0.09,ease:'power2.out',yoyo:true,repeat:1},'>-0.04');}
  function mkList(t,n){var p=CITIES.filter(function(c){return c!==t;});p.sort(function(){return Math.random()-0.5;});p=p.slice(0,n);p.push(t);return p;}
  function hideSug(){sugEl.style.display='none';sugEl.innerHTML='';activeIdx=-1;}
  function showSug(items){sugEl.innerHTML='';if(!items.length){hideSug();return;}items.forEach(function(name,i){var li=document.createElement('li');li.textContent=name;li.addEventListener('mousedown',function(e){e.preventDefault();selectCity(name);});sugEl.appendChild(li);});sugEl.style.display='block';activeIdx=-1;}
  function slugifyCity(name){
  return name
    .toLowerCase()
    .replace(/ä/g,'ae')
    .replace(/ö/g,'oe')
    .replace(/ü/g,'ue')
    .replace(/ß/g,'ss')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-|-$/g,'');
}
function selectCity(name){inp.value=name;selectedFromList=true;hideSug();if(warnEl)warnEl.style.display='none';if(fallbackEl)fallbackEl.style.display='none';var slug=slugifyCity(name);roll(mkList(slug,5));}
  function fetchSuggestions(q){clearTimeout(debTimer);debTimer=setTimeout(function(){if(q.length<2){hideSug();return;}var url='https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=de,at,ch&featuretype=city&q='+encodeURIComponent(q);var xhr=new XMLHttpRequest();xhr.open('GET',url,true);xhr.setRequestHeader('Accept-Language','de');xhr.onload=function(){if(xhr.status===200){try{var data=JSON.parse(xhr.responseText);var names=[];data.forEach(function(r){var n=r.address&&(r.address.city||r.address.town||r.address.village||r.address.municipality);if(n&&names.indexOf(n)===-1)names.push(n);});showSug(names);}catch(e){hideSug();}}};xhr.send();},350);}
  if(inp){inp.addEventListener('input',function(){selectedFromList=false;fetchSuggestions(inp.value.trim());});inp.addEventListener('keydown',function(e){var items=sugEl.querySelectorAll('li');if(e.key==='ArrowDown'){e.preventDefault();activeIdx=Math.min(activeIdx+1,items.length-1);items.forEach(function(l,i){l.classList.toggle('active',i===activeIdx);});}else if(e.key==='ArrowUp'){e.preventDefault();activeIdx=Math.max(activeIdx-1,0);items.forEach(function(l,i){l.classList.toggle('active',i===activeIdx);});}else if(e.key==='Enter'){if(activeIdx>=0&&items[activeIdx]){selectCity(items[activeIdx].textContent);}else if(inp.value.trim()){setBtn.click();}}else if(e.key==='Escape'){hideSug();}});inp.addEventListener('blur',function(){setTimeout(function(){hideSug();if(!selectedFromList&&inp.value.trim().length>0){if(warnEl)warnEl.style.display='block';if(fallbackEl){fallbackEl.style.display='block';if(formCityEl)formCityEl.value=inp.value.trim();}}},200);});}
  if(setBtn){setBtn.addEventListener('click',function(){if(!selectedFromList&&inp.value.trim()){if(warnEl)warnEl.style.display='block';if(fallbackEl){fallbackEl.style.display='block';if(formCityEl)formCityEl.value=inp.value.trim();}return;}if(selectedFromList){selectedFromList=false;}});}
  if(formEl){formEl.addEventListener('submit',function(e){e.preventDefault();var city=document.getElementById('pkr-form-city').value.trim();var plz=document.getElementById('pkr-form-plz').value.trim();var msg=document.getElementById('pkr-form-msg').value.trim();if(!city||!plz)return;var fd=new FormData();fd.append('action','pkr_city_request');fd.append('nonce',pkrData.nonce);fd.append('city',city);fd.append('plz',plz);fd.append('msg',msg);var xhr=new XMLHttpRequest();xhr.open('POST',pkrData.ajaxurl,true);xhr.onload=function(){if(formConfirmEl){formEl.style.display='none';formConfirmEl.textContent='Nice! Lass uns eine Parkour Community in '+city+' aufbauen - wir melden uns!';formConfirmEl.style.display='block';}};xhr.send(fd);});}
  clipEl.addEventListener('click',function(){if(!busy)roll(mkList(FINAL,14));});
  window.addEventListener('resize',function(){if(!busy){var s=calcSize();applySize(s);setW();syncH();}});
  function init(){var sz=calcSize();applySize(sz);setW();fill([FINAL]);syncH();gsap.set(drumEl,{y:0});if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(function(){roll(mkList(FINAL,14));},200);}}
  document.fonts.ready.then(function(){requestAnimationFrame(function(){requestAnimationFrame(init);});});
})();// DARK MODE THEME TOGGLE
(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☾' : '☼';
    }
  }

  function initDarkMode() {
    var root = document.documentElement;

    var storedTheme = null;
    try {
      storedTheme = localStorage.getItem('theme');
    } catch (e) {}

    if (!storedTheme && window.matchMedia) {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      storedTheme = prefersDark ? 'dark' : 'light';
    }
    if (!storedTheme) storedTheme = 'light';

    var toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.type = 'button';

    (document.body || document.documentElement).appendChild(toggle);

    applyTheme(storedTheme);

    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || 'light';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
    });

    if (!localStorage.getItem('theme') && window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) {
        mq.addEventListener('change', function (event) {
          applyTheme(event.matches ? 'dark' : 'light');
        });
      } else if (mq.addListener) {
        mq.addListener(function (event) {
          applyTheme(event.matches ? 'dark' : 'light');
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
  } else {
    initDarkMode();
  }
})();
