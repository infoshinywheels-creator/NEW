"""Synthesize simple UI sound effects (no paid libraries), per MONTAGE_REGLAMENT §5.

Usage: python3 scripts/make-sfx.py public/sfx
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, attack=0.005, release=0.1, dur=None):
    x = np.ones(n)
    a = max(1, int(SR * attack))
    r = max(1, int(SR * release))
    x[:a] = np.linspace(0, 1, a)
    x[-r:] *= np.linspace(1, 0, r) ** 2
    return x


def lowpass(x, cutoff):
    # one-pole low-pass; cutoff may be an array (sweep)
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def norm(x, peak=0.8):
    return x / (np.abs(x).max() + 1e-9) * peak


def save(path, x):
    x = np.clip(x, -1, 1)
    stereo = np.stack([x, x], axis=1)
    data = (stereo * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def whoosh(dur=0.55):
    n = int(SR * dur)
    noise = rng.standard_normal(n)
    sweep = np.concatenate([np.linspace(400, 5000, n // 2), np.linspace(5000, 800, n - n // 2)])
    x = highpass(lowpass(noise, sweep), 200)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return norm(x * shape, 0.55)


def pop(f0=900, f1=320, dur=0.11):
    tt = t(dur)
    freq = np.geomspace(f0, f1, len(tt))
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return norm(np.sin(phase) * np.exp(-tt * 38), 0.7)


def tick(dur=0.04):
    tt = t(dur)
    x = np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 180)
    x += highpass(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 400) * 0.4
    return norm(x, 0.5)


def bubbles(dur=1.0, count=14):
    n = int(SR * dur)
    out = np.zeros(n)
    for _ in range(count):
        start = int(rng.uniform(0, dur - 0.08) * SR)
        f = rng.uniform(700, 1700)
        b = pop(f * 1.6, f, dur=0.06) * rng.uniform(0.3, 0.8)
        out[start:start + len(b)] += b[: n - start]
    return norm(out, 0.45)


def sparkle(dur=1.3):
    tt = t(dur)
    out = np.zeros(len(tt))
    notes = [2093.0, 2637.0, 3136.0, 4186.0]  # C7 E7 G7 C8 arpeggio
    for i, f in enumerate(notes):
        start = int(i * 0.07 * SR)
        seg = tt[: len(tt) - start]
        tone = (np.sin(2 * np.pi * f * seg) + 0.3 * np.sin(2 * np.pi * f * 2.01 * seg)) * np.exp(-seg * 4.5)
        out[start:] += tone * (0.9 - i * 0.12)
    shimmer = highpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 3) * 0.08
    return norm(out + shimmer, 0.5)


def buzz(dur=0.22):
    tt = t(dur)
    x = np.sign(np.sin(2 * np.pi * 140 * tt)) * 0.6 + np.sin(2 * np.pi * 70 * tt)
    x = lowpass(x, 1800) * env(len(tt), 0.004, 0.06)
    return norm(x, 0.5)


def hit(dur=0.5):
    # soft low "boom" for the hook
    tt = t(dur)
    freq = np.geomspace(120, 45, len(tt))
    x = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 7)
    x += lowpass(rng.standard_normal(len(tt)), 900) * np.exp(-tt * 30) * 0.5
    return norm(x, 0.8)


if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in [("whoosh", whoosh), ("pop", pop), ("tick", tick), ("bubbles", bubbles),
                     ("sparkle", sparkle), ("buzz", buzz), ("hit", hit)]:
        save(out / f"{name}.wav", fn())
        print("wrote", name)
