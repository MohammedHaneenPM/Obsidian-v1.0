---------------------------------------------------------
PLANNING DOCUMENT POLICY
---------------------------------------------------------

The OBSIDIAN repository follows an implementation-first workflow.

AI assistants must NOT create planning documents, temporary task files, implementation plans, or AI-generated tracking artifacts unless explicitly requested.

Do NOT create, modify, or update files such as:

- implementation_plan.md
- implementation_plan*.md
- task.md
- tasks.md
- task_list.md
- todo.md
- TODO.md
- walkthrough.md
- notes.md
- plan.md
- scratch.md
- Any temporary planning or tracking document

Engineering tickets already define the required work.

Proceed directly to implementation.

---------------------------------------------------------
DOCUMENTATION POLICY
---------------------------------------------------------

After completing an engineering ticket, update ONLY the documentation explicitly required by that ticket.

For standard engineering tickets this includes only:

- ROADMAP.md
- docs/RELEASES/<current_milestone>.md

Do NOT create additional documentation unless the engineering ticket explicitly requires it.

Do NOT generate implementation plans.

Do NOT generate walkthrough documents.

Do NOT generate task files.

Do NOT generate temporary reports.

Documentation should remain permanent, concise, and production-oriented.

---------------------------------------------------------
REPOSITORY CLEANLINESS
---------------------------------------------------------

Every file committed to the repository must serve a long-term purpose.

Do not create:

- temporary planning documents
- AI scratch files
- implementation plans
- task trackers
- walkthrough documents
- temporary notes

If a document is not intended to become part of the permanent project documentation, it should not be created.

---------------------------------------------------------
AI WORKFLOW
---------------------------------------------------------

Every engineering ticket must follow this workflow:

Read Required Documentation

↓

Understand Existing Implementation

↓

Implement Requested Engineering Ticket

↓

Validate

↓

Update Required Documentation

↓

STOP

Never pause to generate implementation plans.

Never create planning artifacts.

Never ask for approval after writing a plan.

Proceed directly to implementation.
