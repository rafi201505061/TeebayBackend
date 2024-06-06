[text](prisma/schema.prisma)

This is the database schema. I will list the features I implemented in both frontend and backend one by one here.

1. Authentication and Authorization:
   I used password-based authentication mechanism. Password will be encrypted with bcrypt algorithm with salt value set to 10. For authorization, I used JWT tokens.

Each time a user visits the website, I first check whether there is a valid JWT token present in localStorage. If yes, user will be logged in automatically. Otherwise user will be redirected to home page. After successful login, the JWT token returned from the Server will be stored in localStorage.

2. Forms and user experience: I implemented custom form items with validation as per the requirements. User will be given instructive messages if given wrong inputs. This will improve user experience.

3. Concurrency Handling: I used versioning to resolve conflicts between users who requested to buy/borrow same product at the same time. So, only one used will be able to buy/borrow the product even if multiple users want to buy it at the same time. This is ensure data integrity.

4. Resolving rent time overlap: Every time a user wants to borrow a product with a time range, I first check if the range overlaps with other rent time ranges. If it overlaps, I show the user a message informing that he can not borrow the product. To improve user experience, I added a date and time picker with only the future times enabled.

N.B. I had to learn NextJS, Prisma, PostgresSQL from scratch to implement the backend.
