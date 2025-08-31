@echo off
cd /d "c:\Users\quent\projects\life-automation\frontend\lib\model"

echo Renaming model files...

REM Rename exercise files
ren "exercise.list.dart" "list.exercise.dart"
ren "exercise.card.dart" "card.exercise.dart"
ren "exercise.subcard.dart" "subcard.exercise.dart"

REM Rename meal files
ren "meal.list.dart" "list.meal.dart"
ren "meal.card.dart" "card.meal.dart"
ren "meal.subcard.dart" "subcard.meal.dart"

REM Rename routine files
ren "routine.list.dart" "list.routine.dart"
ren "routine.card.dart" "card.routine.dart"

REM Rename abstract files
ren "abstract.list.dart" "list.abstract.dart"
ren "abstract.card.dart" "card.abstract.dart"
ren "abstract.subcard.dart" "subcard.abstract.dart"

echo All files renamed successfully!
pause
