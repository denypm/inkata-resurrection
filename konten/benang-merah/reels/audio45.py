import numpy as np, wave, sys, json
SR=44100; L=10.0; N=int(SR*L)
def env(n,att=.005,rel=.06):
    t=np.arange(n)/SR; d=n/SR; return np.minimum(1,t/att)*np.clip((d-t)/rel,0,1)
def sq(f,d,duty=.5,vol=.1,rel=.06):
    n=int(SR*d); t=np.arange(n)/SR; return np.where((t*f)%1<duty,1.,-1.)*env(n,rel=rel)*vol
def tri(f,d,vol=.2,rel=.06):
    n=int(SR*d); t=np.arange(n)/SR; return (2*np.abs(2*((t*f)%1)-1)-1)*env(n,rel=rel)*vol
def sweep(f0,f1,d,vol=.1):
    n=int(SR*d); t=np.arange(n)/SR; ph=np.cumsum(f0+(f1-f0)*t/d)/SR; return np.where(ph%1<.5,1.,-1.)*vol*env(n,rel=.04)
nt=lambda m:440*2**((m-69)/12)
def mk():
    mix=np.zeros(N)
    def put(sig,at):
        i=int((at%L)*SR); j=i+len(sig)
        if j<=N: mix[i:j]+=sig
        else: k=N-i; mix[i:]+=sig[:k]; mix[:j-N]+=sig[k:]
    return mix,put
def save(mix,path):
    mix=mix/np.max(np.abs(mix))*.8
    with wave.open(path,'w') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes())
mode=sys.argv[1]
if mode=='04':
    mix,put=mk(); e=L/48  # 144 bpm, 6 bars
    prog=[(48,[60,64,67]),(45,[57,60,64]),(41,[57,60,65]),(43,[59,62,67]),(48,[60,64,67]),(43,[59,62,65])]
    for b,(r,ch) in enumerate(prog):
        for k in range(8):
            tt=(b*8+k)*e
            put(tri(nt(r+(12 if k%2 else 0)),e*.8,.15),tt)
            put(sq(nt(ch[k%3]+12),e*.45,.25,.03),tt)
            if k%2==0: put(np.random.default_rng(b*8+k).uniform(-1,1,int(SR*.025))*np.linspace(1,0,int(SR*.025))*.03,tt)
    mel=[72,74,76,79,76,74,72,74, 76,77,79,81,79,77,76,74, 72,76,79,84,79,76,74,72]
    for i,m in enumerate(mel): put(sq(nt(m),e*1.6,.5,.035,rel=.08),i*e*2)
    for t,k in json.load(open(sys.argv[3])):
        if k=='jumpU': put(sweep(250,700,.16,.07),t)
        if k=='jumpS': put(sweep(300,800,.14,.045),t)
        if k=='coin': put(sq(nt(88),.06,.5,.07),t); put(sq(nt(93),.18,.5,.07,rel=.15),t+.06)
    for at in (0.02,3.42,6.82): put(sq(nt(84),.05,.5,.06),at); put(sq(nt(91),.08,.5,.05),at+.06)
    save(mix,sys.argv[2])
else:
    mix,put=mk(); e=.25  # 120 bpm, 5 bars
    prog=[(53,[57,60,65]),(48,[55,60,64]),(50,[57,62,65]),(46,[58,62,65]),(48,[55,60,64])]
    for b,(r,ch) in enumerate(prog):
        for k in range(8):
            tt=b*2+k*e
            put(tri(nt(r+(12 if k in(2,6) else 0)),e*.85,.15),tt)
            put(sq(nt(ch[k%3]+12),e*.5,.25,.03),tt)
    mot=[(77,0,.5),(76,.5,.5),(72,1,1),(74,2,.5),(77,2.5,.5),(81,3,1)]
    for rep in (0,4):
        for m,a,d in mot: put(sq(nt(m),d*.9,.5,.04,rel=.15),rep+a)
    put(sq(nt(79),.5,.5,.04,rel=.2),8.0); put(sq(nt(77),.5,.5,.04,rel=.2),8.5); put(sq(nt(72),.9,.5,.04,rel=.4),9.0)
    # water plips: drops hit at period 1/16 s pattern -> soft plips each 0.625 s
    for i in range(16):
        t=i*.625+.31; f=nt(84+[0,3,7,5][i%4]); n=int(SR*.07); tt=np.arange(n)/SR
        put(np.sin(2*np.pi*(f+900*np.exp(-tt*40))*tt)*np.exp(-tt*45)*.09,t)
    for at in (0.02,3.42,6.82): put(sq(nt(84),.05,.5,.06),at); put(sq(nt(91),.08,.5,.05),at+.06)
    save(mix,sys.argv[2])
