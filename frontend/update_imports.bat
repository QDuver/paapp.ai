@echo off
echo Updating imports in all files...

cd /d "c:\Users\quent\projects\life-automation\frontend"

REM Update part directives in the renamed files
echo Updating part directives...

REM Update list files part directives
powershell -Command "(Get-Content 'lib\model\list.exercise.dart') -replace 'exercise\.list\.g\.dart', 'list.exercise.g.dart' | Set-Content 'lib\model\list.exercise.dart'"
powershell -Command "(Get-Content 'lib\model\list.meal.dart') -replace 'meal\.list\.g\.dart', 'list.meal.g.dart' | Set-Content 'lib\model\list.meal.dart'"
powershell -Command "(Get-Content 'lib\model\list.routine.dart') -replace 'routine\.list\.g\.dart', 'list.routine.g.dart' | Set-Content 'lib\model\list.routine.dart'"

REM Update card files part directives
powershell -Command "(Get-Content 'lib\model\card.exercise.dart') -replace 'exercise\.card\.g\.dart', 'card.exercise.g.dart' | Set-Content 'lib\model\card.exercise.dart'"
powershell -Command "(Get-Content 'lib\model\card.meal.dart') -replace 'meal\.card\.g\.dart', 'card.meal.g.dart' | Set-Content 'lib\model\card.meal.dart'"
powershell -Command "(Get-Content 'lib\model\card.routine.dart') -replace 'routine\.card\.g\.dart', 'card.routine.g.dart' | Set-Content 'lib\model\card.routine.dart'"

REM Update subcard files part directives
powershell -Command "(Get-Content 'lib\model\subcard.exercise.dart') -replace 'exercise\.subcard\.g\.dart', 'subcard.exercise.g.dart' | Set-Content 'lib\model\subcard.exercise.dart'"
powershell -Command "(Get-Content 'lib\model\subcard.meal.dart') -replace 'meal\.subcard\.g\.dart', 'subcard.meal.g.dart' | Set-Content 'lib\model\subcard.meal.dart'"

echo Part directives updated!
echo Now you need to manually update the import statements in all files.
pause
