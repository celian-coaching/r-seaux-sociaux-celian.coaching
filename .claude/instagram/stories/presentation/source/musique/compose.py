import numpy as np, wave, sys
SR=44100; BPM=122; B=60/BPM; DUR=20.03
N=int(SR*(DUR+0.5)); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(7)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if i>=N: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-pan)/1; R[i:j]+=s*(1+pan)/1
def env(n,a,d):
    t=np.arange(n)/SR; e=np.exp(-t/d); k=int(a*SR)
    if k>0: e[:k]*=np.linspace(0,1,k)
    return e
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); p=0.0
    for i,v in enumerate(x): p=(1-a)*v+a*p; y[i]=p
    return y
def saw(f,n,det=0):
    t=np.arange(n)/SR; ph=(f*t+rng.random())%1; return 2*ph-1
def note(m): return 440*2**((m-69)/12)
# kick
n=int(.35*SR); t=np.arange(n)/SR
f=45+105*np.exp(-t/0.035); kick=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.12); kick[:40]*=np.linspace(0,1,40)
# clap
n=int(.25*SR); nz=rng.standard_normal(n); nz=nz-lp(nz,900)
e=np.zeros(n)
for o in (0,.011,.022): k=int(o*SR); e[k:]+=np.exp(-np.arange(n-k)/SR/ (0.012 if o<.02 else 0.09))
clap=nz*e*0.5
# hat
n=int(.08*SR); nz=rng.standard_normal(n); hat=(nz-lp(nz,6000))*env(n,0,0.018)*0.35
open_hat=(lambda n:(lambda z:(z-lp(z,7000))*env(n,0,0.07)*0.25)(rng.standard_normal(n)))(int(.25*SR))
# progression C G Am F (2 bars? 1 bar each)
prog=[[60,64,67,72],[59,62,67,71],[57,60,64,69],[57,60,65,69]]
roots=[36,43,45,41]
bars=int(np.ceil(DUR/(4*B)))
melody=[ (0,79),(1.5,76),(2,79),(3,81), (4,79),(5.5,74),(6,76),(7,79),
         (8,76),(9.5,72),(10,76),(11,77), (12,76),(13,74),(14,72),(15,74)]
side=np.ones(N)
for bar in range(bars):
    t0=bar*4*B; full=bar>=2; last=bar==bars-1
    ch=prog[bar%4]; rt=roots[bar%4]
    # chords: stabs on offbeats when full, pad in intro
    if full:
        for st in (0.5,1.5,2.5,3.5, 1.0,3.0):
            pass
        for st in (0, .75, 1.5, 2.5, 3.25):
            n=int(B*0.6*SR); s=sum(saw(note(m)*(1+d),n) for m in ch for d in (-.004,.004))/8
            add(lp(s,2600)*env(n,.005,.18),t0+st*B,pan=0.2*np.sin(st),g=0.35)
    else:
        n=int(4*B*SR); s=sum(saw(note(m)*(1+d),n) for m in ch for d in (-.005,.005))/8
        cut=900 if bar==0 else 1600
        e=np.minimum(1,np.arange(n)/(SR*0.4))*np.exp(-np.arange(n)/SR/3)
        add(lp(s,cut)*e,t0,g=1.0)
    for beat in range(4):
        tb=t0+beat*B
        if full or (bar==1 and beat>=2):
            add(kick,tb,g=0.75)
            a=int(tb*SR); k=max(0,min(int(.18*SR),N-a))
            if k: side[a:a+k]=np.minimum(side[a:a+k],np.linspace(.35,1,int(.18*SR))[:k])
        if full and beat in (1,3): add(clap,tb,pan=0.05,g=0.8)
        for k,o in enumerate((0,.25,.5,.75)):
            if o==.5: add(open_hat,tb+o*B,pan=.3) if full else add(hat,tb+o*B,pan=.3)
            elif full or bar==1: add(hat,tb+o*B,pan=-.3,g=0.6 if o else 0.4)
        if full:
            for o in (0.5,):
                n=int(B*0.45*SR); s=(saw(note(rt),n)+0.5*np.sin(2*np.pi*note(rt-12)*np.arange(n)/SR))
                add(lp(s,500)*env(n,.004,.12),tb+o*B,g=0.7)
    # melody pluck on bars 4+
    if bar>=4:
        for st,m in melody[(bar%2)*8:(bar%2)*8+8]:
            st-= (bar%2)*4
            n=int(B*0.9*SR); tt=np.arange(n)/SR
            s=np.sign(np.sin(2*np.pi*note(m)*tt))*0.4+np.sin(2*np.pi*note(m)*2*tt)*0.3
            add(lp(s,3500)*env(n,.003,.14),t0+st*B,pan=-.15,g=0.28)
            add(lp(s,2000)*env(n,.003,.14)*0.35,t0+st*B+0.75*B,pan=.4,g=0.28)
# riser before drop (end of bar 2)
n=int(4*B*SR); nz=rng.standard_normal(n); r=(nz-lp(nz,3000))*np.linspace(0,1,n)**2*0.25; add(r,4*B)
# pump the music (not kick) - approximate: apply sidechain to everything then re-add kick? simple: apply gentle pump
L*=0.6+0.4*side; R*=0.6+0.4*side
mix=np.stack([L,R],1)[:int(DUR*SR)]
ft=int(1.6*SR); mix[-ft:]*=np.linspace(1,0,ft)[:,None]**1.5
mix[:int(.05*SR)]*=np.linspace(0,1,int(.05*SR))[:,None]
mix/=np.max(np.abs(mix))*1.12
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
