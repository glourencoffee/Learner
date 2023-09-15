# About

> Without training, they lacked knowledge. Without knowledge, they lacked confidence. Without confidence, they lacked victory. <br>
> \- Unknown

*Learner* is a web application that allows one to create, manage, and answer questions of various areas of knowledge. Its purpose is to assist one in their study goals, be it general learning or preparing for an exam. I decided to develop this application after finding out that creating and answering my own questions is personally helpful for learning. Using flashcards could only go so far, hence this application.

# Design

First, some definitions:

- A *user* is a person who uses Learner.
- A *question* is something that tests a user's knowledge.
- An *answer* is a single attempt of a user at testing their knowledge.
- *Knowledge classification* organizes questions. Without it, there would only be a bunch, possibly thousands, of questions, scattered through the application's database without discretion. There are two concepts in the knowledge classification system used by Learner:
  - A *knowledge area* groups other knowledge areas or topics.
  - A *topic* is an element of knowledge.


Below is an example of how the concepts of knowledge classification used by Learner may allow organizing questions. The format below has knowledge areas (bolded) and topics (not bolded):

- **Computer Science**
  - **Computer Programming**
    - **Algorithms and Data Structures**
      - **Sorting Algoritms**
        - Bubble Sort
        - Heap Sort
        - Merge Sort
    - **Paradigms**
      - **Object Oriented Programming**
        - Inheritance
        - Polymorphism
    - **Programming Languages**
      - **Python**
        - Logical operations
        - Aritmethic operations
        - Flow-control structures
        - Built-in functions
        - Lists
      - **C++**
        - Concepts
        - Pointers
        - Template Meta-Programming
        - Standard Library: vector
        - Standard Library: string
  - **Computer Network**
    - **OSI**
      - **Physical Layer (Layer 1)**
        - **Guided Transmission Media**
          - Twisted Pair Cable
          - Coaxial Cable
      - **Data Link Layer (Layer 2)**
      - **Network Layer (Layer 3)**

The structure above is a *suggestion* of how knowledge could be classified. It is up to the user to define a structure, since Learner does not come with a built-in structure. (Yes, I know, this can be challenging.) Once the knowledge classification structure is defined, questions can be created.

A question is associated with at least one topic, and may be associated with many topics. This allow composing multi-topic questions. For example, a question that compares the syntax of C++ (knowledge area) and Python (knowledge area) could be associated with topics from both of these areas.

Note that the purpose of knowledge areas is mainly to organize content, so questions cannot be associated with them directly. However, a question which is associated with a topic X can be thought of as being indirectly associated with the knowledge areas which enclose X. For example, a question associated with the topic "Computer Science / Computer Programming / Programming Languages / C++ / Pointers" can be thought of as being indirectly associated with all the enclosing areas, that is:

- Computer Science
- Computer Science / Computer Programming
- Computer Science / Computer Programming / Programming Languages
- Computer Science / Computer Programming / Programming Languages / C++

This is useful for filtering questions and providing statistics about the user performance.

# Repository Structure

This repository is divided into two sub-directories, `webpages` and `webservices`, which are responsible for the front-end and the back-end of the application, respectively. Each sub-directory contains their own instructions for building and running the applications.