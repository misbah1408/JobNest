# JobNest

JobNest is a job portal built using **Next.js**, designed to connect job seekers with employers. It features user authentication, job posting, application management, and a clean UI for both candidates and employers.

## ✨ Features

- ⚡ Built with Next.js for fast performance and scalability.
- 🧑‍💻 **Authentication**: Sign Up / Sign In with secure routes.
- 📄 **Job Listings**: View jobs, apply, and track applications.
- 📝 **Job Posting**: Employers can post jobs with title, description, salary, and location.
- 📊 **Employer Dashboard**: Track posted jobs, applications, accepted hires, and pending statuses.
- 🗂️ **Applications**: Users can apply to jobs and employers can manage applications.

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

3. **Configure environment variables**:
    - Create a `.env.local` file and add your MongoDB URI and other necessary configs.

4. **Run the development server**:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Routes Overview

### ✅ Auth
- `/sign-up`: User registration page
- `/sign-in`: User login page

### 👥 Candidate
- `/jobs`: View all available jobs
- `/my-applications`: View your submitted applications

### 🧑‍💼 Employer
- `/post-job`: Post a new job
- `/dashboard`: View stats (jobs posted, applications, hires)
- `/dashboard/posted-jobs`: Manage posted jobs
- `/dashboard/applicants/:jobId`: View applicants for a job

---

## 🧰 Technologies Used

- **Next.js** – App framework
- **React.js** – Frontend
- **Tailwind CSS** – Styling
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **JWT / NextAuth** – Authentication (if added later)
- **Cloudinary / Multer (optional)** – Resume uploads (for future)

---

## 📌 Upcoming Features (Planned)

- Resume upload on application
- Filter jobs by title, location, salary
- Notification system for application status
- Admin panel (for job moderation)

---

## 📄 License

This project is licensed under the MIT License.

---

### 👨‍💻 Created by [Mohammed Misbah](https://github.com/misbah1408)
