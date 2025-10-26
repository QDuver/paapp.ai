---
description: Analyze changes and create a well-crafted commit message
---

Create a git commit with a well-crafted message by following these steps:

1. Run these commands in parallel:
   - `git status` to see all untracked and modified files
   - `git diff` to see both staged and unstaged changes
   - `git log -5 --oneline` to see recent commit message style

2. Analyze the changes carefully:
   - Understand what was added, modified, or fixed
   - Identify the primary purpose (new feature, bug fix, refactor, etc.)
   - Note any secondary changes

3. Draft a clear, concise commit message that:
   - Starts with a verb in imperative mood (add, update, fix, refactor, etc.)
   - Focuses on WHY the change was made, not just WHAT
   - Is 1-2 sentences maximum
   - Follows the style of recent commits in this repo
   - Ends with the standard footer:

4. Show me the proposed commit message and ask if I want to:
   - Proceed with the commit
   - Edit the message
   - Cancel

5. If approved, stage relevant files and create the commit using:
   ```bash
   git add . > && git commit -m "$(cat <<'EOF'
   <commit message here>
   EOF
   )"
   ```


6. Push after commit
