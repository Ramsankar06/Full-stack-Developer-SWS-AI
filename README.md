# Document Management Dashboard

A full-stack document management dashboard for uploading, tracking, and downloading PDF files. The app includes a React dashboard, Spring Boot REST APIs, MySQL persistence, and WebSocket notifications for bulk uploads.

## Features

- Upload single PDF files with progress tracking
- Upload multiple PDFs in bulk
- View uploaded documents in a document library
- Download stored PDF files
- Receive real-time bulk upload notifications
- Responsive React UI built with Tailwind CSS

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Axios |
| Notifications | SockJS, STOMP WebSocket |
| Backend | Spring Boot, Spring Web, Spring Data JPA |
| Database | MySQL |
| Build Tools | Maven, npm |

## Project Structure

```text
document-dashboard/
├── backend/      # Spring Boot API
├── frontend/     # React + Vite app
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- Java JDK 17 or newer
- Maven
- MySQL Server

## Backend Setup

1. Make sure MySQL is running.
2. Check the database credentials in `backend/src/main/resources/application.properties`.

```properties
spring.datasource.username=root
spring.datasource.password=root
```

3. Start the backend:

```bash
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

Important: keep this terminal open while using the app.

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/upload` | Upload one PDF file using form field `file` |
| `POST` | `/api/upload/bulk` | Upload multiple PDF files using form field `files` |
| `GET` | `/api/documents` | List uploaded documents |
| `GET` | `/api/documents/{id}/download` | Download a document |
| `GET` | `/api/notifications` | List notifications |
| `PUT` | `/api/notifications/{id}/read` | Mark one notification as read |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read |

## Upload Notes

- Only PDF files are accepted.
- Uploaded files are stored locally in `backend/uploads/`.
- Build output, uploaded files, logs, and dependency folders are ignored by Git.

## Build Checks

Run frontend build:

```bash
cd frontend
npm run build
```

Run backend compile:

```bash
cd backend
mvn compile
```

## Troubleshooting

If the backend says the port is already in use, another backend instance is already running. Stop the old Java process or keep using the running instance.

If uploads fail, confirm:

- Backend is running on `http://localhost:8081`
- Frontend is running on `http://localhost:5173`
- MySQL is running with the credentials in `application.properties`
- The selected files are PDFs
