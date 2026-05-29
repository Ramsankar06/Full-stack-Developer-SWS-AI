# Document Management Dashboard

A full-stack web application designed for seamless and efficient document management. The application features a clean, responsive React frontend integrated with a robust Spring Boot backend, utilizing a MySQL database for reliable persistence and WebSockets for real-time notifications.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Hot Toast, SockJS, STOMP
- **Backend**: Spring Boot 3, Spring Web, Spring Data JPA, Spring WebSocket
- **Database**: MySQL

## Prerequisites
- Node.js (v18+)
- Java JDK 17
- MySQL Server (v8+)
- Maven

## Database Setup (MySQL)
1. Ensure MySQL is running on your local machine.
2. The application will automatically create a database named `document_dashboard` if it does not exist (configured in `application.properties`).
3. Update `backend/src/main/resources/application.properties` with your MySQL credentials:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=root
    ```

## Running the Backend (Spring Boot)
1. Open a terminal and navigate to the `backend` directory.
2. Run the application using Maven:
   ```bash
   cd backend
   mvnw spring-boot:run
   ```
   *The backend will start on port `8080`.*

## Running the Frontend (React + Vite)
1. Open a new terminal and navigate to the `frontend` directory.
2. Install the necessary dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

## Feature Overview & API Flow
### 1. Document Upload
- **Single Upload**: Drag-and-drop or select up to 3 PDFs. Frontend sends individual `POST /api/upload` requests, displaying a real-time progress bar for each file using Axios `onUploadProgress`.
- **Smart Bulk Upload**: When 4 or more PDFs are selected, a background process is triggered via `POST /api/upload/bulk`. The UI updates to a minimized, collapsible view with an immediate toast indicating background processing.

### 2. Real-time WebSocket Notifications
- When a **bulk upload** completes, the backend utilizes Spring's `SimpMessagingTemplate` to broadcast a message to the `/topic/notifications` STOMP endpoint.
- The frontend, connected via `SockJS` and `@stomp/stompjs`, instantly receives this event, updates the notification bell's unread badge, and triggers a success toast ("X files uploaded successfully").

### 3. Document Library
- Once uploaded, files are saved locally in the `uploads/` directory on the server, and their metadata (name, size, path, timestamp) is persisted in the MySQL `document` table.
- The frontend fetches and displays this library via `GET /api/documents`, allowing users to download any file via `GET /api/documents/{id}/download`.

## Git Commit Timeline
The repository was constructed following this progressive commit timeline, reflecting a systematic 15-minute milestone approach:

1. `Initialized Spring Boot backend` - Set up Maven project with Spring Web, JPA, WebSocket dependencies.
2. `Implemented Document, Notification and WebSocket APIs` - Created JPA entities, services, controllers, and STOMP WebSocket configuration.
3. `Implemented React frontend UI and integrated APIs` - Initialized Vite+React, configured Tailwind CSS, and built UI components (UploadBox, FileProgressCard, DocumentTable, NotificationBell, Dashboard).
4. `Final polish and added README documentation` - Added this comprehensive project setup and technical overview.

## Environment Variables
The frontend defaults to hitting `http://localhost:8080/api`. If you wish to change this, modify the `baseURL` in `frontend/src/services/api.js` and `WEBSOCKET_URL` in `frontend/src/websocket/websocket.js`.
