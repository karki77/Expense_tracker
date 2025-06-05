import dotenv from 'dotenv';
// Load environment variables

export default {
    database: {
        url: process.env.DATABASE_URL,
    },
    server:{
        port: process.env.PORT || 7000,
    }
    // Add other config settings over here
}