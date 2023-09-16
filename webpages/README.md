# About

This directory is a sub-project of Learner that provides the web pages for the web application. It is written in TypeScript with React and Material UI, on top of Vite.

# Requirements

Installation requires Node version 20.4.0 or greater.

# Installation

1\. Clone this repository:

```bash
git clone https://github.com/glourencoffee/Learner.git
```

2\. Head to the `webpages` directory:

```bash
cd Learner/webpages
```

3\. Install the dependencies:

```bash
npm install
```

4\. Create a file with name `.env` and set the URL variables to the [webservices](https://github.com/glourencoffee/Learner/tree/main/webservices) server:

```
VITE_WEBSERVICES_HOST=localhost
VITE_WEBSERVICES_PORT=3000
```

5\. Build the production version:

```bash
npm run build
```

6\. Run the website:

```bash
npm run preview
```

# Pages

## Knowledge Area
  - `/knowledgearea/new`: Creates a new knowledgearea area.
  - `/knowledgearea/{id}/edit`: Edits a knowledge area.
  - `/knowledgearea/{id}`: Shows the tree of a knowledge area.
  - `/knowledgearea/`: Shows top-level knowledge areas.

## Topic
  - `/topic/new`: Creates a topic.
  - `/topic/{id}/edit`: Edits a topic.

## Question
  - `/question/new`: Creates a question.
  - `/question/{id}/edit`: Edits a question.
  - `/question/{id}`: Shows one question.
  - `/question`: Shows a list of questions.

# Backlog

- Paginate `/question`
- Update `TreeSelect` data after form submit
- Show statistics of user performance
- Allow multiple users