"""
VAHA Edge Server — System Service

Provides system health and status metrics (uptime, CPU, RAM, Wi-Fi).
"""
import os
import subprocess
import socket
import fcntl
import struct
import time
from typing import Optional


def get_ip_address(ifname: str = 'wlan0') -> Optional[str]:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        ip = socket.inet_ntoa(fcntl.ioctl(
            s.fileno(),
            0x8915,  # SIOCGIFADDR
            struct.pack('256s', ifname[:15].encode('utf-8'))
        )[20:24])
        return ip
    except Exception:
        return None


def get_mac_address(ifname: str = 'wlan0') -> Optional[str]:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', bytes(ifname, 'utf-8')[:15]))
        mac = ':'.join(['%02x' % b for b in info[18:24]])
        return mac
    except Exception:
        return None


def get_uptime() -> float:
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
            return uptime_seconds
    except Exception:
        return 0.0


def get_cpu_percent() -> Optional[float]:
    try:
        # Simple top parsing (blocking for a moment) or we just use loadavg
        # Psutil is better but let's avoid adding it if not needed.
        # Fallback to loadavg
        with open('/proc/loadavg', 'r') as f:
            load = float(f.read().split()[0])
        # Approximation
        return load * 100.0
    except Exception:
        return None


def get_memory_used() -> Optional[int]:
    try:
        with open('/proc/meminfo', 'r') as f:
            lines = f.readlines()
        mem_total = 0
        mem_free = 0
        buffers = 0
        cached = 0
        for line in lines:
            if line.startswith('MemTotal:'):
                mem_total = int(line.split()[1]) * 1024
            elif line.startswith('MemFree:'):
                mem_free = int(line.split()[1]) * 1024
            elif line.startswith('Buffers:'):
                buffers = int(line.split()[1]) * 1024
            elif line.startswith('Cached:'):
                cached = int(line.split()[1]) * 1024
        used = mem_total - mem_free - buffers - cached
        return used
    except Exception:
        return None


def get_wifi_rssi(ifname: str = 'wlan0') -> Optional[int]:
    try:
        result = subprocess.run(['iwconfig', ifname], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if 'Signal level=' in line:
                # Format varies, typically: Link Quality=... Signal level=-50 dBm
                parts = line.split('Signal level=')
                val = parts[1].split()[0]
                return int(val)
    except Exception:
        pass
    return None

class SystemService:
    def get_system_metrics(self) -> dict:
        return {
            "uptime_seconds": get_uptime(),
            "cpu_percent": get_cpu_percent(),
            "memory_used_bytes": get_memory_used(),
            "wifi_rssi_dbm": get_wifi_rssi(),
            "ip_address": get_ip_address(),
            "mac_address": get_mac_address(),
        }

system_service = SystemService()
