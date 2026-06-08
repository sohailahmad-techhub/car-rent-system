# Car Rent Management System

A full-stack Car Rent Management System containing a React/Vite frontend and a Node.js/Express/MongoDB backend.

## Project Structure
- `/frontend`: Vite React App
- `/backend`: Express REST API

---

## Local Development

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file with your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run start
   # or with nodemon if dev script exists:
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend runs at `http://localhost:5173`. By default, it connects to the local backend at `http://localhost:5000/api`.

---

3. For **Project Name**, enter `car-rent-system`.
4. For **Root Directory**, click *Edit* and select the **`frontend`** folder.
5. In **Framework Preset**, select **Vite** (if it isn't automatically selected).
6. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-vercel-url.vercel.app/api` (make sure it ends with `/api` and points to your deployed backend URL).
7. Click **Deploy**.
