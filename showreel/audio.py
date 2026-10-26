"""Original synthesized score and interface accents, 32 s, 48 kHz stereo. No samples."""
from pathlib import Path
import wave
import numpy as np

RATE = 48000
DURATION = 32
rng = np.random.default_rng(20261025)
mix = np.zeros((RATE * DURATION, 2), dtype=np.float64)

def put(at, signal, gain=1, pan=0):
    start = round(at * RATE)
    if start >= len(mix):
        return
    signal = signal[:len(mix) - start] * gain
    mix[start:start+len(signal), 0] += signal * np.sqrt((1-pan)/2)
    mix[start:start+len(signal), 1] += signal * np.sqrt((1+pan)/2)

def tone(freq, length, decay=1.5, mod=.6):
    t = np.arange(round(length * RATE)) / RATE
    attack = np.minimum(1, t/.018)
    release = np.minimum(1, (length-t)/.15)
    return np.sin(2*np.pi*freq*t + mod*np.sin(2*np.pi*freq*2*t)*np.exp(-t*3)) * np.exp(-t/decay) * attack * release

# Warm electric-key voicings. Dm9 -> Bbmaj7 -> Fmaj9 -> Cadd9.
chords = [[146.832,174.614,220,261.626,329.628], [116.541,146.832,174.614,220,261.626], [130.813,164.814,196,220,261.626], [130.813,146.832,196,246.942,293.665]]
for bar in range(16):
    at = bar*2
    chord=chords[(bar//2)%4]
    for i,note in enumerate(chord):
        put(at+i*.035,tone(note,2.5,1.3,.45),.075,(-.6+i*.3))
    # Soft bass anchor; less movement under the final card.
    put(at,tone(chord[0]/2,1.7,.8,.08),.22)
    if at < 28:
        put(at+1,tone(chord[0]/2,.8,.5,.05),.10)
    if 4 <= at < 28:
        for beat in (0, .5, 1, 1.5):
            t=np.arange(round(.24*RATE))/RATE
            freq=48+78*np.exp(-t*38)
            phase=np.cumsum(freq)/RATE*2*np.pi
            kick=np.sin(phase)*np.exp(-t*22)*(1-np.exp(-t*180))
            put(at+beat,kick,.18 if beat in (0,1) else .065)
        for beat in (.25,.75,1.25,1.75):
            t=np.arange(round(.07*RATE))/RATE
            noise=rng.normal(0,1,len(t));noise=np.concatenate(([0],np.diff(noise)))
            put(at+beat,noise*np.exp(-t*90),.014,(-.3 if beat<1 else .3))
    if bar%2==1 and at<28:
        for i in range(4):
            put(at+.5+i*.25,tone(chord[2+i%3]*2,.7,.18,.9),.035,-.4+i*.25)

# Small tonal cues exactly at real click/down events. No fabricated UI responses.
clicks=[9.5,10,12,14,14.9,15.8,16.7,18.3,19.1,20.3,21.2,22.8,23.2,23.6,24.1,24.9,27]
for i,at in enumerate(clicks):
    put(at,tone(900+(i%3)*120,.08,.018,.25),.024,.15)
# A short descending pair for Escape; a settled pair on committed drag.
for at,n in [(26.133,660),(26.22,440),(27.9,440),(28.02,660)]:
    put(at,tone(n,.3,.11,.2),.045)
for at in [8.5,13,17.5,22,28.5]:
    length=.4;t=np.arange(round(length*RATE))/RATE
    noise=rng.normal(0,1,len(t))
    smooth=np.convolve(noise,np.ones(70)/70,mode='same')
    env=np.sin(np.pi*t/length)**2
    put(max(0,at-.28),smooth*env,.09)

t=np.arange(len(mix))/RATE
mix*=np.minimum(1,t/.08)[:,None]*np.minimum(1,(DURATION-t)/.8)[:,None]
mix=np.tanh(mix*1.6)
peak=np.max(np.abs(mix));mix*=.82/peak
out=Path(__file__).resolve().parent.parent/'dist/showreel/score-original.wav'
out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as wav:
    wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(RATE)
    wav.writeframes((mix*32767).astype('<i2').tobytes())
print(f'Original score: {out}; 32 s, stereo, 48000 Hz, no samples')
