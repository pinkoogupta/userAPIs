import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';
import bcrypt from 'bcrypt';  // Fixed typo here
import jwt from 'jsonwebtoken';

const User = sequelize.define('User', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increments the id
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true, 
    set(value) {
      this.setDataValue('username', value.toLowerCase()); 
    },
    validate: {
      notEmpty: true, 
    },
    trim: true, 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
    validate: {
      isEmail: true,
      notEmpty: true, 
    },
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true, 
    },
    set(value) {
      this.setDataValue('fullName', value.trim()); 
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true, 
    },
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  resetPasswordToken: {
  type: DataTypes.STRING,
  allowNull: true,
 },
 resetPasswordExpires: {
  type: DataTypes.DATE,
  allowNull: true,
 }
 }, {
  timestamps: true, 
  tableName: 'users', // Ensure the table name is consistent (lowercase)
  indexes: [
    {
      unique: true,
      fields: ['username'], 
    },
    {
      unique: true,
      fields: ['email'], 
    },
    {
      fields: ['fullName'], 
    },
  ],
});

User.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10); 
  }
});

User.prototype.isPasswordCorrect = async function(password) {
  return bcrypt.compare(password, this.password);  
};

User.prototype.generateAccessToken = function() {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

User.prototype.generateRefreshToken = function() {
  return jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};





export { User };
