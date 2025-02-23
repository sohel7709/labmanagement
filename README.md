# Pathology Lab Management System

A comprehensive web application for managing pathology lab operations, including patient records, test reports, and lab management.

## Technologies Used

### Frontend
- React.js
- Material-UI (MUI)
- React Router DOM
- Formik & Yup for form validation
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
- PDF generation capabilities

## Features

- **Dashboard**: Overview of lab operations and key metrics
- **Patient Management**: Add, view, and manage patient records
- **Test Reports**: Create and manage pathology test reports
- **User Management**: Different roles (super_admin, admin, technician)
- **Profile Management**: User profile settings and customization
- **File Upload**: Support for attachments and documents
- **PDF Generation**: Generate test reports in PDF format

## Project Structure

```
labmanagement/
├── backend/
│   ├── config/         # Database and other configurations
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Reusable components
│       ├── pages/      # Page components
│       └── App.js      # Main application component
```

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/sohel7709/labmanagement.git
cd labmanagement
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client
```

## Available Scripts

- `npm run dev`: Runs both frontend and backend in development mode
- `npm run server`: Runs the backend server only
- `npm run client`: Runs the frontend development server
- `npm run build`: Builds the frontend for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
