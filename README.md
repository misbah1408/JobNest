# JobNest

JobNest is a comprehensive job portal built with **Next.js**, aimed at bridging the gap between job seekers and employers. It offers a seamless experience with features like user authentication, job postings, application tracking, and intuitive dashboards for both candidates and employers.

## ✨ Features

- ⚡ **High Performance**: Powered by Next.js for speed and scalability.
- 🔒 **Secure Authentication**: Sign up and sign in with protected routes.
- 📄 **Job Listings**: Browse, apply, and track job applications effortlessly.
- 📝 **Job Posting**: Employers can create detailed job postings with title, description, salary, and location.
- 📊 **Employer Dashboard**: Manage job postings, track applications, and monitor hiring progress.
- 🗂️ **Application Management**: Candidates can apply to jobs, and employers can review and manage applications.

## 🚀 Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/misbah1408/JobNest
    cd JobNest
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env.local` file and configure the following:
      - MongoDB URI
      - JWT secret
      - Other necessary environment variables

4. **Run the development server**:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to explore the application.

---

## 📁 Routes Overview

### ✅ Authentication
- `/sign-up`: User registration
- `/sign-in`: User login

### 👥 Candidate
- `/jobs`: Browse available jobs with search features
- `/my-applications`: Track your job applications

### 🧑‍💼 Employer
- `/post-job`: Create a new job posting
- `/dashboard`: View employer stats (jobs posted, applications, hires)
- `/dashboard/posted-jobs`: Manage job postings
- `/dashboard/applicants/:jobId`: Review applicants for a specific job

---

## 🧰 Technologies Used

- **Next.js** – Framework for server-side rendering and static site generation
- **React.js** – Frontend library for building user interfaces
- **Tailwind CSS** – Utility-first CSS framework for styling
- **MongoDB** – NoSQL database for data storage
- **Mongoose** – ODM for MongoDB
- **JWT / NextAuth** – Authentication solutions
- **Cloudinary / Multer** – File uploads (planned for future features)

---

## 📌 Upcoming Features

- Resume upload functionality for job applications
- Advanced job filtering by title, location, and salary
- Real-time notifications for application updates
- Admin panel for job moderation and user management

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

### 👨‍💻 Created by [Mohammed Misbah](https://github.com/misbah1408)
