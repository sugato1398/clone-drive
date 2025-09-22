# Clone Drive

A modern cloud storage application built with React and AWS services, providing secure file storage and management capabilities similar to Google Drive or Dropbox.

## 🚀 Features

- **Secure Authentication**: AWS Cognito integration for user authentication and authorization
- **File Management**: Upload, view, and delete files with a clean, intuitive interface
- **Cloud Storage**: AWS S3 integration for reliable and scalable file storage
- **User Isolation**: Each user has their own private file storage space
- **Modern UI**: Built with React 19 and TypeScript for a responsive user experience
- **Email Verification**: Complete signup flow with email confirmation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Authentication**: AWS Cognito (User Pool + Identity Pool)
- **Storage**: AWS S3
- **Styling**: CSS3 with modern styling
- **Routing**: React Router
- **AWS SDK**: v3 for JavaScript/TypeScript

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **AWS Account** with the following services configured:
   - AWS Cognito User Pool
   - AWS Cognito Identity Pool
   - AWS S3 Bucket

## 🔧 AWS Setup

### 1. Cognito User Pool
Create a Cognito User Pool with:
- Email as username
- Password policy configured
- Email verification enabled
- Generate an App Client (without secret)

### 2. Cognito Identity Pool
Create an Identity Pool that:
- Uses the User Pool for authentication
- Has IAM roles configured for authenticated users
- Allows access to your S3 bucket

### 3. S3 Bucket
Create an S3 bucket with:
- Private access (authenticated users only)
- CORS configuration for web uploads
- IAM policy allowing Cognito authenticated users to access their files

### 4. Environment Variables
Create a `.env` file in the project root with:

```env
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_APP_CLIENT_ID=your_app_client_id
VITE_COGNITO_IDENTITY_POOL_ID=your_identity_pool_id
VITE_AWS_REGION=your_aws_region
VITE_S3_BUCKET_NAME=your_s3_bucket_name
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clone-drive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Usage

### Sign Up
1. Click "Sign Up" on the login page
2. Enter your email and password
3. Check your email for the confirmation code
4. Enter the confirmation code to verify your account

### Sign In
1. Enter your email and password
2. Click "Sign In" to access your dashboard

### File Management
- **Upload**: Select a file and click "Upload File"
- **View**: See all your uploaded files in the dashboard
- **Delete**: Click the delete button next to any file to remove it
- **Download**: Click download to save files to your device (coming soon)

## 🏗️ Project Structure

```
src/
├── Login/
│   ├── AuthContext.tsx      # Authentication context and logic
│   ├── LoginPage.tsx        # Login/signup form
│   ├── ConfirmSignup.tsx    # Email verification
│   └── Login.css           # Authentication styles
├── Main/
│   └── Dashboard.tsx       # Main file management interface
├── setup/
│   └── aws-config.tsx      # AWS configuration
├── App.tsx                 # Main app component with routing
└── main.tsx               # App entry point
```

## 🔐 Security Features

- **JWT Tokens**: Secure authentication using AWS Cognito JWT tokens
- **Temporary Credentials**: AWS IAM temporary credentials for S3 access
- **User Isolation**: Each user's files are stored in separate S3 prefixes
- **Session Management**: Automatic token refresh and secure logout

## 🚧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code quality
- Modern React patterns (hooks, context)

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your AWS Cognito configuration
   - Check environment variables
   - Ensure CORS is properly configured

2. **File Upload Issues**
   - Verify S3 bucket permissions
   - Check IAM role policies
   - Ensure bucket CORS configuration

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] File download functionality
- [ ] File sharing capabilities
- [ ] Folder organization
- [ ] File preview
- [ ] Drag and drop upload
- [ ] Mobile responsive design improvements
- [ ] Dark mode theme
- [ ] File versioning
- [ ] Search functionality

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using React and AWS