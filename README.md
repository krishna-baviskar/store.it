# 🔐 Store.it - Secure Client-Side Password Manager

Store.it is a lightweight, secure, and serverless password management solution designed to keep your digital credentials safe directly on your device. Unlike traditional password managers that store your data in the cloud, Store.it operates entirely within your web browser using **LocalStorage**.

## 🌟 Why Store.it is Helpful

In an age of frequent data breaches, Store.it offers a unique value proposition: **Total Data Sovereignty**.

1.  **Zero-Knowledge Architecture**:
    *   **No Backend Server**: Your passwords never leave your device. There is no database for hackers to breach.
    *   **Client-Side Only**: All encryption and storage logic happens right in your browser.
 
2.  **Instant & Offline**:
    *   Works perfectly without an internet connection.
    *   No loading times for server requests.

3.  **User-Friendly Security**:
    *   **Visual Feedback**: Password strength meters help you create strong credentials.
    *   **Recovery Options**: A security question system ensures you don't lose access if you forget your master password.

## 🚀 Key Features

*   **Personal Vault**: Store unlimited credentials (Website, Username, Password).
*   **3D Interactive Backgrounds**: Immersive visual experience using Three.js and Vanta.js (Waves, Net, and Birds effects).
*   **Password Tools**:
    *   Strength Meter (Visual bar & checklist).
    *   One-click Copy to Clipboard.
    *   Visibility Toggle (Mask/Unmask passwords).
*   **Profile Management**: Update your personal details, change passwords, and manage security questions.
*   **Responsive Design**: Fully functional on Desktops, Tablets, and Mobile phones.

## 🛠️ Technical Stack

This project is built with pure, vanilla web technologies to ensure transparency and ease of audit:

*   **HTML5**: Semantic structure.
*   **CSS3**: Modern styling with Flexbox/Grid and animations.
*   **JavaScript (ES6+)**: Core logic for `AuthManager`, `VaultManager`, and `StorageManager`.
*   **LocalStorage API**: The browser's native database for persisting data.
*   **Three.js / Vanta.js**: Libraries used for the dynamic background effects.

## 📂 Project Structure

*   `index.html`: The main entry point containing the Single Page Application (SPA) structure (Login, Signup, Dashboard screens).
*   `style.css`: Contains all visual styling, animations, and responsive rules.
*   `script.js`: The brain of the application. It handles:
    *   User Authentication (Login/Signup).
    *   Data Persistence (LocalStorage wrapper).
    *   Vault Operations (Add, Delete, Search).
    *   UI Logic (Screen switching, 3D background initialization).
*   `lock.png`: The application icon/favicon.

## 🏁 Getting Started

Since Store.it is a serverless client-side application, "installing" it is incredibly simple.

### Prerequisites
*   A modern web browser (Chrome, Firefox, Edge, Safari).
*   An internet connection (only required initially to load the 3D libraries from CDN).

### Installation Steps
1.  **Download the Code**: Clone this repository or download the ZIP file.
2.  **Open the Application**:
    *   Navigate to the folder where you saved the files.
    *   Double-click `index.html` to open it in your default browser.
3.  **That's it!** You are ready to start storing passwords.

## 📖 User Guide

### 1. Creating an Account
*   Click "Sign Up" on the home screen.
*   Fill in your Name, Email, and a Strong Password.
*   **Crucial Step**: Select a Security Question and Answer. This is your *only* way to recover the account if you forget the password.

### 2. Managing Passwords
*   Once logged in, you will see the **Store.it Vault**.
*   **Add**: Enter the Website Name, Username, and Password, then click "Save".
*   **View**: Click the 👁️ icon to reveal a password.
*   **Copy**: Click the 📋 icon to copy a password to your clipboard.
*   **Delete**: Click the 🗑️ icon to remove an entry.

### 3. Updating Profile
*   Click "Update Profile" at the bottom of the dashboard.
*   Here you can change your Name, Phone Number, Security Question, or reset your Master Password.

### 4. Forgot Password?
*   On the Login screen, click "Forgot Password?".
*   Enter your registered email.
*   Answer the security question exactly as you set it up.
*   Create a new password.

## ⚠️ Important Security Note

Because Store.it uses **LocalStorage**:
1.  **Do not clear your browser's "Site Data" or "Local Storage"** for this file/domain, or you will lose your saved passwords.
2.  If using a public computer, ensure you **Logout** when finished to prevent others from accessing your vault.

---
*Your data, your device, your control.*

##Lead Developer
#Krishna Somnath Baviskar
krishnabaviskar40@gmail.com
