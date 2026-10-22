/* Logic-level simulation of sketch/sketch.ino's readTVOC(), lines 17-41.
 *
 * This is NOT a build of the original .ino file. The .ino is C++ against the
 * Arduino core (Wire, delay()) and the specific MCU toolchain for the Arduino
 * UNO Q, neither of which is available in this environment -- no board, no
 * sensor, no matching cross-compiler. What follows is readTVOC()'s branch
 * structure and every return statement transcribed verbatim, with Wire's three
 * calls replaced by mock functions whose return values this harness controls,
 * so each of the three real code paths can be driven on purpose and the exact
 * value readTVOC() would return can be checked against the source.
 *
 * Three scenarios, matching the three branches in the original:
 *   1. I2C transmission succeeds, 5 bytes come back  -> real ppb decoded
 *   2. I2C transmission fails (err != 0)              -> returns 8888 + err
 *   3. Transmission ok, fewer than 5 bytes requested   -> returns 7777
 *
 * Compiled and run with tcc (Tiny C Compiler), not the Arduino toolchain.
 */
#include <stdio.h>
#include <stdint.h>

/* ---- controllable mock of the three Wire calls readTVOC() makes ---- */
static int MOCK_END_TRANSMISSION_ERR = 0;   /* 0 = ok, nonzero = I2C error code */
static int MOCK_BYTES_AVAILABLE = 5;        /* how many bytes requestFrom() "received" */
static uint8_t MOCK_I2C_BYTES[5] = {0, 0, 0, 142, 0}; /* data[0..3] -> ppb = 142 on success */

uint8_t mock_endTransmission(void) { return (uint8_t)MOCK_END_TRANSMISSION_ERR; }
uint8_t mock_requestFrom(void) { return (uint8_t)MOCK_BYTES_AVAILABLE; }
uint8_t mock_read(int i) { return MOCK_I2C_BYTES[i]; }

/* ---- readTVOC(), transcribed verbatim from sketch/sketch.ino lines 17-41 ---- */
uint32_t readTVOC(void) {
    /* Wire.setClock(20000); delay(50); Wire.beginTransmission(...); Wire.write(0x00);
       -- no branch-relevant effect, omitted */
    uint8_t err = mock_endTransmission();              /* line 22: Wire.endTransmission(false) */
    if (err != 0) {                                    /* line 23 */
        return 8888 + err;                              /* line 25 */
    }
    /* delay(100); -- omitted */
    uint8_t received = mock_requestFrom();              /* line 28 */
    if (received < 5) {                                 /* line 29 */
        return 7777;                                     /* line 31 */
    }
    uint8_t data[5];
    for (int i = 0; i < 5; i++) data[i] = mock_read(i);  /* line 34 */
    uint32_t ppb = ((uint32_t)data[0] << 24) |
                   ((uint32_t)data[1] << 16) |
                   ((uint32_t)data[2] << 8)  |
                    (uint32_t)data[3];
    return ppb;                                          /* line 40 */
}

int main(void) {
    uint32_t result;
    int pass = 1;

    /* Scenario 1: transmission ok, 5 bytes, decodes a real ppb */
    MOCK_END_TRANSMISSION_ERR = 0;
    MOCK_BYTES_AVAILABLE = 5;
    MOCK_I2C_BYTES[3] = 142;
    result = readTVOC();
    printf("scenario 1 (healthy sensor):        readTVOC() = %u  (expected 142)   %s\n",
           result, result == 142 ? "PASS" : "FAIL");
    pass &= (result == 142);

    /* Scenario 2: I2C transmission fails with err=3 */
    MOCK_END_TRANSMISSION_ERR = 3;
    result = readTVOC();
    printf("scenario 2 (I2C transmission fails): readTVOC() = %u  (expected 8891)  %s\n",
           result, result == 8891 ? "PASS" : "FAIL");
    pass &= (result == 8891);

    /* Scenario 3: transmission ok, but short read (e.g. 2 of 5 bytes) */
    MOCK_END_TRANSMISSION_ERR = 0;
    MOCK_BYTES_AVAILABLE = 2;
    result = readTVOC();
    printf("scenario 3 (short I2C read):         readTVOC() = %u  (expected 7777)  %s\n",
           result, result == 7777 ? "PASS" : "FAIL");
    pass &= (result == 7777);

    printf("\nAll three return values are plain uint32_t -- nothing in this function's\n");
    printf("own type signature distinguishes scenario 2 or 3 from scenario 1.\n");

    return pass ? 0 : 1;
}
