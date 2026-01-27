# FIRESTORE DATABASE SETUP GUIDE

## 🗄️ FIREBASE FIRESTORE DATABASE

Your user data will now be stored in Firebase Firestore when they sign in with Google!

### 📊 **DATABASE STRUCTURE:**

#### **✅ Users Collection:**
```
users/{userId}
├── uid: "google_user_id_abc123"
├── email: "user@gmail.com"
├── displayName: "John Doe"
├── photoURL: "https://..."
├── emailVerified: true
├── createdAt: timestamp
├── lastLogin: timestamp
├── subscription: "enterprise"
└── plan: "enterprise"
```

#### **✅ Activities Collection:**
```
activities/{userId}
├── userId: "google_user_id_abc123"
├── resumesUploaded: ["resume1", "resume2"]
├── jobsApplied: ["job1", "job2", "job3"]
├── searchesPerformed: 25
├── templatesUsed: ["professional", "modern"]
└── lastActivity: timestamp
```

---

### 🛠️ **SETUP FIRESTORE DATABASE:**

#### **✅ STEP 1: Create Firestore Database**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **talent-match-ai** project
3. In left sidebar, click **"Firestore Database"**
4. Click **"Create database"**
5. Choose **"Start in test mode"** (allows read/write for 30 days)
6. Select **location** (choose closest to your users)
7. Click **"Enable"**

#### **✅ STEP 2: Set Up Security Rules**
After creating, click **"Rules"** tab and add:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own activities
    match /activities/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### **✅ STEP 3: Deploy Rules**
Click **"Publish"** to apply the security rules.

---

### 🎯 **WHAT HAPPENS WHEN USERS SIGN IN:**

#### **✅ Automatic Data Storage:**
1. **User signs in with Google** 🔐
2. **Profile created** in `users` collection 👤
3. **Activity record created** in `activities` collection 📊
4. **Data persists** across sessions 💾
5. **Real-time updates** available ⚡

#### **✅ Data Tracked:**
- **User profile** (name, email, photo)
- **Login timestamps** (created, last login)
- **Resume uploads** (which templates used)
- **Job applications** (which jobs applied to)
- **Search activity** (how many searches performed)
- **Template usage** (which resume templates used)

---

### 📱 **VIEWING USER DATA:**

#### **✅ In Firebase Console:**
1. Go to **Firestore Database**
2. Click on **"users"** collection
3. See all user profiles
4. Click on **"activities"** collection
5. See all user activities

#### **✅ Real-time Updates:**
- Data updates instantly when users take actions
- No page refresh needed
- Synchronized across all devices

---

### 🔍 **QUERYING USER DATA:**

#### **✅ Get User Profile:**
```javascript
const userProfile = await firestoreService.getUserProfile(userId)
```

#### **✅ Get User Statistics:**
```javascript
const userStats = await firestoreService.getUserStats(userId)
// Returns: resumesUploaded, jobsApplied, searchesPerformed, etc.
```

#### **✅ Track Activities:**
```javascript
await firestoreService.trackJobSearch(userId)
await firestoreService.trackResumeUpload(userId, resumeId)
await firestoreService.trackJobApplication(userId, jobId)
```

---

### 🚀 **BENEFITS:**

#### **✅ Professional Data Storage:**
- **Persistent data** (never lost)
- **Real-time sync** across devices
- **Secure access** (user-specific data only)
- **Scalable** (millions of users)
- **Fast queries** (optimized by Google)

#### **✅ Business Intelligence:**
- **User analytics** (how many users, activities)
- **Feature usage** (which templates popular)
- **Engagement metrics** (how active users are)
- **Growth tracking** (user acquisition over time)

---

### 📋 **NEXT STEPS:**

1. **Create Firestore Database** 🗄️
2. **Set up security rules** 🔒
3. **Test sign-in with Google** 🔐
4. **Check user data in console** 👀
5. **Deploy to production** 🚀

---

### 🎉 **RESULT:**

Your app now has **professional user data storage**! When users sign in with Google:

- ✅ **Profile saved** in Firestore
- ✅ **Activities tracked** automatically
- ✅ **Data persists** forever
- ✅ **Real-time updates** available
- ✅ **Secure access** guaranteed

**Your users' data is now safely stored in Firebase Firestore!** 🗄️✨
