# Musique de fond "sport" : 128 BPM, la mineur, basse roulante, kick appuyé.
import numpy as np, wave, sys
SR=44100; BPM=128; B=60/BPM; BAR=4*B; DUR=float(sys.argv[2]) if len(sys.argv)>2 else 20.0
N=int(SR*(DUR+1)); L=np.zeros(N); R=np.zeros(N); side=np.ones(N)
rng=np.random.default_rng(3)
def add(sig,t,pan=0.0,g=1.0,duck=True):
    i=int(t*SR)
    if i>=N: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g
    if duck: s=s*side[i:j]
    L[i:j]+=s*(1-pan); R[i:j]+=s*(1+pan)
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); p=0.0
    for i,v in enumerate(x): p=(1-a)*v+a*p; y[i]=p
    return y
def hp(x,fc): return x-lp(x,fc)
def env(n,a,d):
    t=np.arange(n)/SR; e=np.exp(-t/d); k=int(a*SR)
    if k: e[:k]*=np.linspace(0,1,k)
    return e
def saw(f,n): t=np.arange(n)/SR; return 2*((f*t+rng.random())%1)-1
def note(m): return 440*2**((m-69)/12)
n=int(.4*SR); t=np.arange(n)/SR
f=48+170*np.exp(-t/0.03); kick=np.tanh(2.2*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.16))
kick+=hp(rng.standard_normal(n),3000)*np.exp(-t/0.004)*0.4
n=int(.3*SR); nz=hp(rng.standard_normal(n),1200); t=np.arange(n)/SR
snare=(nz*np.exp(-t/0.09)*0.6+np.sin(2*np.pi*190*t)*np.exp(-t/0.05)*0.6)
n=int(.06*SR); hat=hp(rng.standard_normal(n),7500)*env(n,0,0.015)*0.4
n=int(.22*SR); ohat=hp(rng.standard_normal(n),7000)*env(n,0,0.08)*0.3
# la mineur : Am Am F G  (graves, sans aigus)
prog=[[45,48,52],[45,48,52],[41,45,48],[43,47,50]]
roots=[33,33,29,31]
def stab(ch,n,cut):
    s=sum(saw(note(m)*(1+d),n) for m in ch for d in (-.006,0,.006))/9
    return np.tanh(1.5*lp(s,cut))
INTRO=2; bars=int(np.ceil(DUR/BAR))+1
# sidechain d'abord (positions des kicks)
for bar in range(INTRO,bars):
    for beat in range(4):
        a=int((bar*BAR+beat*B)*SR); k=max(0,min(int(.22*SR),N-a))
        if k: side[a:a+k]=np.minimum(side[a:a+k],np.linspace(.15,1,int(.22*SR))[:k]**0.7)
for bar in range(bars):
    t0=bar*BAR; ch=prog[bar%4]; rt=roots[bar%4]; full=bar>=INTRO
    if not full:
        # intro : basse roulante filtrée qui s'ouvre + charley, tension
        for s16 in range(16):
            n=int(B/4*SR*0.9); prog_=(bar*16+s16)/32
            b=np.tanh(2*lp(saw(note(rt+12),n),250+1400*prog_))*env(n,.002,.06)
            add(b,t0+s16*B/4,g=0.55,duck=False)
        for beat in range(4):
            add(ohat if bar==1 else hat,t0+beat*B+B/2,pan=.25,duck=False)
        if bar==1:
            # roulement de caisse claire qui accélère + montée de bruit
            for k in range(16):
                add(snare,t0+2*B+k*B/8,g=0.15+0.5*k/16,duck=False)
            n=int(BAR*SR); r=hp(rng.standard_normal(n),2000)*np.linspace(0,1,n)**2*0.35; add(r,t0,duck=False)
        continue
    for beat in range(4):
        tb=t0+beat*B
        add(kick,tb,g=0.9,duck=False)
        if beat in (1,3): add(snare,tb,g=0.75,duck=False)
        add(ohat,tb+B/2,pan=.25,duck=False)
        for q in (B/4,3*B/4): add(hat,tb+q,pan=-.25,g=0.6,duck=False)
        # basse roulante en doubles croches (sauf sur le temps)
        for q in (1,2,3):
            n=int(B/4*SR*0.95)
            b=np.tanh(2.5*lp(saw(note(rt),n)+0.6*saw(note(rt+12),n),700))*env(n,.002,.07)
            add(b,tb+q*B/4,g=0.6)
            add(np.sin(2*np.pi*note(rt)*np.arange(n)/SR)*env(n,.002,.08),tb+q*B/4,g=0.5)
    # stabs d'accords graves, syncopés
    for st in (0,.75,1.5,2.5,3.0):
        n=int(B*0.5*SR); add(stab(ch,n,1500)*env(n,.003,.12),t0+st*B,pan=.15*np.sin(st*3),g=0.45)
    # petit fill de caisse claire toutes les 4 mesures
    if (bar-INTRO)%4==3:
        for k in range(4): add(snare,t0+3*B+k*B/4,g=0.35+0.1*k,duck=False)
    # cri de synthé grave (« impact ») au début de chaque phrase
    if (bar-INTRO)%4==0:
        n=int(1.2*SR); tt=np.arange(n)/SR
        imp=np.tanh(3*np.sin(2*np.pi*(note(21)+40*np.exp(-tt/0.2))*tt))*np.exp(-tt/0.5)
        add(imp,t0,g=0.4,duck=False)
        add(hp(rng.standard_normal(int(1.5*SR)),1500)*np.linspace(1,0,int(1.5*SR))**3*0.25,t0,duck=False)
mix=np.stack([L,R],1)
mix=np.tanh(1.4*mix/np.max(np.abs(mix)))
mix=mix[:int(DUR*SR)]
ft=int(1.2*SR); mix[-ft:]*=np.linspace(1,0,ft)[:,None]**1.3
mix/=np.max(np.abs(mix))*1.05
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
