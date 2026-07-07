# Sentient Sync Engine

**Real-time agent collusion detection for LangGraph multi-agent systems.**
v2.4.0-beta · Champlain College capstone · Featured at eMerge Americas 2026.

[![Site](https://img.shields.io/badge/site-gdanielschillinger.com-1A1814?style=flat-square)](https://www.gdanielschillinger.com)
[![Capstone](https://img.shields.io/badge/capstone-Champlain%20College-8B1A1A?style=flat-square)](https://www.gdanielschillinger.com#capstone)
[![eMerge](https://img.shields.io/badge/eMerge%20Americas-April%2023%2C%202026-9C7A3C?style=flat-square)](https://www.gdanielschillinger.com#emerge)
[![License](https://img.shields.io/badge/license-MIT-555555?style=flat-square)](#license)

> **Disambiguation:** This is **G. Daniel Schillinger** — final-year B.S. Cybersecurity at Champlain College, working in AGI security and post-quantum cryptography in Miami, FL. Not to be confused with **Daniel Schillinger**, lecturer in Political Science at Yale.

---

## What's in this repository

This repo contains the **interactive architecture demo** for the Sentient Sync Engine — the same surface I presented at eMerge Americas 2026. It is a single-page HTML/JS visualization of the pipeline, the cryptographic verbs, and the OWASP coverage scope.

**This is not the engine.** The engine — `auditor.py`, the LangGraph orchestrator, and the cryptographic layer — is in a private capstone repo and will be opened in stages with each piece's evidence (test vectors, threat model, eval methodology) ready to read alongside it.

| File          | What it is                                                                   |
| ------------- | ---------------------------------------------------------------------------- |
| `index.html`  | The demo surface — five-node pipeline, hash demo, agent feed, OWASP coverage |
| `main.js`     | Interactive logic. **Real SHA-256** via `crypto.subtle`; Ed25519 visualization is illustrative, not cryptographic — see [Honesty notes](#honesty-notes-what-is-real-and-what-is-illustrative) |
| `style.css`   | Wax-and-ink design system (matches [gdanielschillinger.com](https://www.gdanielschillinger.com))               |

---

## Architecture

A five-node LangGraph pipeline. Every transition signed. Every state commit authenticated.

```
  Secure        Agent             Cryptographic       NIST-aligned       Gemini
  Ingestion  →  Orchestration  →  Signing         →  Governance      →  Threat Analysis
```

| Node                   | What it does                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Secure Ingestion       | Validates inbound agent messages; enforces schema and provenance before they enter the state graph.                                         |
| Agent Orchestration    | LangGraph-native multi-agent execution with behavioral fingerprinting across communication channels.                                        |
| Cryptographic Signing  | Ed25519 signatures over each state transition; HMAC-SHA256-authenticated payloads on the inference path.                                    |
| NIST-Aligned Governance | Policy enforcement mapped to NIST CSF 2.0, OWASP LLM Top 10, and IEEE P2842.                                                                |
| Gemini Threat Analysis | Structured JSON threat analysis (Gemini 2.5 Pro) over flagged logs; HMAC-SHA256-authenticated before commit.                                |

---

## Cryptographic primitives

The verbs are deliberately precise — each one names what the primitive actually does.

| Primitive                       | Role                                                                                                                                          | Reference            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| **Ed25519**                     | Signs every state transition. **Append-only tamper-evident** audit trails across the full LangGraph state graph.                              | [RFC 8032](https://datatracker.ietf.org/doc/html/rfc8032)        |
| **HMAC-SHA256**                 | **Authenticates** (does not sign) LLM inference payloads and threat-analysis records before commit.                                           | [RFC 2104](https://datatracker.ietf.org/doc/html/rfc2104) · [FIPS 198-1](https://csrc.nist.gov/publications/detail/fips/198/1/final) |
| **Kyber-768 / ML-KEM-768**      | **Hybrid post-quantum** key establishment at service boundaries — not at every state transition. Lattice-based, standardized as ML-KEM.       | [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final)       |
| **SHA-256**                     | Content-hashing for the audit ledger and for the in-browser hash demo (`crypto.subtle.digest`).                                               | [FIPS 180-4](https://csrc.nist.gov/publications/detail/fips/180/4/final)         |

**On verbs.** HMAC does not "sign" — it authenticates. Audit trails are not "immutable" by physics — they are append-only and tamper-evident. Post-quantum is hybrid at boundaries, not at every handoff. These distinctions matter to anyone reviewing this in an interview, so they are the language used here.

---

## OWASP LLM Top 10 — scope

Sentient Sync mitigates **6 of the OWASP LLM Top 10** by design. The remaining four are out of scope and addressed by complementary controls (model lifecycle, supply-chain, plugin design, model-theft IP protection).

| ID      | Vector                  | Status         | How                                                                                          |
| ------- | ----------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| LLM01   | Prompt Injection        | ✅ In scope     | Input validation at Secure Ingestion; behavioral fingerprinting at Orchestration             |
| LLM02   | Insecure Output         | ✅ In scope     | Structured JSON contract on every output; threat-analysis layer flags malformed responses    |
| LLM03   | Training Data Poisoning | ❌ Out of scope | Addressed by model lifecycle controls; not what this engine is for                           |
| LLM04   | Model Denial of Service | ✅ In scope     | Orchestration-level rate enforcement; collusion-pattern detection                            |
| LLM05   | Supply Chain            | ❌ Out of scope | Addressed by dependency review and SBOM; not what this engine is for                         |
| LLM06   | Sensitive Disclosure    | ✅ In scope     | Output filtering; tamper-evident audit on every disclosure event                             |
| LLM07   | Insecure Plugin Design  | ❌ Out of scope | Addressed by plugin authoring discipline; not what this engine is for                        |
| LLM08   | Excessive Agency        | ✅ In scope     | Human-in-the-loop intercepts at orchestration boundaries; agency limits enforced in policy   |
| LLM09   | Overreliance            | ✅ In scope     | Confidence floors; Gemini cross-check before commit; explicit uncertainty in audit records   |
| LLM10   | Model Theft             | ❌ Out of scope | Addressed by IP and infrastructure controls; not what this engine is for                     |

Reference: [OWASP Top 10 for LLM Applications v1.1](https://owasp.org/www-project-top-10-for-large-language-model-applications/).

---

## Standards mapping

| Framework                                                                                            | Where it maps                                                                          |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [NIST CSF 2.0](https://www.nist.gov/cyberframework)                                                  | Identify → Protect → Detect → Respond functions across all five pipeline nodes        |
| [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)      | See [scope table](#owasp-llm-top-10--scope) above                                      |
| [IEEE P2842](https://standards.ieee.org/ieee/2842/10240/)                                            | Secure multi-party computation patterns at the cryptographic-signing node              |
| [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) (ML-KEM)                                  | Post-quantum key establishment at service boundaries                                   |

---

## Stack

`Python` · `LangGraph` · `Gemini 2.5 Pro` · `Next.js` · `TypeScript` · `Ed25519` · `Kyber-768 / ML-KEM-768` · `Docker` · `Kubernetes` · `Vercel`

---

## Security posture — container and orchestration substrate

The engine (private repo) is designed to run as a hardened container on Kubernetes. This is the deployment substrate the cryptographic layer sits on top of — capability boundaries at the runtime layer, cryptographic boundaries at the state layer.

| Layer | Posture |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Container** | Distroless base image, non-root user, read-only root filesystem, seccomp default profile, signed images verified at admission. |
| **Kubernetes** | Pod Security Standards (restricted), per-workload RBAC least-privilege, NetworkPolicy egress allowlists, admission-controller policies blocking privileged pods and unsigned images. |
| **Runtime** | Syscall-level anomaly detection; secrets brokered as short-lived credentials rather than static environment variables. |
| **Agent** | LLM tool-use sandboxing, capability-scoped credentials per agent, multi-model orchestration for cross-model consensus on high-stakes actions. |

**On scope.** This section describes the deployment posture the engine is built for. Container manifests and admission policies live in the engine repo and open in stages alongside the cryptographic code, on the same evidence-first schedule described below.

---

## Honesty notes — what is real and what is illustrative

This is a **demo surface**, not the engine. To match the discipline the engine is built with, the demo is explicit about what is which:

- **Real in the browser**: SHA-256 hashing via `window.crypto.subtle.digest`. You can paste arbitrary input into the hash demo and verify the digest against any independent SHA-256 tool.
- **Visualized, not cryptographic**: The Ed25519 "signature" rendered in the demo is illustrative — the public/private values shown are example formats, not a real key-pair signing real bytes. The cryptographic implementation lives in the engine.
- **Visualized, not live**: The agent feed, the Gemini threat analysis, and the PQC rotation messages are scripted to communicate the architecture's behavior at conference-floor pace. The implementation lives in the engine.

If you want to evaluate the actual cryptography, request access to the engine repo by email (below). Threat model, test vectors, and eval methodology will be opened alongside the code, not before.

---

## Run the demo locally

```bash
git clone https://github.com/gdanielschillinger/sentient-sync-engine.git
cd sentient-sync-engine
# Any static server. Examples:
python3 -m http.server 8080      # then open http://localhost:8080
# or
npx --yes serve .                 # then open the URL it prints
```

No build step — `index.html`, `main.js`, `style.css` are deployable as-is.

---

## Author & contact

**G. Daniel Schillinger** — AGI · Cybersecurity · Cryptography Architect
Final-year B.S. Cybersecurity, Champlain College (4.0 GPA · Class President · Honors League)
Miami / Fort Lauderdale, FL · US & EU work-authorized

- Canonical site: [gdanielschillinger.com](https://www.gdanielschillinger.com)
- Email: [daniel@gdanielschillinger.com](mailto:daniel@gdanielschillinger.com)
- Primary: [gdaniel.schillinger@gmail.com](mailto:gdaniel.schillinger@gmail.com)
- GitHub: [@gdanielschillinger](https://github.com/gdanielschillinger)

Direct email is the channel of record. No LinkedIn, no Indeed, no aggregators.

---

## License

MIT — see [LICENSE](LICENSE) when added. Until then: code in this repository may be read, run locally, and referenced with attribution. Re-publication, vendoring, or derivative deployment requires written permission.

---

*Sentient Sync Engine — Champlain College capstone. Featured at eMerge Americas, Miami, April 23, 2026.*
