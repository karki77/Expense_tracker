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
8. Mailtrap for testing email for email verification, forget and reset password for complete user authentication 
9. redis for token blacklisting and protecting routes after successful logout

# DATABASE:

1. PostgreSQL with Prisma ORM

# Different functionalities of the user

1. Register, login, verify email, change-password, forgot/reset password, logout 
2. Create category if the wanted category is not in the default category list for both the expense as well as income category Types
3. Update the category which should not be matched with already created category
4. Delete the category if not required, get specific category by categoryId and get all categories of a loggedin User with pagination 
5. Add expenses, get expense by expenseId, Update the existing expense and delete if not necessary with full CRUD functionalities.
6. Same CRUD functionalities for income section as well.
7. In profile section which is already created while registering the user, profile picture can be uploaded if not uploaded priviously. 
   New profile picture can also be uploaded which is replaced by deleting the existing one.
8. User can fetch own profile with details of some personal information alongside with the track of his financial summary.
9. Update the user profile with basic update of personal informations and also check the username availability in case of change of the username.
10.The user can visit his financial summary as well as top expenses using separate routes.


