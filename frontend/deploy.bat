@echo off
call flutter clean
call flutter pub get
call flutter build web --release
call firebase deploy
pause