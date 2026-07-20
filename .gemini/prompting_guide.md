# AI Prompting & Implementation Guide

This document establishes the step-by-step workflow for all future code generation and modification tasks inside the Vaha repository.

---

## Step-by-Step Implementation Workflow

1.  **Read Context:** Analyze [.gemini/context.md](file:///c:/Projects/vaha/.gemini/context.md) to understand current progress.
2.  **Verify Rules:** Read [.gemini/project_rules.md](file:///c:/Projects/vaha/.gemini/project_rules.md) to check formatting, token, and structural constraints.
3.  **Identify Milestone:** Check [.gemini/milestones.md](file:///c:/Projects/vaha/.gemini/milestones.md) for the active target task.
4.  **Reference Agents:** Read relevant files inside `.agents/` for guidelines mapping to your task role.
5.  **Develop:** Write code exclusively for the target milestone.
6.  **Compile Check:** Run `npm run ts:check` to ensure no typescript errors are introduced.
7.  **Lint Check:** Run `npm run lint` to verify formatting rules are met.
8.  **Test verification:** Run `npm run test` to verify the Jest suite runs successfully.
9.  **Commit Checkpoint:** Commit the changes to the git repository.
10. **Synchronize Memory:** Update `.gemini/context.md` and `.gemini/milestones.md` to reflect task completion.
