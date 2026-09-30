const pre=$('hl'),gut=$('gut');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const STR=/"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?/.source;
const NUM='(?<![\\p{L}_$])[0-9٠-٩]+(?:[.٫][0-9٠-٩]+)?';
const wb=l=>'(?<![\\p{L}\\p{N}_$])(?:'+l.join('|')+')(?![\\p{L}\\p{N}_$])';
const BI=['اكتب','ادخل','أدخل'];
const R={
  dhad:[['c',/\/\/.*/.source],['s',STR],['b',wb(BI)],['k',wb([...Object.keys(KW).filter(k=>!BI.includes(k)),'كرر','مرة'])],['n',NUM]],
  python:[['c','#.*'],['s','[fFrRbB]?(?:'+STR+')'],['k',wb('def return if elif else for while in and or not True False None pass break continue global import from class try except with as is lambda'.split(' '))],['b',wb('print len range input int str float sum max min abs round list dict'.split(' '))],['n',NUM]],
  javascript:[['c',/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/.source],['s',STR],['k',wb('const let var function return if else for while do switch case break continue new class true false null undefined typeof await async of in this'.split(' '))],['b',wb('console Math Array Object JSON document window String Number prompt alert parseInt parseFloat'.split(' '))],['n',NUM]],
  css:[['c',/\/\*[\s\S]*?(?:\*\/|$)/.source],['s',STR],['k','[\\w-]+(?=\\s*:)'],['n','#[0-9a-fA-F]{3,8}\\b|-?\\d*\\.?\\d+(?:px|em|rem|%|vh|vw|s)?'],['b','[.#][\\w-]+(?=[^{}]*\\{)']],
  html:[['c',/<!--[\s\S]*?(?:-->|$)/.source],['t','<\\/?[a-zA-Z][\\w-]*|\\/?>'],['s',/"[^"]*"?|'[^']*'?/.source],['k','[\\w:-]+(?=\\s*=)']]
};
function hl(code,rules){
  if(!rules.re)rules.re=new RegExp(rules.map(r=>'('+r[1]+')').join('|'),'gu');
  const re=rules.re;re.lastIndex=0;let o='',i=0,m;
  while(m=re.exec(code)){
    if(!m[0]){re.lastIndex++;continue}
    const g=m.findIndex((x,j)=>j&&x!==undefined)-1;
    o+=esc(code.slice(i,m.index))+'<span class="t-'+rules[g][0]+'">'+esc(m[0])+'</span>';i=re.lastIndex;
  }
  return o+esc(code.slice(i));
}
function hlHtml(c){
  const re=/(<style[^>]*>)([\s\S]*?)(<\/style>|$)|(<script[^>]*>)([\s\S]*?)(<\/script>|$)/gi;
  let o='',i=0,m;
  while(m=re.exec(c)){
    o+=hl(c.slice(i,m.index),R.html);
    o+=m[1]!==undefined?hl(m[1],R.html)+hl(m[2],R.css)+hl(m[3],R.html):hl(m[4],R.html)+hl(m[5],R.javascript)+hl(m[6],R.html);
    i=re.lastIndex;
  }
  return o+hl(c.slice(i),R.html);
}
function upd(){
  const v=ed.value,n=v.split('\n').length;
  pre.dir=ed.dir;pre.innerHTML=(lang==='web'?hlHtml(v):hl(v,R[lang]))+' ';
  if(gut.dataset.n!=n){gut.dataset.n=n;gut.textContent=Array.from({length:n},(_,i)=>i+1).join('\n')}
  $('lc').textContent='('+n+' سطر)';
  pre.scrollTop=gut.scrollTop=ed.scrollTop;
}
ed.addEventListener('input',upd);
ed.addEventListener('keydown',e=>{if(e.key==='Tab')setTimeout(upd)});
ed.addEventListener('scroll',()=>{pre.scrollTop=gut.scrollTop=ed.scrollTop;pre.scrollLeft=ed.scrollLeft});

const PAIRS={'(':')','[':']','{':'}','"':'"',"'":"'",'`':'`'},CLOSE=new Set(Object.values(PAIRS));
function put(txt,a,b,caret){ed.setRangeText(txt,a,b,'end');ed.selectionStart=ed.selectionEnd=caret;upd()}
ed.addEventListener('beforeinput',e=>{
  const v=ed.value,s=ed.selectionStart,en=ed.selectionEnd,d=e.data,p=v[s-1]||'',nx=v[en]||'',L=/[\p{L}\p{N}]/u;
  if(e.inputType==='insertText'&&d&&d.length===1){
    if(s===en&&nx===d&&CLOSE.has(d)){e.preventDefault();ed.selectionStart=ed.selectionEnd=s+1;return}
    if(PAIRS[d]){
      if(s!==en){e.preventDefault();put(d+v.slice(s,en)+PAIRS[d],s,en,en+2);return}
      if(L.test(nx)||(/['"`]/.test(d)&&L.test(p)))return;
      e.preventDefault();put(d+PAIRS[d],s,en,s+1);
    }
  }else if(e.inputType==='deleteContentBackward'&&s===en&&p&&PAIRS[p]===nx){
    e.preventDefault();put('',s-1,s+1,s-1);
  }else if(e.inputType==='insertLineBreak'){
    e.preventDefault();
    const ls=v.lastIndexOf('\n',s-1)+1,before=v.slice(ls,s),ind=before.match(/^\s*/)[0];
    const x=(p==='{'||(lang==='python'&&/:\s*$/.test(before)))?'    ':'';
    if(p==='{'&&nx==='}')put('\n'+ind+x+'\n'+ind,s,en,s+1+ind.length+x.length);
    else put('\n'+ind+x,s,en,s+1+ind.length+x.length);
  }
});
upd();
const ex0=new URLSearchParams(location.search).get('ex');
if(ex0&&EXS[ex0]){setLang('dhad');ed.value=EXS[ex0].c;upd()}

const tabs=document.querySelector('.tabs-container');
function view(on){
  document.body.classList.toggle('show-docs',on);
  tabs.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',on?b.dataset.view==='docs':b.dataset.lang===lang));
}
tabs.addEventListener('click',e=>{const b=e.target.closest('.tab-btn');if(b)view(b.dataset.view==='docs')});
const dtb=$('dtb');
function drows(f){
  dtb.textContent='';
  DICT.filter(x=>!f||JSON.stringify(x).includes(f)).forEach(x=>{
    const tr=dtb.insertRow();
    [[[x.ar,...(x.alt||[])].join(' / '),''],[x.js,'c'],[x.d,''],[x.ex,'c']].forEach(([t,c])=>{const td=tr.insertCell();td.textContent=t;td.dir='auto';if(c)td.className=c});
  });
}
$('dq').addEventListener('input',e=>drows(e.target.value.trim()));drows('');
Object.entries(EXS).forEach(([k,v])=>{
  const h=document.createElement('h3'),p=document.createElement('pre'),b=document.createElement('button');
  h.textContent=v.t;p.className='ex';p.dir='auto';p.textContent=v.c;b.className='try';b.textContent='جرّبه في المحرر ▶';
  b.onclick=()=>{setLang('dhad');ed.value=v.c;upd();view(false);scrollTo(0,0)};
  $('dexs').append(h,p,b);
});
