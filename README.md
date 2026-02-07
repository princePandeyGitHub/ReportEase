# ReportEase - AI Health Assistant

Frontend for ReportEase, an AI-powered health assistant that helps users analyze health reports, track symptoms, and get organized insights for better care.

## Backend Repository

- Backend repo: https://github.com/princePandeyGitHub/reportease-backend

## Demo Video
- https://youtu.be/RBznQQuBHKM

## Overview

- ReportEase is an AI-powered healthcare platform designed to help individuals understand, track, and manage their medical data over time. Medical reports are often complex, jargon-heavy, and difficult for non-medical users to interpret. ReportEase bridges this gap by transforming raw medical reports into clear, actionable insights and enabling long-term health tracking with the help of AI.

- Instead of treating medical reports as isolated PDFs, ReportEase builds a continuous health history for each user and provides personalized explanations and guidance based on past data.

- Reports are stored to cloud storage for future access. If users loses his copy in future he won't have to worry because he can download his report with a single click.

## Problem Statement

- Medical test reports are difficult for patients to understand without a doctor.
- Patients often lose past reports or cannot compare them over time.
- Existing health apps usually provide one-time summaries without context or history.
- There is no simple way for users to ask questions like:
1. “Is this value improving or getting worse?”
2. “How does this report compare to my last one?”

## Features

### Medical Report Simplification

- Upload lab reports (PDF).
- Automatically extract key health parameters along with raw text.
- Explain results in simple language.

### Health History & Tracking

- Securely store reports (text and pdf).
- Compare values across multiple reports.
- Detect trends such as improvement, stability, or deterioration.

### AI Health Assistant

- Chatbot answer questions based on the user’s stored reports and previous messages.
- Provides personalized insights instead of generic responses.
- Helps users ask natural questions about their health data.

## Tech Stack

### Frontend
- React
- Tailwind CSS

### Backend
- Node.js with Express.
- REST APIs for reports and user data

### AI & Data Processing
- OCR for medical report text extraction
- AI models for explanation, summarization and chat

### Database
- MongoDB(stores user profile, reports data and chat messages)
- Cloudinary(stores medical reports pdf)

## Disclaimer
- ReportEase is not a replacement for professional medical advice. It is intended to assist users in understanding and tracking their medical data and should always be used alongside consultation with qualified healthcare professionals.

## Author
Prince Pandey
