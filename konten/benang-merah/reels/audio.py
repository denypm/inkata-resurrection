import numpy as np, wave, sys
SR=44100; DUR=11.0; N=int(SR*DUR); mix=np.zeros(N)
def sq(f,d,duty=.5,vol=.2,att=.005,rel=.05):
    t=np.arange(int(SR*d))/SR; w=np.where((t*f)%1<duty,1.0,-1.0)
    env=np.minimum(1,t/att)*np.minimum(1,(d-t)/rel); return w*env*vol
def tri(f,d,vol=.25,rel=.05):
    t=np.arange(int(SR*d))/SR; w=2*np.abs(2*((t*f)%1)-1)-1; env=np.minimum(1,(d-t)/rel); return w*env*vol
def put(sig,at):
    i=int(at*SR); j=min(N,i+len(sig)); mix[i:j]+=sig[:j-i]
def note(n): return 440*2**((n-69)/12)
def sweep(f0,f1,d,vol=.2):
    t=np.arange(int(SR*d))/SR; f=f0+(f1-f0)*t/d; ph=np.cumsum(f)/SR; w=np.where(ph%1<.5,1.,-1.); return w*vol*np.minimum(1,(d-t)/.03)
def noise(d,vol=.15,smooth=40):
    x=np.random.default_rng(1).uniform(-1,1,int(SR*d)); k=np.ones(smooth)/smooth; x=np.convolve(x,k,'same')
    t=np.arange(len(x))/SR; return x*np.sin(np.pi*t/d)*vol*4
# ignite
put(noise(.35,.05,8)*np.linspace(1,0,int(SR*.35)),.1)
# coin (SELAMAT) at .6
put(sq(note(83),.08,.5,.22),.6); put(sq(note(88),.35,.5,.22,rel=.3),.68)
# background loop 132bpm from .9 to 8.6
bpm=132; e=60/bpm/2; t0=.9
prog=[(48,[60,64,67]),(43,[59,62,67]),(45,[60,64,69]),(41,[60,65,69])]
t=t0; bar=0
while t<8.55:
    root,ch=prog[bar%4]
    for k in range(8):
        tt=t+k*e
        if tt>=8.55: break
        put(tri(note(root+(12 if k%4==2 else 0)),e*.9,.22),tt)
        put(sq(note(ch[k%3]+12),e*.45,.25,.055),tt)
        put(sq(note(ch[(k+1)%3]+24),e*.25,.125,.03),tt+e/2)
        if k%2==0: put(noise(.04,.04,2),tt)
    t+=8*e; bar+=1
# typewriter blips 1.4..3.8
TXT='kamu menemukan akun yang...'
for i,c in enumerate(TXT):
    if c!=' ': put(sq(1250+(i%3)*120,.03,.5,.08),1.4+i*(2.4/len(TXT)))
# pop Sulam 4.4
put(sweep(300,1000,.14,.2),4.4)
# whoosh 5.0-6.2
put(noise(1.2,.06,60),5.0)
# power-up 6.4
for i,n in enumerate([72,76,79,84,88,91,96]): put(sq(note(n),.06,.5,.16),6.4+i*.05)
put(sq(note(96),.3,.25,.12,rel=.25),6.75)
# score tick 6.5
put(sq(note(91),.05,.5,.12),6.5)
# end jingle 8.6
mel=[(79,.12),(81,.12),(84,.12),(88,.24),(86,.12),(84,.5)]
tt=8.62
for n,d in mel: put(sq(note(n),d,.5,.18),tt); put(tri(note(n-24),d,.2),tt); tt+=d
for n in [60,64,67,72]: put(sq(note(n+12),1.2,.25,.06,rel=1.0),tt)
put(tri(note(48),1.2,.25,rel=1.0),tt)
mix=mix/np.max(np.abs(mix))*.85
with wave.open(sys.argv[1],'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
