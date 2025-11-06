# SlotSwapper

**SlotSwapper** is a modern web application that helps users **manage, track, and swap their work slots or events** seamlessly.  
It allows users to create events, mark them as *Swappable*, and send or respond to swap requests — all in one intuitive dashboard.

**Live Application:** [SlotSwapper](https://slot-swapper-pink.vercel.app)  
**Repository:** [GitHub - SlotSwapper](https://github.com/believeharsh/Slot-Swapper)

---

## 🚀 Features

SlotSwapper provides a complete and easy-to-use system for managing work schedules and event swaps efficiently.

- 🗓 **Event Management:** Create, edit, and delete your slots/events effortlessly.  
- 🔁 **Slot Swapping:** Mark events as *Swappable* and send swap requests to others.  
- 📬 **Request Handling:** Accept or reject incoming swap requests directly from your dashboard.  
- 💬 **Swap Details Modal:** View detailed information about swap requests before taking action.  
- 🧠 **Smart Status System:** Automatically updates event statuses — `BUSY`, `SWAPPABLE`, `SWAP_PENDING`.  
- 🔐 **Authentication:** Secure signup/login using JWT with token-based session management.  
- 🌓 **Modern Dark UI:** Consistent, elegant dark theme with Tailwind CSS variables.  
- ⚙️ **Redux Toolkit Integration:** Centralized and efficient state management with Redux persist.  
- ⚡ **Responsive Design:** Fully optimized for both desktop and mobile devices.

---

## 🛠 Tech Stack

SlotSwapper is built with a modern and scalable stack — ensuring performance, reliability, and developer productivity.

### **Frontend**
- ⚛️ **React 18** with **TypeScript**  
- 🧰 **Redux Toolkit** for state management  
- 💾 **Redux Persist** for persistent authentication  
- 💅 **Tailwind CSS** with custom dark theme using CSS variables  
- 🌐 **React Router v6** for navigation  
- 🔗 **Axios** for API communication  
- 📅 **Date-fns** for date formatting and manipulation  

### **Backend**
- 🟢 **Node.js** with **Express**  
- 🍃 **MongoDB** with **Mongoose** ODM  
- 🔒 **JWT Authentication** with bcrypt password hashing  
- 🧩 **TypeScript** for end-to-end type safety  
- 🛡️ **CORS** and security middleware  

---

## 📁 Project Structure

```
SlotSwapper/
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable components (Layout, Footer, Modals, Forms)
│   │   ├── Pages/             # Pages (Dashboard, Marketplace, Requests, Landing, Auth)
│   │   ├── store/             # Redux Toolkit slices & store configuration
│   │   ├── services/          # Axios API service integrations
│   │   ├── types/             # TypeScript interfaces & enums
│   │   ├── App.tsx            # Root component with protected routes
│   │   └── index.css          # Global styles with CSS variables
│   ├── public/
│   └── package.json
│
├── server/                    # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/       # Route controllers (Auth, Events, Swaps)
│   │   ├── models/            # Mongoose schemas (User, Event, SwapRequest)
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Authentication & error handling middleware
│   │   └── index.ts           # Server entry point
│   ├── dist/                  # Compiled JavaScript (production build)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### **Prerequisites**
- **Node.js** 18+ and **npm** or **yarn**  
- **MongoDB** connection string (local instance or MongoDB Atlas)  
- **Git** for cloning the repository  

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/believeharsh/SlotSwapper.git
   cd SlotSwapper
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**

   Create `.env` in the **server** directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_secret_key_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   Create `.env` in the **client** directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the application**
   ```bash
   # Start backend server (from server directory)
   cd server
   npm run dev
   
   # Start frontend (from client directory, in new terminal)
   cd client
   npm run dev
   ```

5. **Access the application**
   - **Frontend:** http://localhost:5173  
   - **Backend API:** http://localhost:5000  

---

## 🧱 Building for Production

To create optimized production builds:

```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build
```

The frontend build will be created in `client/dist/` and backend in `server/dist/`.

---

## 🧩 API Endpoints

### **Authentication**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user |
| `/api/auth/login` | POST | Login and receive JWT token |
| `/api/auth/me` | GET | Get current authenticated user info |

### **Events Management**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | Fetch all events for logged-in user |
| `/api/events/:id` | GET | Fetch single event details |
| `/api/events` | POST | Create a new event |
| `/api/events/:id` | PUT | Update an existing event |
| `/api/events/:id` | DELETE | Delete an event |

### **Slot Swapping**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/swappable-slots` | GET | Fetch all swappable events from other users |
| `/api/swap-request` | POST | Create a swap request |
| `/api/swap-requests/incoming` | GET | Fetch incoming swap requests |
| `/api/swap-requests/outgoing` | GET | Fetch outgoing swap requests |
| `/api/swap-response/:requestId` | POST | Accept or reject a swap request |

---

| Feature                | Preview                                                                     |
| ---------------------- | ---------------------------------------------------------------             |
| **Landing Page**       | ![Landing](./assets/screenShots/slotsswapper_landing_page.png)              |
| **Dashboard**          | ![Dashboard](./assets/screenShots/slotswapper_dashboard_page.png)           |
| **Marketplace**        | ![About](./assets/screenShots/slotswapper_marketPlace_page.png)             |
| **Swap Requests**      | ![Requests](./assets/screenShots/slotswapper_reuest_page.png)               |


---

## ☁️ Deployment

SlotSwapper is deployed using modern cloud platforms for optimal performance:

- **Frontend:** [Vercel](https://vercel.com) - https://slot-swapper-pink.vercel.app 
- **Backend:** [Render](https://render.com) - https://slot-swapper-api.onrender.com  
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)  

### **Deployment Notes**
- Environment variables are configured in respective platform dashboards
- Backend uses automatic HTTPS and CORS configuration
- Frontend uses optimized production builds with code splitting

---

## 🤝 Contributing

Contributions are always welcome! Whether it's bug fixes, feature additions, or documentation improvements.

### **How to Contribute:**

1. **Fork the repository**
2. **Create a feature branch:**  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**  
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to your branch:**  
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** 🎉

### **Contribution Guidelines:**
- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

---

## 📝 Future Enhancements

- [ ] Email notifications for swap requests
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Real-time updates using WebSockets
- [ ] Advanced filtering and search in marketplace
- [ ] User profiles and ratings system
- [ ] Mobile app (React Native)
- [ ] Recurring events support
- [ ] Team/organization management

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it.

---

## 👨‍💻 Author

**Harsh Dahiya**

- GitHub: [@believeharsh](https://github.com/believeharsh)
- LinkedIn: [Harsh Dahiya](https://www.linkedin.com/in/believeharsh11)

---

## 🙏 Acknowledgments

- Thanks to the React and Node.js communities for amazing tools and libraries
- Inspired by modern scheduling and workplace management solutions
- Built with passion to solve real-world scheduling problems

---

**Built with by Harsh Dahiya Associated with Service Hive**

⭐ **If you find this project useful, please give it a star!** ⭐