initial commands to initiate node project

1. npm init
2. npm i express mongoose nodemon bcrypt  dotenv  jsonwebtoken multer cors  cloudinary cookie-parser  
3. npm install sequelize mysql2
4.  development dependencies{
    1. npm install --save-dev nodemon
    2. npm install --save-dev eslint prettier }


User Authentication API
This project implements a Node.js-based user authentication system with features such as user registration, login, password reset, and account updates. It uses Express.js, Sequelize (with PostgreSQL), and JWT for secure authentication.

Features
1.User Registration: Create an account with validation for email and username uniqueness.
2.User Login: Authenticate using email/username and password.
3.Forgot Password: Generate a reset password token and send via email AND it valid for 15 min only.
4.Reset Password: Reset the password using a secure token.
5.Update Account Details: Update user profile information.
6.JWT Authentication: Access and refresh token management for secure API access.




Endpoints
Authentication Routes
Method	Endpoint	                Description
POST (http://localhost:3000/api/users/register)	                Register a new user
POST	http://localhost:3000/api/users/login	                     Login with email/username
POST	http://localhost:3000/api/users/forget-password	         Request a password reset
POST	http://localhost:3000/api/users/reset-password/<:token>     Reset password with a token
PATCH	(http://localhost:3000/api/users/update)                     Update user account details

Setup Instructions
Clone the repository:

bash
Copy code
git clone <repository-url>
cd <project-directory>


Install dependencies:

bash
Copy code
npm install
Configure environment variables:

Create a .env file with the following:
makefile
Copy code
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>
EMAIL_SERVICE=<your-email-service>
EMAIL_USER=<your-email-address>
EMAIL_PASSWORD=<your-email-password>

Run the server:


npm run dev
Test the APIs using Postman or any API client.

Dependencies
Node.js
Express.js
Sequelize
PostgreSQL
JWT
Bcrypt
Nodemailer













![alt text](<Screenshot (518).png>) ![alt text](<Screenshot (527).png>) ![alt text](<Screenshot (526).png>) ![alt text](<Screenshot (525).png>) ![alt text](<Screenshot (523).png>) ![alt text](<Screenshot (521).png>) ![alt text](<Screenshot (520).png>) ![alt text](<Screenshot (519).png>)











1. Find the PID of the Process Using the Port
     Open Command Prompt and run:



         netstat -ano | findstr :4000
        You'll see output like:


       TCP    0.0.0.0:4000           0.0.0.0:0              LISTENING       12345
      The last column (12345 in this example) is the PID (Process ID).


2. Kill the Process
          Use the taskkill command to terminate the process:

         taskkill /PID 12345 /F
         Replace 12345 with the PID you found in the previous step.