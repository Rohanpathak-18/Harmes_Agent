🚀 Harmes AI Content Operating System

An AI-powered Content Operating System for discovering ideas, researching information, planning content, generating scripts, producing assets, validating content, managing approvals, publishing, and learning from results.»

Harmes is designed as a provider-independent, approval-controlled, agentic AI platform. Instead of being a single AI chatbot, Harmes coordinates specialized agents, tools, workflows, memory, content production, quality checks, approvals, publishing, analytics, and learning through one unified system.

---

✨ Overview

Modern content creation requires multiple disconnected tools for:

- Discovering content opportunities
- Researching topics
- Collecting sources
- Writing scripts
- Generating media
- Quality checking
- Managing approvals
- Publishing
- Tracking performance
- Learning from previous content

Harmes brings these stages together into one orchestrated workflow.

Core Workflow

Discover
   ↓
Score
   ↓
Research
   ↓
Plan
   ↓
Create
   ↓
Assemble
   ↓
Validate
   ↓
Approve
   ↓
Publish
   ↓
Analyze
   ↓
Learn

Human approval remains a mandatory control point before publishing.

---

🧠 What Is Harmes?

Harmes is an Agentic AI Content Operating System built around:

- AI Agents
- Tool Bus
- Provider Adapters
- Workflow Orchestration
- Research & RAG
- Content Planning
- Script Generation
- Asset Production
- Quality Assurance
- Human Approval
- Publishing
- Analytics
- Learning

The system is designed so that external AI providers and execution services can be replaced without changing the core Harmes architecture.

---

🏗️ Architecture

                         ┌──────────────────────┐
                         │      Harmes UI       │
                         │    React / PWA       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Harmes API      │
                         │  Node.js / Express   │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌──────────────┐       ┌─────────────┐
      │ Agent       │       │ Workflow     │       │ Tool Bus    │
      │ Runtime     │       │ Orchestrator │       │             │
      └──────┬──────┘       └──────┬───────┘       └──────┬──────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
       ┌───────────┐          ┌───────────┐         ┌────────────┐
       │ MongoDB   │          │   Redis   │         │ AI / APIs  │
       │           │          │  BullMQ   │         │ Providers  │
       └───────────┘          └───────────┘         └────────────┘

---

🔄 Content Lifecycle

Every content job moves through controlled workflow states.

DISCOVERED
    ↓
RESEARCHING
    ↓
RESEARCH_READY
    ↓
SCRIPTING
    ↓
PRODUCTION
    ↓
FINAL_QA
    ↓
WAITING_APPROVAL
    ↓
APPROVED
    ↓
SCHEDULED
    ↓
PUBLISHED
    ↓
ANALYZING
    ↓
LEARNED

The publishing system rejects jobs that have not reached the required approval state.

---

🤖 Agent System

Harmes uses specialized agents instead of putting every responsibility into one large AI prompt.

Core Agents

Agent| Responsibility
Master Agent| Coordinates high-level execution
Trend Agent| Discovers content opportunities
Research Agent| Researches topics and gathers sources
Source / Fact Agent| Handles source and factual verification
Context Agent| Provides relevant context
Content Planner Agent| Converts research into content plans
Writer Agent| Generates scripts
Story Agent| Handles narrative structure
Channel Agent| Adapts content for channels
Visual Director| Plans visual requirements
Image / Video Agent| Handles media generation
Voice / Music Agent| Handles audio requirements
Editor Agent| Coordinates editing requirements
Thumbnail / SEO Agent| Handles packaging and optimization
QA Agent| Validates generated content
Approval Agent| Controls human approval
Publisher Agent| Handles controlled publishing
Analytics Agent| Processes performance information
Learning Agent| Extracts reusable learning
Developer Agent| Supports system/tool development

---

🛠️ Tool Bus

Harmes does not tightly couple agents to external providers.

Instead:

Agent
  ↓
Tool
  ↓
Capability
  ↓
Provider Adapter
  ↓
External Service

For example:

Research Agent
      ↓
web-search
      ↓
web.search
      ↓
Tavily / another provider

This allows providers to be replaced without rewriting the agents.

---

🔁 Provider Fallback

Providers are registered against capabilities.

Capability
    │
    ├── Provider A
    ├── Provider B
    └── Provider C

Harmes can attempt providers according to configured priority and fall back when a provider fails.

The architecture is designed around:

- Provider independence
- Capability-based execution
- Failure recovery
- Replaceable adapters
- Centralized tool execution

---

🔎 Research & RAG

Harmes includes a research and retrieval pipeline.

Research Flow

Topic
  ↓
Web Search
  ↓
Sources
  ↓
Research Pack
  ↓
Chunks
  ↓
Embeddings
  ↓
Vector Database
  ↓
Retriever
  ↓
Relevant Context
  ↓
LLM

Research information can be classified as:

FACT
CLAIM
INTERPRETATION
UNKNOWN

This helps separate verified information from claims or uncertain information.

---

🧠 Memory

Harmes is designed with multiple forms of system memory.

Memory can be used for:

- Previous research
- Content context
- Historical outputs
- Workflow state
- Learning signals
- Reusable knowledge

The long-term goal is for Harmes to improve its content decisions using previous results while maintaining governance and approval controls.

---

✍️ Content Generation

The content pipeline currently supports structured generation of:

- Content plans
- Titles
- Hooks
- Introductions
- Sections
- Conclusions
- CTAs
- Full scripts
- Keywords
- Content formats
- Target audiences

The LLM is used through a provider adapter rather than being embedded directly into individual agents.

---

🎬 Production Pipeline

The production layer converts scripts into structured production requirements.

Script
  ↓
Scene Planning
  ↓
Asset Requirements
  ↓
Media Generation
  ↓
Asset Records
  ↓
Video Assembly
  ↓
Quality Assurance

Asset types include:

Image
Video
Audio
Voiceover
Music
Thumbnail

---

✅ Quality Assurance

Before approval, generated content passes through QA.

QA can evaluate:

- Title
- Script
- Scenes
- Assets
- CTA
- Content structure
- Basic originality patterns
- Warnings
- Issues

The system produces a structured QA result containing:

Passed
Score
Checks
Issues
Warnings
Status

---

👤 Human Approval

Harmes is designed with human-in-the-loop governance.

The system does not allow the publisher to bypass the approval stage.

FINAL_QA
    ↓
WAITING_APPROVAL
    ↓
Human Review
    ↓
APPROVED
    ↓
SCHEDULED
    ↓
PUBLISHED

This prevents autonomous publishing of unapproved content.

---

📤 Publishing

The publishing layer is provider-independent.

Current architecture uses a YouTube publishing adapter.

Approved Job
    ↓
Publishing Queue
    ↓
Publisher Agent
    ↓
YouTube Adapter
    ↓
Publication Record

Publishing is intentionally separated from content creation and approval.

---

📊 Analytics

After publishing, Harmes can store analytics associated with the content job.

Analytics can include information such as:

- Views
- Engagement
- Performance metrics
- Content results

These results can later be passed into the learning system.

---

🧠 Learning Loop

The long-term learning architecture is:

Published Content
       ↓
Performance Data
       ↓
Analytics
       ↓
Learning Agent
       ↓
Insights
       ↓
Future Content Decisions

The goal is to create a continuous improvement loop rather than treating every content job as an isolated task.

---

🔐 Security & Governance

Security is a core architectural concern.

Harmes includes:

- HTTP-only authentication cookies
- Password hashing
- Session management
- OTP verification
- Password reset
- Rate limiting
- Helmet security middleware
- CORS configuration
- Organization/membership concepts
- Audit logging
- Capability-based tool permissions
- Approval controls
- Provider abstraction
- Controlled publishing

Governance Principles

Research agents should not publish.

Production agents should not approve their own work.

Publishing should consume only approved jobs.

Important actions should be auditable.

Secrets should remain outside source code.

---

🔑 Authentication

Authentication includes:

Register
   ↓
Email Verification
   ↓
Login
   ↓
Session
   ↓
Authenticated API

Additional authentication functionality includes:

- Email OTP
- Forgot Password
- Password Reset
- Logout
- Current User
- Session validation

---

🗂️ Project Structure

Harmes_Agent/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── queues/
│   │   ├── workers/
│   │   └── utils/
│   │
│   └── package.json
│
├── agents/
│   ├── core/
│   ├── research/
│   ├── content/
│   ├── production/
│   ├── qa/
│   └── approval/
│
├── tools/
│   ├── registry/
│   ├── providers/
│   └── adapters/
│
├── workflows/
│   ├── states/
│   ├── jobs/
│   └── orchestrator/
│
├── shared/
│
├── docker/
│
├── package.json
└── README.md

---

🧰 Technology Stack

Frontend

- React
- Vite
- React Router
- Axios
- Zustand
- Tailwind CSS
- Lucide React
- Framer Motion
- Vite PWA

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT/session-based authentication
- Nodemailer
- Zod
- Helmet
- CORS
- Express Rate Limit

AI / RAG

- Hugging Face Inference
- LLM provider adapters
- Embedding models
- LanceDB
- Retrieval pipelines

Agent Architecture

- Custom Agent Runtime
- Agent Registry
- Tool Registry
- Tool Bus
- Provider Registry
- Provider Fallback

Background Processing

- Redis
- BullMQ
- Worker processes

Deployment

- Render
- MongoDB Atlas
- Redis
- GitHub

---

⚙️ Local Development

1. Clone

git clone https://github.com/Rohanpathak-18/Harmes_Agent.git
cd Harmes_Agent

2. Install root dependencies

npm install

3. Install server dependencies

cd server
npm install
cd ..

4. Install client dependencies

cd client
npm install
cd ..

---

🔐 Environment Variables

Create:

server/.env

Example:

PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

HF_TOKEN=your_huggingface_token
HF_MODEL=your_huggingface_model

TAVILY_API_KEY=your_tavily_key

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password

Never commit real credentials.

---

▶️ Run the Backend

cd server
npm run dev

Backend:

http://localhost:5000

---

▶️ Run the Frontend

In another terminal:

cd client
npm run dev

Frontend:

http://localhost:5173

---

⚡ Background Workers

Normal worker:

cd server
npm run worker

Publishing worker:

cd server
npm run publish-worker

Redis must be running for BullMQ queues.

---

🐳 Docker

Docker support is part of the project architecture and is intended for reproducible development and production infrastructure.

The infrastructure can be organized around:

React Client
     ↓
Node API
     ↓
MongoDB
     ↓
Redis
     ↓
BullMQ Workers

---

🌐 Production Architecture

                    ┌────────────────────┐
                    │   React / PWA      │
                    │ Render Static Site  │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    Harmes API      │
                    │ Render Web Service │
                    └──────┬──────┬──────┘
                           │      │
                  ┌────────┘      └────────┐
                  ▼                       ▼
          ┌──────────────┐        ┌──────────────┐
          │ MongoDB Atlas│        │ Redis        │
          └──────────────┘        └──────┬───────┘
                                         │
                                  ┌──────┴───────┐
                                  ▼              ▼
                            Normal Worker   Publisher Worker

---

🔌 API Modules

The backend is organized around modular API domains.

Examples include:

/api/auth
/api/jobs
/api/workflow
/api/approval
/api/publications
/api/analytics
/api/job-insights
/api/learning
/api/retry
/api/health
/api/system

---

🧪 Development Philosophy

Harmes follows several architectural principles.

1. Provider Independence

AI and external services should be replaceable.

2. Capability-Based Tools

Agents request capabilities rather than directly depending on providers.

3. Human Approval

Important publishing actions require explicit approval.

4. Modular Agents

Agents should have clear responsibilities.

5. Structured Workflows

Content moves through controlled states.

6. Failure Recovery

Provider failures and workflow failures should be recoverable.

7. Auditability

Important decisions and actions should be traceable.

8. Platform Independence

The backend API is designed so that future clients can consume the same platform.

---

🗺️ Roadmap

Phase 1 — Core MVP

- [x] Authentication
- [x] Session management
- [x] OTP architecture
- [x] Agent runtime
- [x] Agent registry
- [x] Tool registry
- [x] Tool bus
- [x] Provider adapters
- [x] Research pipeline
- [x] LLM integration
- [x] Content planning
- [x] Script generation
- [x] Production pipeline
- [x] QA pipeline
- [x] Approval workflow
- [x] Publishing architecture
- [x] Analytics architecture
- [x] Learning architecture
- [x] API deployment

Phase 2 — Production Hardening

- [ ] Production email provider
- [ ] Production Redis
- [ ] Background workers
- [ ] Full publishing integrations
- [ ] Robust retry and recovery
- [ ] Advanced audit logging
- [ ] Provider health monitoring
- [ ] Better observability

Phase 3 — Advanced Intelligence

- [ ] Advanced RAG memory
- [ ] Long-term content memory
- [ ] Content performance learning
- [ ] Improved autonomous planning
- [ ] Multi-provider optimization
- [ ] Advanced trend intelligence

Phase 4 — Multi-Channel Content OS

- [ ] YouTube
- [ ] Instagram
- [ ] LinkedIn
- [ ] X
- [ ] Additional publishing channels
- [ ] Channel-specific content adaptation
- [ ] Cross-platform analytics

Phase 5 — Hermes Developer

- [ ] AI-assisted tool creation
- [ ] Agent generation
- [ ] Workflow generation
- [ ] Automated testing
- [ ] System diagnostics
- [ ] Developer automation

---

📈 Long-Term Vision

The long-term goal of Harmes is to evolve from a content automation platform into a general-purpose AI Content Operating System.

Instead of:

Human
 ↓
Tool 1
 ↓
Tool 2
 ↓
Tool 3
 ↓
Tool 4

Harmes aims for:

Human Goal
    ↓
Harmes
    ↓
Understand
    ↓
Research
    ↓
Plan
    ↓
Create
    ↓
Validate
    ↓
Request Approval
    ↓
Publish
    ↓
Learn

The system should coordinate the underlying tools while keeping humans in control of important decisions.

---

🤝 Contributing

Contributions, ideas, and improvements are welcome.

Recommended contribution process:

git checkout -b feature/your-feature

Make your changes, test them locally, then:

git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature

Open a Pull Request with:

- What changed
- Why it changed
- How it was tested
- Any known limitations

---

🔒 Security

Never commit:

.env
API keys
Database credentials
SMTP passwords
Hugging Face tokens
Tavily API keys
Session secrets
Private credentials

If a credential is accidentally exposed, rotate it immediately.

---

📄 License

License information will be added as the project reaches its public release stage.

---

👨‍💻 Author

Rohan Pathak

Full Stack Developer | Generative AI Developer

GitHub:
https://github.com/Rohanpathak-18

LinkedIn:
https://www.linkedin.com/in/rohan-pathak-76367b329/

---

⭐ Project Status

Harmes is actively under development.

The current implementation focuses on building the core platform:

Agents
+
Tools
+
Providers
+
Workflows
+
RAG
+
Content Generation
+
QA
+
Approval
+
Publishing
+
Analytics
+
Learning

The architecture is being developed incrementally toward a production-ready, multi-channel AI Content Operating System.

---

🚀 Harmes

One goal → coordinated AI agents → controlled execution → measurable learning.
