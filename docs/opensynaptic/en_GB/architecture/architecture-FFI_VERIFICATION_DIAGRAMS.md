---
title: FFI Verification Diagrams
---

# FFI Verification Diagrams

## Scope

This document provides verification diagrams for the FFI (Foreign Function Interface) layer between Python and Rust components.

- File: `docs/architecture/FFI_VERIFICATION_DIAGRAMS.md`
- Last updated: 2026-04-01
- Focus: Visual verification of FFI boundaries and runtime behavior

## Code Anchors

- `src/opensynaptic/core/pycore/core.py`
- `src/opensynaptic/core/coremanager.py`
- `src/opensynaptic/core/layered_protocol_manager.py`
- `src/opensynaptic/core/rscore/`
- `src/opensynaptic/services/`

## Practical Verification

Use these commands to verify relevant behavior in the current workspace:

```powershell
pip install -e .
python -u src/main.py plugin-test --suite component
python -u src/main.py plugin-test --suite stress --workers 8 --total 200
```

## Related Documents

- [System Architecture](../ARCHITECTURE)
- [Architecture FFI Analysis](architecture-ARCHITECTURE_FFI_ANALYSIS)
- [Core Pipeline Interface Exposure](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE)

## Notes

- For canonical runtime behavior, refer to source modules in `src/opensynaptic/`.
