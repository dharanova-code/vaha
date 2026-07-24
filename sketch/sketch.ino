#include <Arduino_RouterBridge.h>
#include <DHT.h>
#include <Wire.h>

#define FLOW_PIN 3
#define DHT_PIN  2
#define DHT_TYPE DHT22
#define AGS02MA_ADDR 0x1A

DHT dht(DHT_PIN, DHT_TYPE);
volatile uint32_t pulseCount = 0;
float totalLiters = 0.0;
uint32_t lastCallMs = 0;

void pulseISR() { pulseCount++; }

uint32_t readTVOC() {
    Wire.setClock(20000);
    delay(50);
    Wire.beginTransmission(AGS02MA_ADDR);
    Wire.write(0x00);
    uint8_t err = Wire.endTransmission(false);
    if (err != 0) {
        Wire.setClock(100000);
        return 8888 + err;
    }
    delay(100);
    uint8_t received = Wire.requestFrom((uint8_t)AGS02MA_ADDR, (uint8_t)5, (uint8_t)true);
    if (received < 5) {
        Wire.setClock(100000);
        return 7777;
    }
    uint8_t data[5];
    for (int i = 0; i < 5; i++) data[i] = Wire.read();
    Wire.setClock(100000);
    uint32_t ppb = ((uint32_t)data[0] << 24) |
                   ((uint32_t)data[1] << 16) |
                   ((uint32_t)data[2] << 8)  |
                    (uint32_t)data[3];
    return ppb;
}

String sensors_get() {
    uint32_t now = millis();
    float dt = (now - lastCallMs) / 1000.0;
    lastCallMs = now;
    noInterrupts();
    uint32_t pulses = pulseCount;
    pulseCount = 0;
    interrupts();
    float flowLpm = (dt > 0.1) ? (pulses / dt) / 7.5 : 0.0;
    totalLiters += (flowLpm / 60.0) * dt;

    detachInterrupt(digitalPinToInterrupt(FLOW_PIN));
    float temp = dht.readTemperature();
    float hum  = dht.readHumidity();
    attachInterrupt(digitalPinToInterrupt(FLOW_PIN), pulseISR, RISING);

    uint32_t tvoc = readTVOC();
    String s = "";
    s += isnan(temp) ? "T:nan" : "T:" + String(temp, 1);
    s += isnan(hum)  ? ":H:nan" : ":H:" + String(hum, 1);
    s += ":F:" + String(flowLpm, 2);
    s += ":L:" + String(totalLiters, 3);
    s += ":V:" + String(tvoc);
    return s;
}

void setup() {
    Wire.begin();
    Bridge.begin();
    Monitor.begin(115200);
    dht.begin();
    pinMode(FLOW_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(FLOW_PIN), pulseISR, RISING);
    lastCallMs = millis();
    Bridge.provide("sensors_get", sensors_get);
    Monitor.println("SENSORS_READY");
}

void loop() {
    delay(100);
}
