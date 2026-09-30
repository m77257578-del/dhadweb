FAQ.push(...[
['مصفوفه مصفوفات قائمه قوائم array list','المصفوفة تحفظ عدة قيم:\nعرف الارقام = [1, 2, 3];\nاكتب(الارقام[0]); // 1\nالارقام.push(4); // إضافة عنصر\nوفي Python: nums = [1, 2, 3] ثم nums.append(4)'],
['نص نصوص سلسله string حروف','النص يُكتب بين علامتي اقتباس: عرف الاسم = "علي";\nللدمج: "مرحباً " + الاسم\nلطوله: الاسم.length'],
['عمليه عمليات جمع طرح ضرب قسمه باقي','العمليات: + جمع، - طرح، * ضرب، / قسمة، % باقي القسمة.\nمثال: اكتب(7 % 2); // 1'],
['نوع انواع بيانات رقم منطقي','الأنواع الأساسية: أرقام (5)، نصوص ("علي")، منطقية (صح / غلط)، مصفوفات ([1,2])، وكائنات.'],
['تكرار ذاتي recursion استدعاء','الاستدعاء الذاتي: دالة تنادي نفسها حتى تصل لحالة توقف.\nدالة مضروب(ن) {\n  اذا (ن <= 1) { ارجع 1; }\n  ارجع ن * مضروب(ن - 1);\n}'],
['خوارزميه algorithm','الخوارزمية خطوات واضحة مرتبة لحل مشكلة، مثل: ابحث عن أكبر رقم بمقارنة كل رقم بأكبر رقم وجدته حتى الآن.'],
['تصحيح debug اخطاء تتبع','نصائح لإيجاد الخطأ: اقرأ رسالة الخطأ وسطرها، اطبع القيم بـ اكتب(...) لتراها، جرّب جزءاً صغيراً من الكود، وتأكد من الأقواس {} والاقتباس. ويمكنك ضغط «صحّح أخطائي».'],
['html وسم وسوم صفحه ويب','HTML يبني هيكل الصفحة بوسوم مثل <h1> للعنوان و<p> للفقرة و<a> للرابط و<img> للصورة و<button> للزر. كل وسم مفتوح يحتاج وسماً ختامياً مثل </p>.'],
['css تنسيق الوان خط','CSS ينسّق الصفحة:\nh1 { color: red; font-size: 30px; }\nالخاصية color للون، وbackground للخلفية، وpadding للحشو، وmargin للهامش.'],
['فرق جافاسكريبت بايثون javascript','JavaScript تستخدم الأقواس {} وتعمل في المتصفح، وPython تعتمد على المسافات وتُكتب أبسط. ولغة الضاد تُترجم إلى JavaScript.'],
['تعلم ابدا بداية مبتدئ البرمجه','ابدأ بالترتيب: المتغيرات ← الشروط ← الحلقات ← الدوال ← المصفوفات، وجرّب مثالاً صغيراً في كل خطوة. أمثلة القاموس 📖 مناسبة كبداية.'],
['كائن كائنات object قاموس dict','الكائن يجمع قيماً بأسمائها:\nعرف شخص = { اسم: "علي", عمر: 20 };\nاكتب(شخص.اسم);\nوفي Python: p = {"name": "Ali"}'],
['ذكاء محلي نموذج اونلاين انترنت','اضغط زر ⚡ أعلى نافذة المساعد لتفعيل الذكاء المحلي: نموذج صغير يُنزَّل مرة واحدة ثم يعمل على معالج جهازك. وبدونه أجيب من قاعدة جاهزة وأبحث في ويكيبيديا.']
].map(([k,a])=>[nz(k).split(' '),a]));

const STOP=new Set('ما هو هي معنى كيف ماذا لماذا استخدم اشرح شرح عن في من هل لي انا اريد ممكن'.split(' '));
function kbSearch(q){
  const n=nz(q),toks=n.split(/[^\p{L}\p{N}_]+/u).filter(Boolean),core=toks.filter(t=>!STOP.has(t)),o=[];
  const e=DICT.find(e=>[e.ar,...(e.alt||[])].some(k=>k.length>2&&toks.includes(nz(k))));
  if(e&&core.length<=1)o.push({s:9,a:'«'+e.ar+'» تقابل «'+e.js+'» في JavaScript.\n'+e.d+'\nمثال:\n'+e.ex});
  FAQ.forEach(([ks,a])=>{const s=ks.filter(k=>k.length>2&&toks.some(t=>t.includes(k))).length;if(s)o.push({s,a})});
  return o.sort((x,y)=>y.s-x.s).slice(0,2);
}

const jf=u=>fetch(u,{signal:AbortSignal.timeout(8000)}).then(r=>r.json());
async function wiki(lang,q){
  const r=await jf('https://'+lang+'.wikipedia.org/w/api.php?action=query&list=search&srlimit=2&format=json&origin=*&srsearch='+encodeURIComponent(q));
  const out=[];
  for(const h of ((r.query&&r.query.search)||[]).slice(0,2)){
    try{
      const s=await jf('https://'+lang+'.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(h.title));
      if(s.extract)out.push({t:s.title,x:s.extract.slice(0,500),u:s.content_urls&&s.content_urls.desktop&&s.content_urls.desktop.page});
    }catch(e){}
  }
  return out;
}
function webSearch(q){
  const c=q.replace(/^(ابحث(ي)?( لي)?( عن)?|بحث( عن)?|ما (هو|هي|معنى)|ماذا تعني|من (هو|هي)|عرّف|عرف|اشرح( لي)?)\s+/,'').replace(/[؟?]/g,'').trim();
  return wiki(/[\u0600-\u06FF]/.test(c)?'ar':'en',c||q);
}
function links(b,res){
  (res||[]).forEach(r=>{if(!r.u)return;b.appendChild(document.createElement('br'));const a=document.createElement('a');a.href=r.u;a.target='_blank';a.rel='noopener';a.textContent='🔗 '+r.t+' — ويكيبيديا';a.style.color='#4fc1ff';b.appendChild(a)});
}

let gen=null,loading=false,TS=null;
const AIURL='https://cdn.jsdelivr.net/npm/@huggingface/transformers@4',MODEL='onnx-community/Qwen3-0.6B-ONNX';
const clean=t=>t.replace(/<think>[\s\S]*?(<\/think>|$)/g,'').trim();
async function loadAI(){
  if(gen||loading)return;loading=true;
  const b=say('⏳ جاري تحميل النموذج… 0%','bot'),files={};
  const cb=p=>{
    if(p.file&&p.total)files[p.file]=[p.loaded||0,p.total];
    const v=Object.values(files),t=v.reduce((a,x)=>a+x[1],0);
    if(t)b.textContent='⏳ جاري تحميل النموذج… '+Math.min(100,Math.round(v.reduce((a,x)=>a+x[0],0)/t*100))+'%';
  };
  try{
    const M=await import(AIURL);TS=M.TextStreamer;
    const opt=d=>({device:d,dtype:d==='webgpu'?'q4f16':'q4',progress_callback:cb});
    try{if(!navigator.gpu)throw 0;gen=await M.pipeline('text-generation',MODEL,opt('webgpu'))}
    catch(e){b.textContent='⏳ جاري التحميل بوضع المعالج (أبطأ)…';gen=await M.pipeline('text-generation',MODEL,opt('wasm'))}
    b.textContent='✅ الذكاء المحلي جاهز، ويعمل على معالج جهازك. اسألني ما شئت.';
    try{localStorage.setItem('dhad_ai','1')}catch(e){}
  }catch(e){
    b.textContent='تعذّر تحميل النموذج: '+(e&&e.message||e)+'\nقد لا يدعمه جهازك أو متصفحك، أو لا يوجد اتصال. سأكمل بالإجابات الجاهزة والبحث.';
  }
  loading=false;
}
async function llm(q,ctx){
  const code=ed.value.trim().slice(0,1200);
  const msgs=[
    {role:'system',content:'أنت مساعد برمجة ودود داخل «محرر لغة الضاد». أجب بالعربية بإيجاز ووضوح (٣ إلى ٦ أسطر). استعن بالسياق إن كان مفيداً، وإذا لم تكن متأكداً فقل ذلك ولا تخترع معلومات. لغة الضاد لغة عربية تُترجم إلى JavaScript.'},
    {role:'user',content:(ctx?'السياق:\n'+ctx+'\n\n':'')+(code&&/كود|الكود|برنامج|سطر|خطا|شفر/.test(nz(q))?'كود المستخدم ('+LBL[lang]+'):\n'+code+'\n\n':'')+'السؤال: '+q+' /no_think'}
  ];
  const b=say('…','bot');let txt='';
  try{
    const out=await gen(msgs,{max_new_tokens:350,do_sample:false,repetition_penalty:1.1,
      streamer:new TS(gen.tokenizer,{skip_prompt:true,skip_special_tokens:true,callback_function:t=>{txt+=t;b.textContent=clean(txt)||'…';alog.scrollTop=alog.scrollHeight}})});
    b.textContent=clean(out[0].generated_text.at(-1).content)||clean(txt)||'لم أستطع صياغة إجابة.';
  }catch(e){b.textContent='حدث خطأ أثناء التوليد: '+(e&&e.message||e)}
  return b;
}
async function reply(q){
  const n=nz(q),web=/ابحث|بحث|search|ويكي/.test(n);
  if(/^(مرحبا|اهلا|السلام|هلا|صباح|مساء)/.test(n)&&n.split(' ').length<4)return say('أهلاً بك! اسألني عن البرمجة أو اضغط «صحّح أخطائي» لأفحص كودك 🤖','bot');
  if(!web&&/صحح|اصلح|خطا|اخطا|مشكل|لا يعمل|فحص|راجع/.test(n))return doCheck();
  const kb=kbSearch(q),top=kb[0];
  if(!web&&top&&(top.s>=2||!gen))return say(top.a,'bot');
  let res=null,note=null;
  if(web||!top){
    note=say('🔎 أبحث…','bot');
    try{res=await webSearch(q)}catch(e){res=null}
    note.remove();
  }
  if(gen){
    const ctx=[...kb.map(k=>k.a),...(res||[]).map(r=>r.t+': '+r.x)].join('\n---\n').slice(0,1800);
    const b=await llm(q,ctx);links(b,res);return;
  }
  if(res&&res.length){const b=say(res.map(r=>r.t+':\n'+r.x).join('\n\n'),'bot');links(b,res);return}
  if(top)return say(top.a,'bot');
  say(res===null?'تعذّر البحث (لا اتصال بالإنترنت أو الشبكة تمنعه) 🌐\nجرّب «⚡» أعلى النافذة لتفعيل الذكاء المحلي، أو اسألني عن كلمة مثل «اذا» أو «كرر».':'لم أجد نتيجة مناسبة 🤔\nجرّب صياغة أخرى، أو فعّل الذكاء المحلي بزر «⚡» أعلى النافذة.','bot');
}
$('ai-power').onclick=()=>{
  aiEl.hidden=false;
  if(gen)return say('الذكاء المحلي يعمل بالفعل ✅','bot');
  const b=say('⚡ لتفعيل الذكاء المحلي سأنزّل نموذجاً صغيراً (Qwen3-0.6B، مئات الميجابايت) مرة واحدة يُخزَّن على جهازك، ثم يعمل بمعالج جهازك بلا إنترنت. النماذج الصغيرة قد تخطئ وقد تكون بطيئة على بعض الهواتف. يُفضّل الاتصال بشبكة Wi-Fi.','bot');
  const c=document.createElement('button');c.textContent='تحميل وتفعيل';c.onclick=()=>{c.remove();loadAI()};
  b.append(document.createElement('br'),c);
};
$('ai-open').addEventListener('click',()=>{try{if(localStorage.getItem('dhad_ai'))loadAI()}catch(e){}});
