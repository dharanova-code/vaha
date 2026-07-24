# Vaha Onboarding Philosophy & Strategy

Version 1.0.0  
Status: Proposal  
Target: Vaha (Companion App Onboarding Flow)

---

## 1. Onboarding Principles
Unlike traditional productivity apps that rush users through feature tours, Vaha’s onboarding is a **mindful transition**. The objective is to establish trust, not to highlight features. 
*   **Minimal Chrome:** No splashy intro graphics, heavy animations, or setup wizards. Setup is treated like opening the first blank page of a notebook.
*   **Transparency First:** Security and offline status are explained explicitly and calmly before any setup action is requested.
*   **Progressive Disclosure:** Only ask for what is needed, when it is needed.

## 2. Screen Sequence
1.  **Welcome & Warm Intent:** A quiet introduction that welcomes the user and establishes the purpose of the sanctuary.
2.  **Privacy & Encryption Foundation:** Explains how thoughts are stored locally and encrypted before any permissions are asked.
3.  **Local-First / Offline Clarification:** Explains that Vaha operates completely offline and does not require a cloud connection.
4.  **Hardware Connection / Pairing:** A quiet, step-by-step pairing sequence for the physical capture device.
5.  **Permission Request (Bluetooth & Mic):** Contextual, trust-based permission dialogs.
6.  **First Capture Tutorial:** A low-arousal, simple 1-step capture trial to build confidence.
7.  **Entrance:** Entering the blank Home screen dashboard with a welcoming prompt.

## 3. Information Hierarchy
On every screen, info is structured to prioritize reassurance over technical instructions:
1.  **Emotional Context:** (e.g., *"Your thoughts are yours alone."*)
2.  **How it Works (Simply):** (e.g., *"All audio is processed directly on your device."*)
3.  **Actions:** (e.g., *"Set encryption key"* or *"Continue"*)
4.  **Receded Controls:** Small, stone-colored labels or skip options.

## 4. Emotional Progression
*   **Step 1 (Welcome):** Reassured, calm.
*   **Step 2 & 3 (Privacy & Offline):** Secure, trusting, in control.
*   **Step 4 & 5 (Pairing & Permissions):** Competent, guided, clear.
*   **Step 6 (First Capture):** Successful, quiet satisfaction.
*   **Step 7 (Home Entrance):** Grounded, peaceful, ready.

## 5. Permission Strategy
Permissions (Bluetooth, Microphone, Notifications) are never requested on app launch.
*   **Bluetooth:** Requested only when the user explicitly initiates "Pair Device" on Screen 4.
*   **Microphone:** Requested only on Screen 6 during the "First Capture Tutorial" when they tap to record their first thought.
*   **Pre-request Context:** Each system permission pop-up is preceded by a Vaha-styled explanation screen describing *why* the permission is localized.

## 6. Device Pairing Timing
Device pairing is deferred until the foundations of local security are set. We want the user to understand that the physical device is a secure, offline voice-recorder before they connect it to the companion app. Pairing is initiated on Screen 4.

## 7. Offline Explanation
We explain Vaha's offline-first architecture by contrasting it with typical cloud services:
*   *"Vaha does not send your voice to any server. Your audio transcriptions are processed locally by the app using your device's processor. No internet required."*

## 8. Privacy Explanation
We establish the privacy-first thought companion structure:
*   *"Your thoughts are protected using local AES-256 encryption. Only your app, with your local key, can decrypt and read them. Not even Vaha has access to your thoughts."*

## 9. First Successful Capture Journey
To make the first capture experience seamless and calm:
*   The tutorial asks the user to speak a single thought (e.g., *"How do I feel right now?"*).
*   During recording, the screen displays a single, 1px monoline forest green wave. No flashing red lights or heavy recording bars.
*   Once finished, a clean text transcript fades onto the paper background, followed by a quiet confirmation: *"Your first thought is saved locally."*

## 10. Exit Criteria
The onboarding is successfully complete when:
1.  The local AES encryption key is created and backed up.
2.  Bluetooth/Microphone permissions are resolved.
3.  The physical Vaha capture device is paired successfully (optional, can be bypassed if the user wants to capture on-app only).
4.  The user executes their first successful capture.
