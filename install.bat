@echo off 
chcp 65001 
title Installation AI Business Manager Ultimate 
color 0A 
 
echo ===================================================================== 
echo ?? INSTALLATION AI BUSINESS MANAGER ULTIMATE 2026 
echo ===================================================================== 
echo. 
 
echo [1/5] Installation des dÇpendances backend... 

up to date, audited 393 packages in 2s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

up to date, audited 393 packages in 3s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

up to date, audited 393 packages in 2s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

up to date, audited 393 packages in 2s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
cd ..\..\..\ 
 
echo [2/5] Installation des dÇpendances frontend... 

up to date, audited 393 packages in 2s

69 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
cd .. 
 
echo [3/5] CrÇation des dossiers de donnÇes... 
if not exist "C:\data\db" mkdir C:\data\db 
if not exist "C:\data\redis" mkdir C:\data\redis 
if not exist "C:\data\elasticsearch" mkdir C:\data\elasticsearch 
 
echo [4/5] Copie du fichier d'environnement... 
copy .env.example .env 
 
echo [5/5] Configuration terminÇe ! 
echo. 
echo ===================================================================== 
echo ?? INSTALLATION TERMINêE AVEC SUCC‘S ! 
echo ===================================================================== 
echo. 
echo Pour lancer le projet : 
echo   1. Double-cliquez sur launch.bat 
echo   2. Choisissez l'option 1 
echo. 
pause 
