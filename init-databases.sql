CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS project_db;
CREATE DATABASE IF NOT EXISTS monitoring_db;

CREATE USER IF NOT EXISTS 'lw_user'@'%' IDENTIFIED BY 'lw_password';
GRANT ALL PRIVILEGES ON auth_db.* TO 'lw_user'@'%';
GRANT ALL PRIVILEGES ON project_db.* TO 'lw_user'@'%';
GRANT ALL PRIVILEGES ON monitoring_db.* TO 'lw_user'@'%';
FLUSH PRIVILEGES;

USE auth_db;
CREATE TABLE IF NOT EXISTS User (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  position VARCHAR(255),
  profile TEXT,
  photo VARCHAR(255),
  isVerified BOOLEAN DEFAULT true,
  credentialEmailSent BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

CREATE TABLE IF NOT EXISTS RegisterOtp (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expiresAt DATETIME NOT NULL,
  used BOOLEAN DEFAULT false,
  usedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId VARCHAR(255),
  INDEX idx_email (email),
  INDEX idx_code (code),
  INDEX idx_used (used)
);

CREATE TABLE IF NOT EXISTS PasswordResetToken (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expiresAt DATETIME NOT NULL,
  used BOOLEAN DEFAULT false,
  usedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId VARCHAR(255),
  INDEX idx_email (email),
  INDEX idx_code (code),
  INDEX idx_used (used),
  INDEX idx_userId (userId)
);

USE project_db;
CREATE TABLE IF NOT EXISTS Project (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  repoLink VARCHAR(255),
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  progress INT DEFAULT 0,
  decision VARCHAR(50) DEFAULT 'pending',
  finished BOOLEAN DEFAULT false,
  imageDescription TEXT,
  imageDescription2 TEXT,
  imageUrl VARCHAR(255),
  moduleUrl VARCHAR(255),
  userId VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_project (name, userId),
  INDEX idx_userId (userId),
  INDEX idx_decision (decision),
  INDEX idx_createdAt (createdAt)
);

CREATE TABLE IF NOT EXISTS Attachment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projectId VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  isAdditionalDescription BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_projectId (projectId),
  INDEX idx_status (status),
  FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

USE monitoring_db;
CREATE TABLE IF NOT EXISTS RevisionReport (
  id VARCHAR(255) PRIMARY KEY,
  projectName VARCHAR(255) NOT NULL,
  issueType VARCHAR(50) DEFAULT 'MODUL',
  description TEXT,
  progress VARCHAR(50) DEFAULT 'BELUM_DILAKUKAN',
  approval VARCHAR(50) DEFAULT 'PENDING',
  approvalNote TEXT,
  senderRole VARCHAR(50) NOT NULL,
  targetRole VARCHAR(50) NOT NULL,
  targetUserId VARCHAR(255),
  sentById VARCHAR(255),
  attachmentName VARCHAR(255),
  attachmentUrl VARCHAR(255),
  attachmentData LONGTEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_targetRole (targetRole),
  INDEX idx_senderRole (senderRole),
  INDEX idx_approval (approval),
  INDEX idx_createdAt (createdAt),
  INDEX idx_targetUserId (targetUserId),
  INDEX idx_sentById (sentById)
);

CREATE TABLE IF NOT EXISTS RevisionComment (
  id VARCHAR(255) PRIMARY KEY,
  content TEXT NOT NULL,
  authorId VARCHAR(255) NOT NULL,
  reportId VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reportId (reportId),
  INDEX idx_authorId (authorId),
  FOREIGN KEY (reportId) REFERENCES RevisionReport(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notification (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  link VARCHAR(255),
  isRead BOOLEAN DEFAULT false,
  icon VARCHAR(50),
  color VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt),
  INDEX idx_userId_isRead (userId, isRead)
);
