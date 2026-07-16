
# Vaha Feature Ownership Matrix v1.0

## Home

| Feature                | Primary Screen | Secondary Entry Points | User Goal                    | Dependencies  | Priority  | Rationale                                |
| ---------------------- | -------------- | ---------------------- | ---------------------------- | ------------- | --------- | ---------------------------------------- |
| Recent Captures        | Home           | Captures               | Resume work quickly          | Capture data  | Core      | Primary landing experience               |
| Continue Reading       | Home           | Capture Details        | Continue unfinished work     | Capture state | Core      | Reduces friction                         |
| Daily Summary          | Home           | Insights               | Get a quick overview         | AI summaries  | Secondary | Adds value without replacing Insights    |
| Suggested Actions      | Home           | None                   | Surface important next steps | Local state   | Secondary | Keeps users proactive                    |
| Device Status Snapshot | Home           | Device                 | Build confidence             | Device status | Core      | Quick reassurance without opening Device |

---

## Captures

| Feature          | Primary Screen | Secondary Entry Points | User Goal            | Dependencies  | Priority  | Rationale                 |
| ---------------- | -------------- | ---------------------- | -------------------- | ------------- | --------- | ------------------------- |
| Browse Captures  | Captures       | Home                   | Find recordings      | Capture index | Core      | Primary library           |
| Filter Captures  | Captures       | Search                 | Narrow results       | Metadata      | Core      | Expected behavior         |
| Sort Captures    | Captures       | None                   | Organize results     | Metadata      | Core      | Library responsibility    |
| Multi-select     | Captures       | None                   | Manage many captures | Capture list  | Secondary | Avoids clutter in details |
| Archive Capture  | Captures       | Capture Details        | Reduce clutter       | Capture       | Secondary | Collection-level action   |
| Favorite Capture | Captures       | Capture Details        | Mark importance      | Capture       | Secondary | Simple organization       |

---

## Capture Details

| Feature            | Primary Screen  | Secondary Entry Points | User Goal            | Dependencies     | Priority  | Rationale                     |
| ------------------ | --------------- | ---------------------- | -------------------- | ---------------- | --------- | ----------------------------- |
| View Transcript    | Capture Details | Search                 | Read capture         | Transcript       | Core      | Core purpose                  |
| Play Audio         | Capture Details | None                   | Listen again         | Audio            | Core      | Capture experience            |
| Edit Transcript    | Capture Details | None                   | Correct text         | Transcript       | Core      | Belongs with content          |
| Rename Capture     | Capture Details | None                   | Improve organization | Capture          | Core      | Content ownership             |
| AI Summary         | Capture Details | Insights               | Understand quickly   | AI               | Core      | AI augments the capture       |
| Tags               | Capture Details | Search                 | Organize             | Metadata         | Secondary | Metadata belongs here         |
| Sensor Snapshot    | Capture Details | None                   | Understand context   | Sensor metadata  | Secondary | Metadata, not separate screen |
| Recording Metadata | Capture Details | None                   | Verify context       | Metadata         | Secondary | Reference only                |
| Sync Status        | Capture Details | Home, Device           | Confirm availability | Sync state       | Core      | Contextual reassurance        |
| Export Capture     | Capture Details | Export & Backup        | Share or preserve    | Export engine    | Secondary | Capture-level export          |
| Delete Capture     | Capture Details | Captures               | Remove content       | Storage          | Core      | Content lifecycle             |
| Related Captures   | Capture Details | Insights               | Explore connections  | AI relationships | Future    | Scales naturally              |

---

## Search

| Feature         | Primary Screen | Secondary Entry Points | User Goal     | Dependencies  | Priority  | Rationale           |
| --------------- | -------------- | ---------------------- | ------------- | ------------- | --------- | ------------------- |
| Global Search   | Search         | Home, Captures         | Find anything | Search index  | Core      | Dedicated retrieval |
| Recent Searches | Search         | None                   | Resume search | Local history | Secondary | Convenience         |
| Search Filters  | Search         | Captures               | Refine search | Metadata      | Core      | Retrieval-focused   |

---

## Insights

| Feature         | Primary Screen | Secondary Entry Points | User Goal                 | Dependencies | Priority  | Rationale                  |
| --------------- | -------------- | ---------------------- | ------------------------- | ------------ | --------- | -------------------------- |
| Weekly Summary  | Insights       | Home                   | Review activity           | AI           | Core      | Insight ownership          |
| Trends          | Insights       | None                   | Discover patterns         | AI           | Core      | Core value proposition     |
| Connections     | Insights       | Capture Details        | Explore relationships     | AI           | Secondary | Complements capture view   |
| Reflection      | Insights       | None                   | Encourage review          | AI           | Future    | Long-term engagement       |
| Insight Refresh | Insights       | None                   | Update generated insights | AI           | Future    | Background process trigger |

---

## Device

| Feature           | Primary Screen | Secondary Entry Points | User Goal             | Dependencies | Priority  | Rationale               |
| ----------------- | -------------- | ---------------------- | --------------------- | ------------ | --------- | ----------------------- |
| Device Health     | Device         | Home                   | Check status          | Hardware     | Core      | Central device overview |
| Pair Device       | Device         | Onboarding             | Connect hardware      | BLE/Wi-Fi    | Core      | One obvious location    |
| Storage Overview  | Device         | None                   | Understand capacity   | Device       | Core      | Hardware concern        |
| Battery Status    | Device         | Home                   | Monitor readiness     | Hardware     | Core      | Hardware concern        |
| Firmware Version  | Device         | None                   | Verify software       | Device       | Secondary | Advanced users          |
| Firmware Update   | Device         | None                   | Keep device current   | Network      | Secondary | Avoid separate screen   |
| Manual Sync       | Device         | Home                   | Force synchronization | Sync engine  | Core      | Expected ownership      |
| Connection Status | Device         | Home                   | Confirm connectivity  | Hardware     | Core      | Centralized             |

---

## Device Settings

| Feature               | Primary Screen  | Secondary Entry Points | User Goal               | Dependencies | Priority  | Rationale                  |
| --------------------- | --------------- | ---------------------- | ----------------------- | ------------ | --------- | -------------------------- |
| Recording Preferences | Device Settings | None                   | Customize capture       | Device       | Core      | Hardware behavior          |
| Wake Word             | Device Settings | None                   | Personalize interaction | Device       | Secondary | Advanced configuration     |
| Storage Policy        | Device Settings | None                   | Control retention       | Device       | Secondary | Long-term maintenance      |
| Sync Preferences      | Device Settings | Privacy Center         | Choose sync behavior    | Sync         | Core      | Hardware-specific behavior |
| Factory Reset         | Device Settings | None                   | Restore defaults        | Device       | Secondary | Rare operation             |

---

## Settings

| Feature       | Primary Screen | Secondary Entry Points | User Goal                 | Dependencies      | Priority  | Rationale            |
| ------------- | -------------- | ---------------------- | ------------------------- | ----------------- | --------- | -------------------- |
| Accessibility | Settings       | None                   | Improve usability         | System            | Core      | Global preference    |
| Notifications | Settings       | None                   | Manage alerts             | System            | Secondary | Standard behavior    |
| Integrations  | Settings       | None                   | Connect external services | Optional services | Future    | Keep isolated        |
| About         | Settings       | None                   | Product information       | None              | Secondary | Standard expectation |

---

## Privacy Center

| Feature               | Primary Screen | Secondary Entry Points | User Goal             | Dependencies      | Priority | Rationale         |
| --------------------- | -------------- | ---------------------- | --------------------- | ----------------- | -------- | ----------------- |
| Data Storage Overview | Privacy Center | None                   | Know where data lives | Local/cloud state | Core     | Builds trust      |
| Export All Data       | Privacy Center | Export & Backup        | Preserve ownership    | Export engine     | Core     | Privacy promise   |
| Delete All Data       | Privacy Center | None                   | Remove personal data  | Storage           | Core     | Privacy promise   |
| Permissions           | Privacy Center | Onboarding             | Manage access         | OS                | Core     | Central authority |

---

## Export & Backup

| Feature        | Primary Screen  | Secondary Entry Points | User Goal     | Dependencies | Priority  | Rationale                    |
| -------------- | --------------- | ---------------------- | ------------- | ------------ | --------- | ---------------------------- |
| Full Backup    | Export & Backup | Privacy Center         | Preserve data | Storage      | Secondary | Separate from capture export |
| Restore Backup | Export & Backup | None                   | Recover data  | Backup files | Future    | Needed for resilience        |

---

## Onboarding

| Feature              | Primary Screen | Secondary Entry Points | User Goal        | Dependencies | Priority | Rationale                |
| -------------------- | -------------- | ---------------------- | ---------------- | ------------ | -------- | ------------------------ |
| Product Introduction | Onboarding     | None                   | Understand Vaha  | None         | Core     | Sets expectations        |
| Privacy Explanation  | Onboarding     | Privacy Center         | Build trust      | None         | Core     | Essential to positioning |
| Initial Pairing      | Onboarding     | Device                 | Connect hardware | Device       | Core     | First-use success        |

---

# Features intentionally excluded

These were evaluated and deliberately rejected to keep the product coherent.

| Feature              | Decision | Rationale                                                                |
| -------------------- | -------- | ------------------------------------------------------------------------ |
| AI Assistant         | Removed  | AI should enhance existing workflows, not become a destination.          |
| Sensor Logs          | Removed  | Sensor data is metadata within Capture Details.                          |
| Sync Queue           | Removed  | Sync status should appear contextually, not as a separate workflow.      |
| Battery Screen       | Removed  | Battery belongs in Device.                                               |
| Storage Browser      | Removed  | Storage is a device responsibility, not a file manager.                  |
| Firmware Screen      | Removed  | Firmware management fits naturally within Device.                        |
| Notifications Center | Removed  | Notifications should lead users directly to relevant content.            |
| User Profile         | Removed  | No multi-user or account-centric workflow justifies a dedicated screen.  |
| AI Chat              | Removed  | Conflicts with Vaha's calm, capture-centric philosophy.                  |
| Dashboard Analytics  | Removed  | Insights already fulfill this role without creating another destination. |

---

# Architectural principles validated

This matrix establishes the following long-term rules:

* **Every feature has exactly one primary owner.**
* **Secondary entry points are shortcuts, not alternative owners.**
* **Captures remain the central object throughout the app.**
* **AI is always embedded within existing workflows.**
* **Hardware management stays isolated from daily content interactions.**
* **Privacy and trust are treated as first-class experiences, not buried settings.**
* **No duplicate navigation paths are introduced.**

I would consider this matrix the **UX source of truth** for the Vaha companion app. Every future screen, wireframe, interaction flow, and implementation should map back to it. If a proposed feature cannot be assigned a single, obvious owner without violating these principles, it should be redesigned or rejected before entering the product.
