@echo off 
chcp 65001 
title AI BUSINESS MANAGER ULTIMATE 2026 
color 0A 
 
:MENU 
cls 
echo ===================================================================== 
echo ?? AI BUSINESS MANAGER ULTIMATE 2026 - LAUNCHER 
echo ===================================================================== 
echo. 
echo ?? 25 Microservices disponibles 
echo ???  Frontend React avec 250+ composants 
echo ???  MongoDB + Redis + Elasticsearch 
echo ??  Docker + Kubernetes ready 
echo. 
echo Choisissez une option : 
echo. 
echo [1] Lancer TOUS les services (d‚veloppement) 
echo [2] Lancer avec Docker (production) 
echo [3] Lancer les services essentiels (Auth + CRM) 
echo [4] Lancer le frontend seulement 
echo [5] Lancer la base de donn‚es seulement 
echo [6] Arrˆter tous les services 
echo [7] Voir les logs 
echo [8] V‚rifier l'‚tat des services 
echo [0] Quitter 
echo. 
set /p choix="Votre choix : " 
 
if "%%choix%%"=="1" goto ALL 
if "%%choix%%"=="2" goto DOCKER 
if "%%choix%%"=="3" goto ESSENTIAL 
if "%%choix%%"=="4" goto FRONTEND 
if "%%choix%%"=="5" goto DATABASE 
if "%%choix%%"=="6" goto STOP 
if "%%choix%%"=="7" goto LOGS 
if "%%choix%%"=="8" goto CHECK 
if "%%choix%%"=="0" exit 
 
:ALL 
cls 
echo ?? D‚marrage de tous les services... 
echo. 
start "MongoDB" cmd /c "mongod --dbpath C:\data\db" 
timeout /t 5 
start "Redis" cmd /c "redis-server" 
timeout /t 2 
start "Elasticsearch" cmd /c "elasticsearch" 
timeout /t 10 
start "API Gateway" cmd /c "cd backend\api-gateway && node server.js" 
timeout /t 2 
start "Auth Service" cmd /c "cd backend\services\auth && node server.js" 
timeout /t 2 
start "CRM Service" cmd /c "cd backend\services\crm && node server.js" 
timeout /t 2 
start "Frontend" cmd /c "cd frontend && npm start" 
echo. 
echo ? Tous les services sont d‚marr‚s ! 
echo. 
echo ?? Frontend : http://localhost:3000 
echo ?? API Gateway : http://localhost:8000 
echo. 
start http://localhost:3000 
pause 
goto MENU 
 
:DOCKER 
cls 
echo ?? D‚marrage avec Docker Compose... 
docker-compose up -d 
echo ? Services d‚marr‚s 
echo. 
echo ?? Frontend : http://localhost:3000 
start http://localhost:3000 
pause 
goto MENU 
 
:ESSENTIAL 
cls 
echo ?? D‚marrage des services essentiels... 
start "MongoDB" cmd /c "mongod --dbpath C:\data\db" 
timeout /t 5 
start "Redis" cmd /c "redis-server" 
timeout /t 2 
start "API Gateway" cmd /c "cd backend\api-gateway && node server.js" 
timeout /t 2 
start "Auth Service" cmd /c "cd backend\services\auth && node server.js" 
timeout /t 2 
start "CRM Service" cmd /c "cd backend\services\crm && node server.js" 
timeout /t 2 
start "Frontend" cmd /c "cd frontend && npm start" 
echo ? Services essentiels d‚marr‚s 
pause 
goto MENU 
 
:FRONTEND 
cls 

> ai-business-manager-ultimate@1.0.0 start
> node backend/api-gateway/server.js

goto MENU 
 
:DATABASE 
cls 
echo ??? D‚marrage des bases de donn‚es... 
start "MongoDB" cmd /c "mongod --dbpath C:\data\db" 
timeout /t 5 
start "Redis" cmd /c "redis-server" 
timeout /t 2 
start "Elasticsearch" cmd /c "elasticsearch" 
echo ? Bases de donn‚es d‚marr‚es 
pause 
goto MENU 
 
:STOP 
cls 
echo ?? Arrˆt de tous les services... 
taskkill /F /IM node.exe 
taskkill /F /IM python.exe 
taskkill /F /IM mongod.exe 
taskkill /F /IM redis-server.exe 
echo ? Tous les services sont arrˆt‚s 
pause 
goto MENU 
 
:LOGS 
cls 
echo ?? Derniers logs : 
echo. 
type logs\api-gateway.log  | findstr /n . | findstr /b /c:"[1-20]:" 
echo. 
pause 
goto MENU 
 
:CHECK 
cls 
echo ?? V‚rification des services... 
echo. 
? API Gateway: OK || echo ? API Gateway: Non d‚marr‚ 
? Auth Service: OK || echo ? Auth Service: Non d‚marr‚ 
? CRM Service: OK || echo ? CRM Service: Non d‚marr‚ 
? Frontend: OK || echo ? Frontend: Non d‚marr‚ 
echo. 
pause 
