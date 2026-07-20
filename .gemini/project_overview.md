# Project Overview: Vaha

## 1. What is Vaha?
Vaha is an ambient capture ecosystem designed to eliminate the friction between a human thought and its digital preservation. 
*   **The Hardware:** A dedicated, single-button physical device captures raw audio and local environmental metrics (temperature, air quality).
*   **The Companion App:** Decrypts, stores, transcribes, and synthesizes these captures locally on the user's phone, formatting them into an elegant, personal journal.

---

## 2. Product Philosophy
*   **Offline-First:** All speech-to-text transcription, security decryption, and database updates operate natively on-device. No internet connection required.
*   **Privacy-First:** User data is encrypted at rest (AES-256) using device-level secure key chains.
*   **Calm Minimalism:** Inspired by Muji, Japanese minimal interiors, and book layout designs. No gamification streaks, notifications spam, or chat bubbles.

---

## 3. Architecture Philosophy
*   **Feature-First:** Modular features reside under `src/features/` containing their own state, validation, and hooks.
*   **Platform Abstraction:** Native OS platform details are isolated under `src/platform/` to ensure long-term codebase maintainability.
