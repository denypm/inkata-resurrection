# shared HTML shell for seamless-loop reels
def page(title_lines, body_js, bg='#152A3A'):
    lines=''
    for i,(html,top) in enumerate(title_lines):
        lines+=f'<div class="ln gh" id="l{i+1}" style="top:{top}px;font-size:76px;line-height:1.05;color:#F1E6D2">{html}</div>\n'
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Gochi+Hand&family=Inter:wght@600;800&display=block" rel="stylesheet">
<script src="lib.js"></script>
<style>html,body{{margin:0}}#post{{width:1080px;height:1920px;position:relative;overflow:hidden;background:{bg}}}
svg{{position:absolute;inset:0}}.ln{{position:absolute;left:60px;right:60px;text-align:center;opacity:0;text-shadow:0 4px 18px rgba(0,0,0,.35)}}
.gh{{font-family:'Gochi Hand'}}.px{{font-family:'Press Start 2P';font-size:50px;color:#F7C65A;text-shadow:5px 5px 0 #C8321E}}
.hl{{color:#F7C65A;background:#C8321E;padding:0 16px;border-radius:8px;text-shadow:none}}.hd{{font:800 32px Inter;color:#F7C65A;margin-top:22px;letter-spacing:1px}}</style>
</head><body><div id="post"><svg id="s" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>
{lines}</div><script>
const L=10,W0=2*Math.PI/L;const cl=x=>Math.max(0,Math.min(1,x));
const pn=(t,ks,ph)=>{{let v=0,a=0;ks.forEach((k,i)=>{{const w=1/(i+1);v+=Math.sin(W0*k*t+ph+i*1.7)*w;a+=w}});return v/a}};
const mod=(a,b)=>((a%b)+b)%b;
const seg=(t,a,b)=>cl(Math.min((t-a)/.4,(b-t)/.4));
{body_js}
render(0);
</script></body></html>'''
