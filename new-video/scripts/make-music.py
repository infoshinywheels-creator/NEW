"""Synthesize a short instrumental bed (no samples, no licensing issues).

Tense minor groove for the "problem" part, lifts to major at `switch` seconds.
Usage: python3 scripts/make-music.py out.wav [total_seconds] [switch_seconds]
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(3)

total = float(sys.argv[2]) if len(sys.argv) > 2 else 16.0
switch = float(sys.argv[3]) if len(sys.argv) > 3 else 11.0
N = int(SR * total)
L = np.zeros(N)
R = np.zeros(N)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan))
    R[i:i + len(sig)] += sig * gain * (1 + min(0, pan))


def onepole(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    p = 0.0
    for i in range(len(x)):
        p = (1 - a) * x[i] + a * p
        y[i] = p
    return y


def saw(f, dur, detune=0.0):
    tt = np.arange(int(SR * dur)) / SR
    return 2 * ((tt * f * (1 + detune)) % 1) - 1


def kick():
    tt = np.arange(int(SR * 0.35)) / SR
    f = 50 + 110 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)


def hat(open_=False):
    tt = np.arange(int(SR * (0.18 if open_ else 0.05))) / SR
    x = rng.standard_normal(len(tt))
    x = x - onepole(x, 7000)
    return x * np.exp(-tt * (18 if open_ else 80))


def clap():
    tt = np.arange(int(SR * 0.2)) / SR
    x = rng.standard_normal(len(tt))
    x = onepole(x, 3000) - onepole(x, 900)
    e = np.exp(-tt * 25) + 0.6 * np.exp(-np.maximum(0, tt - 0.012) * 40) * (tt > 0.012)
    return x * e


def pad(notes, dur):
    out = np.zeros(int(SR * dur))
    for n in notes:
        for d in (-0.004, 0.0, 0.005):
            out += saw(midi(n), dur, d)
    out = onepole(out, 1400)
    a = int(0.25 * SR)
    env = np.ones(len(out))
    env[:a] = np.linspace(0, 1, a)
    env[-a:] = np.linspace(1, 0, a)
    return out * env / (len(notes) * 3)


def bass(n, dur):
    x = onepole(saw(midi(n), dur), 420)
    tt = np.arange(len(x)) / SR
    return x * np.exp(-tt * 5) * 1.2


def pluck(n, dur=0.3):
    tt = np.arange(int(SR * dur)) / SR
    x = np.sin(2 * np.pi * midi(n) * tt) + 0.4 * np.sin(2 * np.pi * midi(n) * 2 * tt)
    return x * np.exp(-tt * 9)


minor = [([57, 60, 64], 45), ([53, 57, 60], 41)]          # Am, F
major = [([60, 64, 67], 48), ([55, 59, 62], 43), ([57, 60, 64], 45), ([53, 57, 60], 41)]  # C G Am F
bar = 4 * BEAT

tpos = 0.0
bi = 0
while tpos < total:
    lift = tpos >= switch - 1e-6
    prog = major if lift else minor
    chord, root = prog[bi % len(prog)]
    place(pad(chord, bar + 0.25), tpos, 0.55, 0)
    for k in range(8):
        place(bass(root if k % 4 else root, BEAT / 2 * 0.95), tpos + k * BEAT / 2, 0.55)
    for b in range(4):
        tb = tpos + b * BEAT
        place(kick(), tb, 0.9)
        place(hat(), tb + BEAT / 2, 0.25, 0.3)
        if lift:
            place(hat(), tb + BEAT / 4, 0.12, -0.3)
            place(hat(), tb + 3 * BEAT / 4, 0.12, -0.3)
        if b in (1, 3):
            place(clap(), tb, 0.35)
    if lift:
        arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12]
        for k in range(8):
            place(pluck(arp[k % 4]), tpos + k * BEAT / 2, 0.22, 0.4 if k % 2 else -0.4)
    tpos += bar
    bi += 1
    if not lift and tpos >= switch:
        bi = 0

# sidechain-style ducking on pad/bass would need stems; a gentle global pump instead
tt = np.arange(N) / SR
pump = 0.82 + 0.18 * np.minimum(1, ((tt % BEAT) / 0.18))
L *= pump
R *= pump

# simple stereo room (feedback delay)
for buf, d in ((L, 0.083), (R, 0.097)):
    k = int(d * SR)
    for i in range(k, N):
        buf[i] += buf[i - k] * 0.22

fade = int(0.6 * SR)
for buf in (L, R):
    buf[-fade:] *= np.linspace(1, 0, fade)
peak = max(np.abs(L).max(), np.abs(R).max())
data = (np.stack([L, R], 1) / peak * 0.85 * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print("wrote", sys.argv[1], total, "s, lift at", switch)
