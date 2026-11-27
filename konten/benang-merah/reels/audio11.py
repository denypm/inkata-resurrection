import numpy as np, wave, sys
SR=44100; L=10.0; N=int(SR*L); mix=np.zeros(N)
def env(n,att=.05,rel=.4):
    t=np.arange(n)/SR; d=n/SR; return np.minimum(1,t/att)*np.clip((d-t)/rel,0,1)
def tri(f,d,vol=.2,att=.05,rel=.4):
    n=int(SR*d); t=np.arange(n)/SR; return (2*np.abs(2*((t*f)%1)-1)-1)*env(n,att,rel)*vol
def sine(f,d,vol=.1,att=.3,rel=1.0):
    n=int(SR*d); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*env(n,att,rel)*vol
def put(sig,at):
    i=int((at%L)*SR); j=i+len(sig)
    if j<=N: mix[i:j]+=sig
    else: k=N-i; mix[i:]+=sig[:k]; mix[:j-N]+=sig[k:]
nt=lambda m:440*2**((m-69)/12)
# slow minor drone pads (A minor -> F -> D minor -> E), 2.5 s each
for i,ch in enumerate([[57,60,64],[53,57,60],[50,53,57],[52,56,59]]):
    for m in ch: put(sine(nt(m),3.2,.06,att=.6,rel=1.2),i*2.5)
    put(tri(nt(ch[0]-24),3.0,.12,att=.3,rel=1.0),i*2.5)
# sparse sad melody
for m,a,d in [(76,0.3,1.4),(74,1.8,.7),(72,2.6,1.8),(69,5.0,1.2),(71,6.3,.8),(72,7.2,1.0),(64,8.3,1.6)]:
    put(tri(nt(m),d,.07,att=.05,rel=.6),a)
# distant crowd murmur + fire crackle, seamless
rng=np.random.default_rng(11); M=SR
w=rng.uniform(-1,1,N+M)
for k in (25,25,25): w=np.convolve(w,np.ones(k)/k,'same')
f=np.linspace(0,1,M); w[:M]=w[:M]*f+w[N:N+M]*(1-f); w=w[:N]
tt=np.arange(N)/SR; w*=0.7+0.3*np.sin(2*np.pi*tt*2/L)**2
mix+=w/np.max(np.abs(w))*.10
for at in rng.uniform(0,L,70):
    n=int(SR*rng.uniform(.004,.015)); put(rng.uniform(-1,1,n)*np.linspace(1,0,n)*rng.uniform(.03,.08),at)
mix=mix/np.max(np.abs(mix))*.8
with wave.open(sys.argv[1],'w') as o:
    o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((mix*32767).astype(np.int16).tobytes())
