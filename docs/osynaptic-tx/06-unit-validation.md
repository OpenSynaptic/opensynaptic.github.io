---
id: 06-unit-validation
title: Unit Validation
sidebar_label: Unit Validation
---

# Unit Validation

OSynaptic-TX validates unit strings at encode time using the `OSTX_UNIT()` macro. Pass an invalid unit and the encode function returns `0` (no packet emitted).

## `OSTX_UNIT()` Macro

```c
/* Will not compile if "xyz" is not a recognised unit code */
#define MY_UNIT OSTX_UNIT("Cel")

/* Use in pack calls */
ostx_sensor_pack(aid, "T1", OSTX_UNIT("Cel"), tid, ts, scaled, out);
```

On compilers that support `_Static_assert` (C11) the validation is a compile-time error. On C89 targets the check falls back to a runtime guard that returns 0 on failure.

## Recognised Unit Codes (subset)

The full list is in `ostx_unit_table.h`. Common categories:

### Temperature
| Code | Full name |
|---|---|
| `Cel` | Degree Celsius |
| `K` | Kelvin |
| `[degF]` | Degree Fahrenheit |

### Humidity & Pressure
| Code | Full name |
|---|---|
| `Pct` | Percentage (0–100) |
| `kPa` | Kilopascal |
| `hPa` | Hectopascal (millibar) |
| `Pa` | Pascal |
| `mm[Hg]` | Millimetres of mercury |

### Concentration & Air Quality
| Code | Full name |
|---|---|
| `ppm` | Parts per million |
| `ppb` | Parts per billion |
| `mg/m3` | Milligrams per cubic metre |
| `ug/m3` | Micrograms per cubic metre |

### Electrical
| Code | Full name |
|---|---|
| `V` | Volt |
| `mV` | Millivolt |
| `A` | Ampere |
| `mA` | Milliampere |
| `W` | Watt |
| `Wh` | Watt-hour |
| `kWh` | Kilowatt-hour |
| `Ohm` | Ohm |
| `Hz` | Hertz |
| `kHz` | Kilohertz |

### Length, Speed, Acceleration
| Code | Full name |
|---|---|
| `m` | Metre |
| `cm` | Centimetre |
| `mm` | Millimetre |
| `m/s` | Metre per second |
| `km/h` | Kilometre per hour |
| `m/s2` | Metre per second squared |

### Light, Radiation
| Code | Full name |
|---|---|
| `lx` | Lux |
| `uW/cm2` | Microwatt per square centimetre |
| `mSv` | Millisievert |

### Count & Dimensionless
| Code | Full name |
|---|---|
| `1` | Dimensionless (ratio) |
| `{count}` | Raw count |
| `{rpm}` | Revolutions per minute |

## SI Prefix Rules

All UCUM SI prefixes are accepted:

| Prefix | Symbol | Factor |
|---|---|---|
| peta | P | 10¹⁵ |
| tera | T | 10¹² |
| giga | G | 10⁹ |
| mega | M | 10⁶ |
| kilo | k | 10³ |
| hecto | h | 10² |
| deca | da | 10¹ |
| deci | d | 10⁻¹ |
| centi | c | 10⁻² |
| milli | m | 10⁻³ |
| micro | u | 10⁻⁶ |
| nano | n | 10⁻⁹ |
| pico | p | 10⁻¹² |

Example: `km`, `mg`, `uV`, `nA` are all valid by prefix expansion.

## Bypassing Validation

If you have a custom unit string not covered by the table, define `OSTX_ALLOW_CUSTOM_UNITS=1` and the validation is skipped. Receivers will still accept the packet; they simply forward the raw unit string as-is.
