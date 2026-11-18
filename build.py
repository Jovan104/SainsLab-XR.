import base64,os,sys
import pathlib
ROOT=pathlib.Path(__file__).resolve().parent
SRC=str(ROOT/'src')+'/'
order=['core.js','viewer.js','engines/heart.js','engines/car.js','engines/plant.js','engines/electro.js','engines/motor.js','engines/orbit.js','engines/moto.js','engines/jet.js','engines/boat.js','engines/train.js','features.js','notes.js','planner.js','class.js','boot.js']
js=''
for f in order:
    p=SRC+f
    if os.path.exists(p): js+='\n'+open(p).read()
    elif f.startswith('engines/') and f!='engines/car.js':
        k=f.split('/')[1][:-3]
        js+=f'\nENGINES.{k}=Object.assign({{}},ENGINES.car,{{id:"{k}",vehicle:"{k}",name:"{k} (coming)"}});'
font=base64.b64encode(open(ROOT/'vendor'/'archivo-latin-wdth-normal.woff2','rb').read()).decode()
css=f"@font-face{{font-family:'Archivo Variable';font-style:normal;font-display:swap;font-weight:100 900;font-stretch:62% 125%;src:url(data:font/woff2;base64,{font}) format('woff2-variations')}}"
three=open(ROOT/'vendor'/'three.min.js').read()+'\n'+open(ROOT/'vendor'/'OrbitControls.js').read()
s=open(SRC+'index.html').read().replace('/*FONTS*/',css).replace('<!--THREE-->','<script>/* three.js r147 (MIT) + OrbitControls */\n'+three.replace('</script','<\\/script')+'\n</script>').replace('/*APP*/',js.replace('</script','<\\/script'))
open(ROOT/'index.html','w').write(s)
print(len(s))
