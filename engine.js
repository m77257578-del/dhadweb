const KW={};DICT.forEach(x=>{if(x.to!==null)[x.ar,...(x.alt||[])].forEach(w=>KW[w]=x.to||x.js)});
const KWRE=new RegExp('(?<![\\p{L}\\p{N}_$])('+Object.keys(KW).join('|')+')(?![\\p{L}\\p{N}_$])','gu');
const RD="const ادخل=q=>{const r=prompt(q);return r===null?'':r};";
const PRE={dhad:RD,javascript:'',python:"const print=__p,len=x=>x.length,str=String,int=x=>parseInt(x,10),float=Number,abs=Math.abs,round=Math.round,sum=a=>a.reduce((x,y)=>x+y,0),max=(...a)=>Math.max(...(a.length==1?a[0]:a)),min=(...a)=>Math.min(...(a.length==1?a[0]:a)),range=(a,b,c=1)=>{if(b===undefined){b=a;a=0}const r=[];for(let i=a;c>0?i<b:i>b;i+=c)r.push(i);return r},input=q=>{const r=prompt(q);return r===null?'':r};"};

function dhad(src){
  const S=[];
  let s=src.replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g,m=>'\u0001'+(S.push(m)-1)+'\u0002');
  s=s.replace(/\/\/.*$/gm,'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g,'.').replace(/؛/g,';').replace(/،/g,',');
  let n=0;
  s=s.replace(/كرر\s+([^{\n]+?)\s+مرة\s*\{/g,(m,c)=>{n++;return 'for(let __i'+n+'=0;__i'+n+'<('+c+');__i'+n+'++){'});
  s=s.replace(KWRE,w=>KW[w]);
  return s.replace(/\u0001(\d+)\u0002/g,(m,i)=>S[i]);
}

const ex=e=>{
  e=e.replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false').replace(/\bNone\b/g,'null')
   .replace(/\band\b/g,'&&').replace(/\bor\b/g,'||').replace(/\bnot\s+/g,'!').replace(/\.append\(/g,'.push(')
   .replace(/(\u0001\d+\u0002)\s*\*\s*(\w+)/g,'$1.repeat($2)')
   .replace(/([\w.]+)\s*\/\/\s*([\w.]+)/g,'Math.floor($1/$2)');
  if(e.includes('//'))throw new Error('القسمة الصحيحة // مدعومة مع الأرقام والمتغيرات البسيطة فقط');
  return e;
};

function py(src){
  const S=[];
  let s=src.replace(/([fF]?)("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/g,(m,f,q)=>{
    S.push(f?'`'+q.slice(1,-1).replace(/`/g,'\\`').replace(/\{([^{}]+)\}/g,'${$1}')+'`':q);
    return '\u0001'+(S.length-1)+'\u0002';
  });
  s=s.replace(/#.*$/gm,'');
  let b;
  if(b=s.match(/^\s*(import|from|class|try|except|finally|with|raise|del)\b/m))throw new Error('الأمر «'+b[1]+'» غير مدعوم في مفسر بايثون الداخلي');
  if(/[\[({][^\]\n]*\sfor\s+\S+\s+in\s/.test(s))throw new Error('قوائم الاستيعاب غير مدعومة، استخدم حلقة for عادية');
  const I='[\\p{L}_][\\p{L}\\p{N}_]*';
  const AS=new RegExp('^('+I+'(?:\\s*,\\s*'+I+')*)\\s*=(?!=)\\s*(.*)$','u');
  const L=s.split('\n').map(l=>l.replace(/\t/g,'    ')).filter(l=>l.trim()).map(l=>({i:l.search(/\S/),t:l.trim()}));
  const sc=[new Set()],par=[new Set()],own=[],bs=[],st=[{i:-1,id:0}];
  L.forEach((l,k)=>{
    while(st.length>1&&l.i<=st[st.length-1].i)st.pop();
    own[k]=st[st.length-1].id;let m;
    if(m=l.t.match(/^def\s+([^\s(]+)\s*\(([^)]*)\)\s*:$/)){
      const id=sc.push(new Set())-1;par[id]=new Set(m[2].split(',').map(x=>x.split('=')[0].trim()));bs[k]=id;st.push({i:l.i,id});
    }else if(m=l.t.match(/^global\s+(.+)$/))m[1].split(',').forEach(x=>par[own[k]].add(x.trim()));
    else if(m=l.t.match(AS))m[1].split(',').forEach(x=>sc[own[k]].add(x.trim()));
  });
  const ho=id=>{const n=[...sc[id]].filter(x=>!par[id].has(x));return n.length?'let '+n.join(',')+';':''};
  const o=[ho(0)],stk=[L.length?L[0].i:0];
  L.forEach((l,k)=>{
    while(l.i<stk[stk.length-1]){stk.pop();o.push('}')}
    const t=l.t;let m;
    if(t.endsWith(':')){
      if(!(L[k+1]&&L[k+1].i>l.i))throw new Error('بعد النقطتين «:» يجب كتابة سطر مُزاح (بمسافات) داخل الكتلة');
      stk.push(L[k+1].i);const h=t.slice(0,-1).trim();
      if(m=h.match(/^def\s+([^\s(]+)\s*\((.*)\)$/))o.push('function '+m[1]+'('+m[2]+'){'+ho(bs[k]));
      else if(m=h.match(/^(if|elif|while)\s+(.+)$/))o.push((m[1]=='elif'?'else if':m[1])+'('+ex(m[2])+'){');
      else if(h=='else')o.push('else{');
      else if(m=h.match(/^for\s+(.+?)\s+in\s+(.+)$/))o.push('for(let '+(m[1].includes(',')?'['+m[1]+']':m[1])+' of '+ex(m[2])+'){');
      else throw new Error('صياغة غير مدعومة: '+t.replace(/\u0001(\d+)\u0002/g,(x,i)=>S[i]));
    }else if(/^global\s/.test(t)){}
    else if(t=='pass')o.push(';');
    else if((m=t.match(AS))&&m[1].includes(','))o.push('['+m[1]+']=['+ex(m[2])+'];');
    else o.push(ex(t)+';');
  });
  while(stk.length>1){stk.pop();o.push('}')}
  return o.join('\n').replace(/\u0001(\d+)\u0002/g,(m,i)=>S[i]);
}

function exec(js,lang,P){
  new Function('console','__p',PRE[lang]+'return (function(){'+js+'\n})()')({log:P,info:P,warn:P,error:P},P);
}

function arErr(e){
  const m=e&&e.message||String(e);let r;
  if(r=m.match(/^(.+?) is not defined/))return '«'+r[1]+'» غير معرّف — تأكد من كتابته وتعريفه قبل استخدامه';
  if(r=m.match(/Unexpected identifier '?([^']*)'?/))return 'كلمة غير متوقعة «'+r[1]+'» — راجع السطر أو ما قبله';
  if(/Assignment to constant/.test(m))return 'لا يمكن تغيير قيمة «ثابت» بعد تعريفها';
  if(r=m.match(/^(.+?) is not a function/))return '«'+r[1]+'» ليست دالة ولا يمكن استدعاؤها';
  if(/before initialization/.test(m))return 'استخدام متغير قبل تعريفه: '+m;
  if(e instanceof SyntaxError)return 'خطأ في كتابة الكود (أقواس أو رموز ناقصة أو زائدة): '+m;
  return m;
}

/*UI*/
const T={
dhad:'عرف الاسم = ادخل("ما هو اسمك؟");\nاكتب("مرحباً بك يا " + الاسم + " في لغة الضاد! ✨");\n\nكرر ٣ مرة {\n  اكتب("سطر من الحلقة");\n}\n\nدالة مربع(س) {\n  ارجع س * س;\n}\nاكتب("مربع 7 = " + مربع(7));\n\nاذا (مربع(3) > 5 و صح) {\n  اكتب("تم التحقق من الشروط 🚀");\n} والا {\n  اكتب("لم يتحقق الشرط");\n}',
python:'def square(x):\n    return x * x\n\nfor i in range(3):\n    print("رقم", i, "مربعه", square(i))\n\ntotal = 0\nfor n in [1, 2, 3, 4]:\n    total += n\nprint(f"المجموع = {total}")\n\nif total > 5 and total < 20:\n    print("داخل النطاق")\nelse:\n    print("خارج النطاق")',
javascript:'console.log("Hello from JavaScript! ⚡");\n\nlet num = 10;\nif (num > 5) {\n  console.log("Number is greater than 5");\n}',
web:'<!DOCTYPE html>\n<html dir="rtl">\n<head>\n<style>\n  body { background: #11111b; color: white; text-align: center; padding-top: 50px; font-family: sans-serif; }\n  h1 { color: #00adb5; }\n</style>\n</head>\n<body>\n  <h1>صفحة ويب مخصصة ومتكاملة! 🌐</h1>\n</body>\n</html>'};
const LBL={dhad:'لغة الضاد',python:'Python',javascript:'JavaScript',web:'HTML و CSS'};
const $=id=>document.getElementById(id);
const ed=$('code-editor'),out=$('output-text'),frame=$('output-frame');
let lang='dhad';

function fm(v){
  if(typeof v==='boolean')return lang==='python'?(v?'True':'False'):lang==='dhad'?(v?'صح':'غلط'):String(v);
  if(v===null||v===undefined)return lang==='python'?'None':String(v);
  if(Array.isArray(v))return '['+v.map(x=>typeof x==='string'?"'"+x+"'":fm(x)).join(', ')+']';
  if(typeof v==='object'){try{return JSON.stringify(v)}catch(e){}}
  return String(v);
}
function line(t,c){const d=document.createElement('div');d.dir='auto';if(c)d.className=c;d.textContent=t;out.appendChild(d)}
function setLang(l){
  lang=l;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  ed.value=T[l];ed.dir=l==='dhad'?'rtl':'ltr';
  $('editor-label').textContent='✍️ اكتب كود «'+LBL[l]+'» هنا:';
  const w=l==='web';document.body.classList.toggle('web-mode',w);$('newtab').hidden=!w;out.style.display='block';frame.style.display=w?'block':'none';frame.srcdoc='';
  out.innerHTML='';line(w?'الكونسول: رسائل console.log وأخطاء JavaScript من صفحتك تظهر هنا.':'النتيجة ستظهر هنا بعد الضغط على تشغيل الكود…','hint');
  if(typeof upd==='function')upd();
}
const SPY="<script>(function(){var s=function(t,m){parent.postMessage({dhad:1,t:t,m:String(m)},'*')};['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){var a=[].slice.call(arguments).map(function(x){try{return typeof x==='object'?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(' ');s(k,a);o.apply(console,arguments)}});addEventListener('error',function(e){s('error',e.message+(e.lineno?' (سطر '+e.lineno+')':''))});addEventListener('unhandledrejection',function(e){s('error',e.reason)})})()<\/script>";
function inject(c){let m;
  if(m=c.match(/<head[^>]*>/i))return c.replace(m[0],m[0]+SPY);
  if(m=c.match(/<html[^>]*>/i))return c.replace(m[0],m[0]+SPY);
  if(m=c.match(/^\s*<!doctype[^>]*>/i))return c.replace(m[0],m[0]+SPY);
  return SPY+c}
addEventListener('message',e=>{const d=e.data;if(lang==='web'&&d&&d.dhad&&e.source===frame.contentWindow)line((d.t==='error'?'⚠️ ':'')+d.m,d.t==='error'?'err':'')});
$('newtab').addEventListener('click',()=>{window.open(URL.createObjectURL(new Blob([ed.value],{type:'text/html'})),'_blank')});
function run(){
  const code=ed.value;
  if(lang==='web'){out.innerHTML='';frame.srcdoc=inject(code);return}
  out.innerHTML='';
  if(!code.trim()){line('اكتب الكود أولاً.','err');return}
  const P=(...a)=>line(a.map(fm).join(' '));
  try{
    exec(lang==='dhad'?dhad(code):lang==='python'?py(code):code,lang,P);
    if(!out.childElementCount)line('تم التنفيذ بنجاح ✅ (لا توجد مخرجات)','hint');
  }catch(e){line('🚨 '+arErr(e),'err')}
}
document.querySelector('.tabs-container').addEventListener('click',e=>{const b=e.target.closest('.tab-btn');if(b&&b.dataset.lang)setLang(b.dataset.lang)});
$('run').addEventListener('click',run);
ed.addEventListener('keydown',e=>{
  if(e.key==='Tab'){e.preventDefault();ed.setRangeText('    ',ed.selectionStart,ed.selectionEnd,'end')}
  if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run()}
});
let dp;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('install').hidden=false});
$('install').addEventListener('click',async()=>{if(!dp)return;dp.prompt();await dp.userChoice;dp=null;$('install').hidden=true});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
setLang('dhad');
