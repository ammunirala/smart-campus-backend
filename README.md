\# Smart Campus Management System



A full-stack \*\*Smart Campus Management System\*\* built to manage students, teachers, courses, attendance, and administrative operations through a centralized platform.



The application uses a \*\*React + Vite frontend\*\*, a secure \*\*Spring Boot REST API\*\*, \*\*JWT-based authentication\*\*, role-based authorization, and a cloud-hosted \*\*MySQL database\*\*.



\## Live Demo



\*\*Live Application:\*\*  

https://smart-campus-management-system-blush.vercel.app



\*\*Backend API:\*\*  

https://smart-campus-api-0sf9.onrender.com



> \*\*Note:\*\* The backend is deployed on Render's free tier. The first request may take some time if the service has been inactive.



\---



\## Features



\- Secure JWT-based authentication

\- Role-based access control

\- Admin dashboard

\- Student management

\- Teacher management

\- Course management

\- Attendance management

\- Student-course assignments

\- Teacher-course assignments

\- Protected REST API endpoints

\- BCrypt password encryption

\- Responsive user interface

\- Cloud-hosted database



\---



\## Tech Stack



\### Frontend



\- React

\- Vite

\- JavaScript

\- Axios

\- HTML5

\- CSS3



\### Backend



\- Java 17

\- Spring Boot

\- Spring Security

\- JWT Authentication

\- Spring Data JPA

\- Hibernate

\- Maven

\- REST APIs



\### Database



\- MySQL

\- Aiven Cloud MySQL



\### Deployment \& Tools



\- Docker

\- Git \& GitHub

\- Vercel

\- Render

\- Aiven



\---



\## System Architecture



```text

&#x20;               User

&#x20;                 |

&#x20;                 v

&#x20;         React + Vite

&#x20;            Frontend

&#x20;            (Vercel)

&#x20;                 |

&#x20;                 | HTTPS / REST API

&#x20;                 v

&#x20;         Spring Boot API

&#x20;             (Render)

&#x20;                 |

&#x20;          Spring Data JPA

&#x20;           / Hibernate

&#x20;                 |

&#x20;                 v

&#x20;          MySQL Database

&#x20;             (Aiven)

```



\---



\## Security



The application uses \*\*Spring Security with JWT authentication\*\* to secure backend resources.



Security features include:



\- Stateless authentication

\- JWT token generation and validation

\- BCrypt password hashing

\- Role-based authorization

\- Protected REST endpoints

\- CORS configuration

\- Spring Security filter chain



\---



\## Project Structure



```text

smart-campus-management-system/

│

├── frontend/

│   ├── src/

│   ├── package.json

│   └── vite.config.js

│

├── backend/

│   ├── src/

│   ├── pom.xml

│   └── Dockerfile

│

└── README.md

```



\---



\## Running the Project Locally



\### 1. Clone the Repository



```bash

git clone https://github.com/ammunirala/smart-campus-management-system.git

cd smart-campus-management-system

```



\### 2. Run the Backend



```bash

cd backend

./mvnw spring-boot:run

```



Configure the required MySQL and JWT environment variables before starting the backend.



\### 3. Run the Frontend



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Configure the frontend API URL:



```env

VITE\_API\_URL=http://localhost:8081/api

```



The frontend will be available locally through the Vite development server.



\---



\## REST API Modules



The backend provides REST APIs for:



\- Authentication

\- Students

\- Teachers

\- Courses

\- Attendance

\- Administrative dashboard



Protected endpoints require a valid JWT token.



\---



\## Cloud Deployment



```text

Frontend       → Vercel

Backend API    → Render

Database       → Aiven MySQL

Container      → Docker

Source Control → GitHub

```



\---



\## Future Improvements



\- Advanced dashboard analytics

\- Attendance reports and visualization

\- Student performance tracking

\- Search and filtering

\- User profile management

\- Notification system

\- Additional role-specific dashboards

\- Improved mobile responsiveness



\---



\## Author



\*\*Amresh Kumar Nirala\*\*



B.Tech Computer Science \& Engineering  

Java \& Spring Boot Developer



\*\*GitHub:\*\*  

https://github.com/ammunirala



\*\*LinkedIn:\*\*  

https://www.linkedin.com/in/amresh-nirala2003



\---



If you find this project useful, consider giving the repository a star.

