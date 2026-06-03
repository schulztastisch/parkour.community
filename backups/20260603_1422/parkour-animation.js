(function () {
  var CITIES = ['berlin','hamburg','muenchen','koeln','frankfurt','stuttgart','duesseldorf','dortmund','leipzig','bremen','hannover','nuernberg','freiburg','mainz','karlsruhe','bonn','muenster','wiesbaden','wien','zuerich','bern','basel','salzburg','graz','amsterdam'];
  var FINAL='eure', LONGEST='neubrandenburg', SUFFIX='.parkour.community';
  var MAX_SIZE=96, MIN_SIZE=14, SLOT_FACTOR=1.3;
  var BAD=['scheiss','arsch','fick','wichser','hurensohn','fotze','hure','nutte','nazi','hitler','idiot','depp','wichse','kacke','penner','drecksau','dummkopf','fuck','shit','bitch','cunt','dick','cock','pussy','whore','slut','nigger','faggot','retard','asshole','motherfucker'];
  function hasBad(s){var n=s.toLowerCase().replace(/[^a-z]/g,'');return BAD.some(function(w){return n.indexOf(w)!==-1;});}
  var clipEl=document.getElementById('pkr-clip');
  var drumEl=document.getElementById('pkr-drum');
  var winEl=document.getElementById('pkr-window');
  var ghost=document.getElementById('pkr-ghost');
  var domEl=document.querySelector('.pkr-domain');
  var inp=document.getElementById('pkr-input');
  var setBtn=document.getElementById('pkr-set');
  var warnEl=document.getElementById('pkr-warn');
  if(!drumEl||!winEl||!ghost||!domEl||!clipEl)return;
  var busy=false, fontSize=16;
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
  function init(){var sz=calcSize();applySize(sz);setW();fill([FINAL]);syncH();gsap.set(drumEl,{y:0});if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(function(){roll(mkList(FINAL,14));},200);}}
  clipEl.addEventListener('click',function(){if(!busy)roll(mkList(FINAL,14));});
  function setCity(){var v=inp.value.trim().toLowerCase();if(!v||busy)return;if(hasBad(v)){if(warnEl)warnEl.style.display='block';return;}if(warnEl)warnEl.style.display='none';inp.value='';roll(mkList(v,5));}
  if(setBtn)setBtn.addEventListener('click',setCity);
  if(inp)inp.addEventListener('keydown',function(e){if(e.key==='Enter')setCity();});
  window.addEventListener('resize',function(){if(!busy){var s=calcSize();applySize(s);setW();syncH();}});
  document.fonts.ready.then(function(){requestAnimationFrame(function(){requestAnimationFrame(init);});});
})();
