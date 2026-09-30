const aiEl=$('ai'),alog=$('ai-log'),aq=$('ai-q');
const nz=s=>s.replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').toLowerCase();
const FAQ=[
['الضاد ضاد تعريف ايش','لغة الضاد لغة برمجة عربية تعليمية: تكتب أوامرها بالعربية فتُترجم فوراً إلى JavaScript وتعمل داخل متصفحك. التفاصيل في صفحة 📖 القاموس.'],
['هدف اهداف فايده لماذا ليش','هدفها تقريب البرمجة لمن لا يتقن الإنجليزية، وتعلّم المتغيرات والشروط والحلقات والدوال بلغتك، ثم الانتقال بسهولة إلى JavaScript.'],
['حلقه حلقات تكرار كرر طالما لكل','للتكرار عدداً محدداً:\nكرر ٣ مرة {\n  اكتب("هيا");\n}\nوللتكرار بشرط:\nطالما (س < 5) {\n  س++;\n}'],
['شرط شروط اذا والا مقارنه','عرف س = 7;\nاذا (س > 5) {\n  اكتب("كبير");\n} والا {\n  اكتب("صغير");\n}\nللمقارنة استخدم == وليس =، وللربط: و / أو / ليس.'],
['دال دوال وظيفه','دالة مربع(س) {\n  ارجع س * س;\n}\nاكتب(مربع(4));'],
['متغير متغيرات ثابت','عرف العمر = 20;\nثابت الاسم = "علي";\nالمتغير يمكن تغييره، أما الثابت فلا.'],
['طباعه اطبع اظهار عرض','اكتب("مرحباً");\nويمكنك طباعة أكثر من قيمة: اكتب("العمر:", 20);'],
['ادخال اسال سؤال مستخدم','عرف الاسم = ادخل("ما اسمك؟");\nاكتب("أهلاً " + الاسم);'],
['بايثون python','تبويب Python يدعم: def وfor/range وif/elif/else وwhile وf-strings والقوائم. ولا يدعم import وclass وtry، وأخبرك بذلك بالعربية عند استخدامها.'],
['قاموس كلمات مفتاحيه قواعد','كل الكلمات المفتاحية وقواعد اللغة وأمثلتها في صفحة 📖 القاموس (الرابط أعلى المحرر).'],
['تثبيت تطبيق شاشه','من Chrome اضغط زر «تثبيت التطبيق» أعلى الصفحة أو من القائمة اختر «تثبيت التطبيق». وفي iPhone: مشاركة ← إضافة إلى الشاشة الرئيسية.']
].map(([k,a])=>[nz(k).split(' '),a]);
function say(t,who,fixed){
  const d=document.createElement('div');d.className='m '+who;d.textContent=t;
  if(fixed!==undefined){
    d.appendChild(document.createElement('br'));
    const b=document.createElement('button');b.textContent='✅ طبّق التصحيحات';
    b.onclick=()=>{ed.value=fixed;upd();b.remove();say('تم تطبيق التصحيحات. اضغط «تشغيل» لتجربة الكود.','bot')};
    d.appendChild(b);
  }
  alog.appendChild(d);alog.scrollTop=alog.scrollHeight;return d;
}
const SR=/"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/g;
const oS=(l,f)=>l.split(/("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)/).map((p,j)=>j%2?p:f(p)).join('');
const EA={'console.log':'اكتب',print:'اكتب',let:'عرف',var:'عرف',const:'ثابت','function':'دالة','return':'ارجع','if':'اذا','else':'والا','while':'طالما','true':'صح','false':'غلط',prompt:'ادخل'};
const AE={اكتب:'console.log',عرف:'let',ثابت:'const',دالة:'function',ارجع:'return',اذا:'if',والا:'else',طالما:'while',صح:'true',غلط:'false'};
const PY={'true':'True','false':'False','null':'None','&&':'and','||':'or'};
const RE_EN=/(?<![\w.$])(console\.log|print|let|var|const|function|return|if|else|while|true|false|prompt)(?![\w$])/g;
const RE_AR=/(?<![\p{L}\p{N}_$])(اكتب|عرف|ثابت|دالة|ارجع|اذا|والا|طالما|صح|غلط)(?![\p{L}\p{N}_$])/gu;
const RE_PY=/\b(true|false|null)\b|&&|\|\|/g;
const COND=/((?:اذا|إذا|طالما|if|while|elif)\s*\([^()]*?[^=!<>])=(?![=>])/;
const COND_PY=/^(\s*(?:if|elif|while)\b[^=!<>]*[^=!<>])=(?!=)/;

function scan(code,lang){
  const iss=[],st=[],O={'(':')','[':']','{':'}'};let q=null,ql=0,ln=1;
  for(let i=0;i<code.length;i++){
    const c=code[i];
    if(c==='\n'){if(q&&q!=='`'){iss.push({ln:ql,m:'نص مفتوح بعلامة الاقتباس ('+q+') ولم يُغلق',q});q=null}ln++;continue}
    if(q){if(c==='\\')i++;else if(c===q)q=null;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;ql=ln;continue}
    if(lang==='python'?c==='#':(c==='/'&&code[i+1]==='/')){while(i<code.length&&code[i]!=='\n')i++;i--;continue}
    if(O[c])st.push({c,ln});
    else if(c===')'||c===']'||c==='}'){const t=st.pop();if(!t||O[t.c]!==c)iss.push({ln,m:'الرمز «'+c+'» زائد أو لا يطابق ما قبله'})}
  }
  if(q)iss.push({ln:ql,m:'نص مفتوح ولم يُغلق',q});
  st.forEach(t=>iss.push({ln:t.ln,m:'الرمز «'+t.c+'» فُتح ولم يُغلق (ينقص «'+O[t.c]+'»)',open:t.c}));
  return iss;
}
function lint(lang,code){
  const L=code.split('\n'),F=L.slice(),I=[];
  const add=(i,m,fn)=>{I.push({ln:i+1,m});if(fn)F[i]=fn(F[i])};
  if(lang==='web'){
    const V=/^(br|img|meta|link|input|hr|area|base|col|embed|source|track|wbr|!doctype)$/i,st=[];
    L.forEach((l,i)=>{for(const m of l.matchAll(/<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g)){
      const c=m[1],t=m[2];if(V.test(t)||m[3])continue;
      if(!c)st.push({t,ln:i+1});
      else{const k=st.map(x=>x.t.toLowerCase()).lastIndexOf(t.toLowerCase());
        if(k<0)I.push({ln:i+1,m:'الوسم الختامي </'+t+'> بلا وسم افتتاحي'});
        else{const inn=st.splice(k).slice(1);inn.forEach(x=>I.push({ln:x.ln,m:'الوسم <'+x.t+'> لم يُغلق'}));if(inn.length)F[i]=F[i].replace('</'+t+'>',inn.reverse().map(x=>'</'+x.t+'>').join('')+'</'+t+'>');}}
    }});
    st.forEach(x=>I.push({ln:x.ln,m:'الوسم <'+x.t+'> لم يُغلق'}));
    [...st].reverse().forEach(x=>F.push('</'+x.t+'>'));
    return {I,F:F.join('\n')};
  }
  L.forEach((line,i)=>{
    const M=line.replace(SR,'""').replace(lang==='python'?/#.*/:/\/\/.*/,'');
    if(COND.test(M)||(lang==='python'&&COND_PY.test(M)))add(i,'تستخدم «=» (تخصيص) داخل الشرط؛ للمقارنة استخدم «==»',s=>s.replace(COND,'$1==').replace(lang==='python'?COND_PY:/$^/,'$1=='));
    const seen=[];
    if(lang==='dhad'){
      oS(line,p=>p.replace(RE_EN,w=>(seen.push(w),w)));
      if(seen.length)add(i,'كلمات إنجليزية في لغة الضاد: '+[...new Set(seen)].map(w=>'«'+w+'» ← «'+EA[w]+'»').join('، '),s=>oS(s,p=>p.replace(RE_EN,w=>EA[w])));
      if(/^\s*كرر(?![\p{L}\p{N}_])/u.test(M)&&!/مرة/.test(M))add(i,'صيغة التكرار: كرر ٣ مرة { … } — تنقص كلمة «مرة»',/\{/.test(M)?s=>s.replace(/\s*\{/,' مرة {'):null);
      if(/^\s*اكتب\s+[^(\s]/.test(M))add(i,'«اكتب» تحتاج أقواساً: اكتب(...)',s=>s.replace(/^(\s*)اكتب\s+(.*?);?\s*$/,'$1اكتب($2);'));
    }else if(lang==='javascript'){
      oS(line,p=>p.replace(RE_AR,w=>(seen.push(w),w)));
      if(seen.length)add(i,'كلمات من لغة الضاد داخل JavaScript: '+[...new Set(seen)].map(w=>'«'+w+'» ← «'+AE[w]+'»').join('، '),s=>oS(s,p=>p.replace(RE_AR,w=>AE[w])));
    }else{
      oS(line,p=>p.replace(RE_PY,w=>(seen.push(w),w)));
      if(seen.length)add(i,'كلمات JavaScript داخل Python: '+[...new Set(seen)].map(w=>'«'+w+'» ← «'+PY[w]+'»').join('، '),s=>oS(s,p=>p.replace(RE_PY,w=>PY[w])));
      if(/^\s*(if|elif|else|for|while|def)\b/.test(M)&&!/:\s*$/.test(M)&&M.split('(').length===M.split(')').length)add(i,'تنقص النقطتان «:» في نهاية السطر',line.includes('#')?null:s=>s.trimEnd()+':');
      if(/^\s*print\s+[^(=\s]/.test(M))add(i,'في Python يجب استخدام الأقواس: print(...)',s=>s.replace(/^(\s*)print\s+(.*)$/,'$1print($2)'));
    }
  });
  const all=scan(code,lang),ql=new Set(all.filter(x=>x.q).map(x=>x.ln)),sc=all.filter(x=>!(x.open&&ql.has(x.ln)));let braces=0;
  sc.forEach(x=>{I.push({ln:x.ln,m:x.m});if(x.q)F[x.ln-1]=F[x.ln-1].replace(/([);\]}\s]*)$/,x.q+'$1');else if(x.open==='{'&&lang!=='python')braces++});
  for(let k=0;k<braces;k++)F.push('}');
  if(lang==='python'){L.forEach((l,i)=>{const M=l.replace(SR,'""').replace(/#.*/,'');
    if(/:\s*$/.test(M)&&/^\s*(if|elif|else|for|while|def)\b/.test(M)){let j=i+1;while(j<L.length&&!L[j].trim())j++;
      if(j<L.length&&L[j].search(/\S/)<=l.search(/\S/))I.push({ln:j+1,m:'يجب إزاحة السطر بعد النقطتين «:» (4 مسافات)'})}})}
  if(!I.length){
    try{const js=lang==='dhad'?dhad(code):lang==='python'?py(code):code;new Function('console','__p',PRE[lang]+'return (function(){'+js+'\n})()')}
    catch(e){I.push({ln:0,m:arErr(e)+' (راجع السطر المذكور وما قبله)'})}
  }
  return {I,F:F.join('\n')};
}
function doCheck(){
  const code=ed.value;
  if(!code.trim())return say('اكتب كوداً في المحرر أولاً ثم اطلب مني فحصه.','bot');
  const r=lint(lang,code);
  if(!r.I.length)return say('لم أجد أخطاء ظاهرة في كودك ✅\n(أفحص الصياغة والأخطاء الشائعة فقط، ولا أكتشف أخطاء المنطق.)','bot');
  say('وجدت '+r.I.length+' ملاحظة:\n'+r.I.map(i=>'• '+(i.ln?'سطر '+i.ln+': ':'')+i.m).join('\n'),'bot',r.F!==code?r.F:undefined);
}
function localReply(q){
  const n=nz(q),toks=n.split(/[^\p{L}\p{N}_]+/u).filter(Boolean);
  if(/صحح|اصلح|خطا|اخطا|مشكل|لا يعمل|فحص|راجع/.test(n))return doCheck();
  const e=DICT.find(e=>[e.ar,...(e.alt||[])].some(k=>k.length>2&&toks.includes(nz(k))));
  if(e)return say('«'+e.ar+'» تقابل «'+e.js+'» في JavaScript.\n'+e.d+'\nمثال:\n'+e.ex,'bot');
  let best=null,bs=0;
  FAQ.forEach(([ks,a])=>{const s=ks.filter(k=>k.length>2&&toks.some(t=>t.includes(k))).length;if(s>bs){bs=s;best=a}});
  say(best||'لم أفهم سؤالك تماماً 🤔\nجرّب أن تسألني عن كلمة مثل «اذا» أو «كرر»، أو عن الشروط والحلقات والدوال، أو اضغط «صحّح أخطائي» لأفحص كودك.','bot');
}
function send(q){q=(q||aq.value).trim();if(!q)return;say(q,'me');aq.value='';setTimeout(()=>reply(q),250)}
['🔍 صحّح أخطائي','ما هي لغة الضاد؟','كيف أكتب حلقة؟','كيف أكتب شرطاً؟'].forEach(t=>{
  const b=document.createElement('button');b.textContent=t;b.onclick=()=>send(t);$('ai-chips').appendChild(b);
});
$('ai-open').onclick=()=>{aiEl.hidden=false;if(!alog.childElementCount)say('أهلاً! أنا مساعد لغة الضاد 🤖\nأجيب عن أسئلتك وأفحص كودك وأصحح الأخطاء الشائعة. أعمل بقواعد جاهزة داخل جهازك بلا إنترنت.','bot');aq.focus()};
$('ai-x').onclick=()=>{aiEl.hidden=true};
$('ai-send').onclick=()=>send();
aq.addEventListener('keydown',e=>{if(e.key==='Enter')send()});
