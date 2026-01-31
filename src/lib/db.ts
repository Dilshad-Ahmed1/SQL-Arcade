import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

//const caPath =(process.env.SSL_CA || '');

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD ,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  ssl: {
    ca: process.env.SSL_CA
  },
  connectTimeout: 60000
});