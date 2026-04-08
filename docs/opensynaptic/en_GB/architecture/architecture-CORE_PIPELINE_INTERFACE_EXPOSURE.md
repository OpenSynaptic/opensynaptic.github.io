---
title: Core Pipeline Interface Exposure
---

# Core Pipeline Interface Exposure

## Scope

This document describes how the core pipeline interfaces are exposed across layer boundaries in OpenSynaptic.

- File: `docs/architecture/CORE_PIPELINE_INTERFACE_EXPOSURE.md`
- Last updated: 2026-04-01
- Focus: Runtime architecture, backend selection, and pipeline boundary from current core modules

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
- [FFI Verification Diagrams](architecture-FFI_VERIFICATION_DIAGRAMS)

## Notes

- For canonical runtime behavior, refer to source modules in `src/opensynaptic/`.
