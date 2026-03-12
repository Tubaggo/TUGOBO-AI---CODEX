# Tugobo AI Conversation and Operational Flows

## 1. Primary Conversation Flow

### Availability and Reservation Inquiry

1. Guest opens a channel and sends an initial message.
2. AI detects language and intent.
3. AI checks whether required booking details are present.
4. AI asks for missing slots:
   - check-in date
   - check-out date
   - number of adults
   - number of children
   - room count if relevant
5. AI validates the dates and occupancy.
6. AI queries inventory/rate source or configured quoting logic.
7. AI presents matching options with concise room and rate details.
8. AI asks for the next step:
   - reserve now
   - ask a follow-up question
   - request human agent
9. If the guest wants to proceed, AI collects contact details and confirmation information.
10. System creates or updates a lead and reservation attempt record.
11. Booking is either:
   - finalized through integration
   - handed to staff for manual confirmation
   - redirected to booking engine with tracked attribution

## 2. FAQ Flow

1. Guest asks a property question.
2. AI classifies the question against FAQ/policy categories.
3. AI retrieves the canonical answer.
4. AI responds with a short, direct answer.
5. AI asks whether the guest also wants help with availability or reservation.
6. If the answer is low confidence, AI escalates or gives a safe fallback.

## 3. Human Handoff Flow

1. AI detects a handoff trigger.
2. Trigger types:
   - low confidence
   - unsupported language
   - complaint or sensitive issue
   - VIP or negotiated pricing request
   - group booking
   - repeated misunderstanding
3. AI informs the guest that a human agent will assist.
4. System creates a summary including:
   - guest intent
   - collected details
   - unresolved questions
   - suggested next action
5. Conversation status becomes `escalated`.
6. Assigned staff member receives notification.
7. Agent takes over and conversation becomes manual until released back to AI.

## 4. Lead Follow-Up Flow

1. Guest receives a quote but does not book.
2. System waits for a configurable delay.
3. Automation checks stop conditions:
   - booking already confirmed
   - guest opted out
   - conversation closed as lost
4. System sends a follow-up message.
5. If the guest replies, AI resumes the active conversation with prior context.
6. If no reply after configured attempts, lead status becomes `cold` or `lost`.

## 5. Upsell Flow

1. A guest reaches a qualifying stage in the reservation process.
2. AI identifies eligible upsells based on stay profile and property settings.
3. AI offers one or two relevant add-ons:
   - breakfast
   - airport transfer
   - spa package
   - late checkout
4. Guest accepts, declines, or asks for details.
5. System records upsell interest and updates the quote or handoff summary.

## 6. Multi-Language Flow

1. Guest starts in any supported language.
2. AI detects or infers the language.
3. The conversation remains in that language unless the guest switches.
4. Internal summaries and dashboard fields may remain standardized in the account default language.
5. If the language is unsupported or ambiguous, AI asks a clarifying language-selection question.

## 7. Error and Recovery Flows

### Availability Lookup Failure

1. External inventory tool fails or times out.
2. AI avoids promising availability.
3. AI tells the guest the team is checking current availability.
4. Conversation is escalated or queued for manual follow-up.

### Ambiguous Dates

1. Guest enters unclear dates.
2. AI asks for dates in an explicit format.
3. AI confirms parsed values before quoting.

### Policy Conflict

1. Guest asks for something against property policy.
2. AI states the policy clearly and politely.
3. AI offers allowed alternatives if available.

## 8. Dashboard Operational Flow

### Agent Takeover

1. Agent opens inbox.
2. Agent filters escalated conversations.
3. Agent reviews AI summary and transcript.
4. Agent takes over, replies, and resolves or advances the lead.
5. Agent can return the conversation to AI after resolution.

### Knowledge Update

1. Manager notices repeated unanswered questions in analytics.
2. Manager adds or updates FAQ/policy entries.
3. Updated content is published.
4. New answers are available to future conversations.

## 9. Lifecycle Status Model

### Conversation Statuses

- `new`
- `active`
- `awaiting-guest`
- `awaiting-team`
- `escalated`
- `resolved`
- `closed`

### Lead Statuses

- `new`
- `qualified`
- `quoted`
- `negotiating`
- `won`
- `lost`
- `spam`

### Reservation Statuses

- `draft`
- `pending-confirmation`
- `confirmed`
- `cancelled`
- `failed`
