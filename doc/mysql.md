
CREATE DATABASE findmeDB default CHARACTER SET UTF8;

GRANT ALL PRIVILEGES ON auth.* TO auth_user@'%' IDENTIFIED BY 'qwe123!@#';

select host, user from user;
