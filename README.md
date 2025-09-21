
# Lexilight: AI-Powered Legal Document Demystifier

**Lexilight** is an intelligent, web-based application designed to make complex legal documents accessible and understandable to everyone. By leveraging the power of generative AI, it transforms dense legal text into simple summaries, explains confusing jargon, and answers user questions in plain language.

The application is built with a focus on privacy and ease of use, requiring no user accounts and processing documents securely without storing them on our servers.

![Lexilight Logo](https://storage.googleapis.com/stelo-assets/lexilight/logo.png)

---

## Core Features

Lexilight offers a suite of powerful features to help users navigate legal documents with confidence:

*   **AI-Powered Key Point Summary:** Automatically analyzes your document and generates a concise summary of the most critical information, including the purpose of the agreement, the parties involved, and core obligations.

*   **Interactive Jargon Explainer:** Demystify complex legal terminology on the fly. Simply highlight any confusing word or phrase to receive an instant, plain-language explanation.

*   **Intelligent Question & Answer (Q&A):** Engage in a natural conversation with your document. Ask specific questions and get direct, relevant answers sourced from the text.

*   **Multi-Language Accessibility:** Instantly toggle the entire analysis—including summaries, explanations, and Q&A—between English and Hindi, breaking down language barriers.

*   **Audio Summaries (Text-to-Speech):** Listen to the generated summary with a single click, providing a convenient, hands-free option for consuming information.

*   **Secure & Private by Design:** Built for trust and confidentiality with a stateless architecture, no account requirements, and local-only storage for analysis history. Your documents are never stored on our servers.

## Technology Stack

This project is built on a modern, full-stack architecture designed for performance, scalability, and a great developer experience.

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **AI Orchestration:** [Genkit](https://firebase.google.com/docs/genkit)
*   **AI Models:** [Google Gemini](https://deepmind.google/technologies/gemini/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-repository/lexilight.git
    cd lexilight
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY
    ```

### Running the Application

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will start the Next.js application, typically on `http://localhost:9002`.

2.  **Start the Genkit developer UI (optional):**
    In a separate terminal, run:
    ```sh
    npm run genkit:watch
    ```
    This will start the Genkit development server and UI, which you can access at `http://localhost:4000` to inspect and debug your AI flows.

---

© 2024 Lexilight. All rights reserved.
