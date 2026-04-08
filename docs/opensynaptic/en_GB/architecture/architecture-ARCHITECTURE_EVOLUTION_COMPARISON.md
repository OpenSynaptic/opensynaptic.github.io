---
title: Architecture Evolution Comparison
---

# Architecture Evolution Comparison

## Scope

This document tracks the architectural evolution of OpenSynaptic across versions, comparing design decisions and runtime boundaries.

- File: `docs/architecture/ARCHITECTURE_EVOLUTION_COMPARISON.md`
- Last updated: 2026-04-01
- Focus: Runtime architecture, backend selection, and pipeline boundaries from current core modules

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
- [FFI Analysis](architecture-ARCHITECTURE_FFI_ANALYSIS)
- [Core Pipeline Interface Exposure](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE)
- [FFI Verification Diagrams](architecture-FFI_VERIFICATION_DIAGRAMS)

## Notes

- For canonical runtime behavior, refer to source modules in `src/opensynaptic/`.
- See also [Comprehensive Completion Summary](../reports/reports-COMPREHENSIVE_COMPLETION_SUMMARY).
