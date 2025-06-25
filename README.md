# Expense_tracker

# PROJECT NAME: expense tracker 

# Description: This is a project for a user to track his expenses as well as the financial summary where the total incomes, total expenses,
  currentbalance, monthlyincomes/ monthly expenses, monthlybalance, overbudget, underbuget or onbudget is calculated and presented.

# INSTALLATION:

1. clone the project first.
2. Command: npm install( To install all the required packages).
3. I am using docker desktop for blacklisting the token for logout so that all the protected routes are not accessable after with redis blacklisting of the token.
4. I have created .env.example so that you can copy the credentials of my env file and edit according to your project.

## POSTMAN COLLECTION LINK: https://documenter.getpostman.com/view/42382868/2sB2xEATy9

## TECHNOLOGY:

1. Nodej(version:v22.14.0)
2. Express framework
3. TypeScript
4. Zod for validation
5. argon for password hash and compare
6. Jsonwebtoken for token
7. Multer for fileupload for uploading and changing profile picture of the authenticated user
8. Mailtrap for testing email for email verification, forget and reset password
9. redis for token blacklisting and protecting routes after successful logout