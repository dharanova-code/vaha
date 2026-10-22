#!/usr/bin/env python3
"""Show what readTVOC() reports for an AGS02MA reply, against the datasheet's frame layout.

The AGS02MA's TVOC register (0x00) replies with 5 bytes: a status byte, a 24-bit TVOC value
(big-endian) and a CRC byte (AGS02MA datasheet; the Adafruit_AGS02MA library reads it the same
way, keeping value & 0xFFFFFF and rejecting a CRC mismatch). readTVOC() in sketch/sketch.ino
(lines 36-39) builds its result from bytes 0-3, so the status byte lands in the top 8 bits, and
it never checks byte 4.

This script decodes example frames both ways. The frames are constructed, not captured from a
sensor: a 96 ppb reading (the value the companion app showed in the project report) with a
status byte of 0x00 and of 0x01. The CRC is CRC-8, polynomial 0x31, initial value 0xFF, over
bytes 0-3, as the Linux kernel's ags02ma driver computes it. Results are calculated.

Usage:
  python3 analysis/tvoc_decode_example.py

Dependencies: Python standard library only (tested with Python 3.13).
"""


def crc8(data, poly=0x31, init=0xFF):
    crc = init
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = ((crc << 1) ^ poly) & 0xFF if crc & 0x80 else (crc << 1) & 0xFF
    return crc


def frame(status, ppb):
    body = [status, (ppb >> 16) & 0xFF, (ppb >> 8) & 0xFF, ppb & 0xFF]
    return body + [crc8(body)]


def as_read_tvoc(d):
    """sketch.ino lines 36-39: bytes 0-3, no mask, no CRC check."""
    return (d[0] << 24) | (d[1] << 16) | (d[2] << 8) | d[3]


def as_datasheet(d):
    """Status byte separate, 24-bit value, CRC checked."""
    if crc8(d[:4]) != d[4]:
        return None
    return ((d[1] << 16) | (d[2] << 8) | d[3]), d[0]


def main():
    print(f"each unit of the status byte adds {1 << 24} ppb in readTVOC()'s result")
    for status in (0x00, 0x01):
        d = frame(status, 96)
        value, st = as_datasheet(d)
        print(f"frame {' '.join(f'{b:02X}' for b in d)}: readTVOC() reports {as_read_tvoc(d)} ppb; "
              f"datasheet layout gives {value} ppb with status 0x{st:02X}")
    bad = frame(0x00, 96)
    bad[3] ^= 0x40  # one bit flipped in transit
    print(f"corrupted frame {' '.join(f'{b:02X}' for b in bad)}: readTVOC() reports {as_read_tvoc(bad)} ppb; "
          f"datasheet layout: {'rejected (CRC mismatch)' if as_datasheet(bad) is None else 'accepted'}")


if __name__ == "__main__":
    main()
