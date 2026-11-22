import numpy as np, wave, sys
SR=44100; L=10.0; N=int(SR*L); mix=np.zeros(N)
def env(n,att=.005,rel=.06):
    t=np.arange(n)/SR; d=n/SR; return np.minimum(1,t/att)*np.clip((d-t)/rel,0,1)
def sq(f,d,duty=.5,vol=.1,rel=.06):
    n=int(SR*d); t=np.arange(n)/SR; return np.where((t*f)%1<duty,1.,-1.)*env(n,rel=rel)*vol
def tri(f,d,vol=.2,rel=.06):
    n=int(SR*d); t=np.arange(n)/SR; return (2*np.abs(2*((t*f)%1)-1)-1)*env(n,rel=rel)*vol
def put(sig,at):
    i=int(at*SR)%N; j=i+len(sig)
    if j<=N: mix[i:j]+=sig
    else: k=N-i; mix[i:]+=sig[:k]; mix[:j-N]+=sig[k:]   # wrap around -> seamless
nt=lambda m:440*2**((m-69)/12)
e=.25  # 120 bpm eighths, 5 bars x 2 s = 10 s
prog=[(48,[60,64,67]),(43,[59,62,67]),(45,[57,60,64]),(41,[57,60,65]),(43,[59,62,65])]
for b,(root,ch) in enumerate(prog):
    for k in range(8):
        tt=b*2+k*e
        put(tri(nt(root+(12 if k in(2,6) else 0)),e*.85,.16),tt)
        put(sq(nt(ch[k%3]+12),e*.5,.25,.035),tt)
        if k%2==1: put(sq(nt(ch[(k//2)%3]+24),e*.35,.125,.018),tt)
# gentle lead motif (original), repeats each 2 bars
mot=[(72,0,.5),(74,.5,.25),(76,.75,.75),(79,1.5,.5),(76,2.25,.25),(74,2.5,.5),(72,3.0,1.0)]
for rep in (0,4):
    for m,a,d in mot:
        if rep+a+d<=10: put(sq(nt(m),d*.9,.5,.045,rel=.12),rep+a)
put(sq(nt(79),.45,.5,.04,rel=.2),8.25); put(sq(nt(74),.5,.5,.04,rel=.2),8.75); put(sq(nt(71),.6,.5,.04,rel=.3),9.3)
# text-change blips
for at in (0.02,3.42,6.82):
    put(sq(nt(88),.05,.5,.09),at); put(sq(nt(95),.09,.5,.08,rel=.08),at+.06)
# soft candle crackle
rng=np.random.default_rng(7)
for at in rng.uniform(0,L,26):
    n=int(SR*.012); put(rng.uniform(-1,1,n)*np.linspace(1,0,n)*.05,at)
mix=mix/np.max(np.abs(mix))*.8
with wave.open(sys.argv[1],'w') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes())
