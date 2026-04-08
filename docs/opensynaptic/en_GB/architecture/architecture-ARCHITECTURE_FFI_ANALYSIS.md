---
title: Architecture FFI Analysis
---

# Architecture FFI Analysis

## Scope

This document analyzes the Foreign Function Interface (FFI) layer between the Python and Rust components of OpenSynaptic.

- File: `docs/architecture/ARCHITECTURE_FFI_ANALYSIS.md`
- Last updated: 2026-04-01
- Focus: Runtime architecture, backend selection, and FFI boundary from current core modules

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
- [Architecture Evolution Comparison](architecture-ARCHITECTURE_EVOLUTION_COMPARISON)
- [Core Pipeline Interface Exposure](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE)
- [FFI Verification Diagrams](architecture-FFI_VERIFICATION_DIAGRAMS)

## Notes

- For canonical runtime behavior, refer to source modules in `src/opensynaptic/`.
- The FFI layer allows Python code to call Rust functions with near-zero overhead.
