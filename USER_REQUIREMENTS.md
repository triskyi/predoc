# User Requirements for PREDOC Admin Dashboard

1. **Authentication & Authorization**

   - Only authenticated users can access the system.
   - Only users with the `admin` role can access the admin dashboard and APIs.
   - Support for multiple user roles: `admin`, `doctor`, `nurse`.

2. **Admin Dashboard**

   - Admins can view quick stats: total users, total patients, total medical records, predictions.
   - Admins can view disease trends (malaria, dengue, typhoid) over time.
   - Admins can view recent activities and recent users.
   - Admins can export data (users, patients, records, or all) in JSON or CSV format.

3. **User Management**

   - Admins can view, add, and delete users.
   - When adding a user, admin must provide name, email, role, and password.
   - User roles must be one of: `doctor`, `nurse`, `admin`.

4. **Patient Management**

   - Admins can view, add, and delete patients.
   - Patient fields: full name, age, gender, region, weight, pregnant status, G6PD deficiency.

5. **Medical Records Management**

   - Admins can view, add, and delete medical records.
   - Each record links to a patient and a user (doctor/nurse), includes symptoms, previous medications, and prediction result.

6. **Analytics & Reports**

   - Admins can view charts for:
     - Disease trends (malaria, dengue, typhoid)
     - Patient gender distribution
     - User role distribution
     - Patient region distribution

7. **Settings**

   - Admins can change system settings (theme, notifications) from the dashboard.

8. **Security**

   - All admin APIs are protected and only accessible to users with the `admin` role.
   - Passwords are securely hashed before storing in the database.

9. **UI/UX**

   - The dashboard uses a sci-fi/neon color palette.
   - All features are accessible from a single dashboard page (no navigation to other pages).
   - Loading skeletons are shown while data is loading.
   - All management actions (add/delete) are available via modals or inline forms.

10. **Other**

    - The system is built with Next.js, Prisma, and NextAuth.
    - All API endpoints are implemented under `/api/admin/`.

11. **Non-Admin User Requirements**
    - Non-admin users are called **Supervisors** (roles: `doctor`, `nurse`).
    - Supervisors can log in and access the predictor interface.
    - Supervisors can:
      - View and manage their assigned patients.
      - Add and update medical records for patients they handle.
      - Use the disease prediction tool for patient diagnosis.
      - View their own profile and update personal information.
    - Supervisors cannot access admin-only features (dashboard, user management, analytics, export, or settings).
    - The UI for supervisors is focused on patient care, record entry, and prediction, not on system management.

---

# System Requirements

## Functional Requirements

- The system must allow user registration and authentication for all roles.
- The system must restrict admin dashboard and API access to users with the `admin` role.
- The system must allow admins to manage users, patients, and medical records (CRUD).
- The system must allow supervisors (doctors, nurses) to manage their assigned patients and records.
- The system must provide a disease prediction tool for supervisors.
- The system must display analytics and reports for admins.
- The system must allow admins to export data in JSON or CSV format.
- The system must allow admins to change system settings (theme, notifications).
- The system must hash and securely store user passwords.
- The system must show loading skeletons while data is loading.
- The system must provide all management actions via modals or inline forms.

## Non-Functional Requirements

- The system must be built with Next.js, Prisma, and NextAuth.
- The system must use a sci-fi/neon color palette for the UI.
- The system must provide a responsive and user-friendly interface.
- The system must ensure all sensitive API endpoints are protected and only accessible to authorized users.
- The system must be performant and able to handle multiple concurrent users.
- The system must store all data in a PostgreSQL database.
- The system must be maintainable and support future feature expansion.
- The system must provide clear error messages and feedback to users.
- The system must support modern browsers and devices.
