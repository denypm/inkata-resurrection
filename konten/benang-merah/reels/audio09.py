import numpy as np, wave, sys
SR=44100; L=10.0; N=int(SR*L); mix=np.zeros(N)
def env(n,att=.01,rel=.08):
    t=np.arange(n)/SR; d=n/SR; return np.minimum(1,t/att)*np.clip((d-t)/rel,0,1)
def sq(f,d,duty=.5,vol=.1,rel=.08):
    n=int(SR*d); t=np.arange(n)/SR; return np.where((t*f)%1<duty,1.,-1.)*env(n,rel=rel)*vol
def tri(f,d,vol=.2,rel=.08):
    n=int(SR*d); t=np.arange(n)/SR; return (2*np.abs(2*((t*f)%1)-1)-1)*env(n,rel=rel)*vol
def put(sig,at):
    i=int((at%L)*SR); j=i+len(sig)
    if j<=N: mix[i:j]+=sig
    else: k=N-i; mix[i:]+=sig[:k]; mix[:j-N]+=sig[k:]
nt=lambda m:440*2**((m-69)/12)
e=.25
prog=[(45,[57,60,64]),(41,[57,60,65]),(48,[55,60,64]),(43,[55,59,62]),(45,[57,60,64])]
for b,(r,ch) in enumerate(prog):
    for k in range(8):
        tt=b*2+k*e
        put(tri(nt(r+(12 if k in (2,6) else 0)),e*.85,.14),tt)
        put(sq(nt(ch[k%3]+12),e*.5,.25,.028),tt)
# falling motif: descending arpeggio every 2.5 s
for rep in range(4):
    for i,m in enumerate([88,84,81,76,72,69]): put(sq(nt(m),.11,.5,.05,rel=.06),rep*2.5+i*.1)
    put(sq(nt(64),.4,.5,.035,rel=.3),rep*2.5+.62)
# whistle sweeps (wind past ears)
for rep in range(5):
    n=int(SR*1.6); t=np.arange(n)/SR; f=1400-500*t/1.6; ph=np.cumsum(f)/SR
    put(np.sin(2*np.pi*ph)*np.sin(np.pi*t/1.6)**2*.025, rep*2+.3)
# continuous wind (seamless via crossfade)
rng=np.random.default_rng(3); M=int(SR*1.0); w=rng.uniform(-1,1,N+M)
for k in (60,60): w=np.convolve(w,np.ones(k)/k,'same')
fade=np.linspace(0,1,M); w[:M]=w[:M]*fade+w[N:N+M]*(1-fade); w=w[:N]
tt=np.arange(N)/SR; w*= (0.75+0.25*np.sin(2*np.pi*tt*3/L))
mix+=w/np.max(np.abs(w))*.12
mix=mix/np.max(np.abs(mix))*.8
with wave.open(sys.argv[1],'w') as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((mix*32767).astype(np.int16).tobytes())
