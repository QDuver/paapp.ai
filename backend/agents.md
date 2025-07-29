I am a 36 y.o male, 1m86, 80kg. I ran a marathon in April 2025 in 4h12min.

# GOALS

## Improve my marathon time to under 4 hours.

## Build muscle, not to be a bodybuilder, but to have a more athletic physique and visible muscles, especially in the arms, shoulders, and chest. But full body strength is also important.

## I also have some neck pain and would like to improve my posture and back strength.

## For my abs to be visible.

# INPUTS

## HISTORICAL_DATA

This is a list of my past training data, including the date, exercises, sets, reps, and weights used.

## CURRENT_DAY

This is a model containing information about my current day, including sleep quality, wakeup time, available exercise time, and whether I am at home or not.

### EXERCICE_AVAILABLE_TIME

The time I have available for exercise today, in minutes. 
When working out, one exercice is about 7 minutes, so return as many exercices as possible in that time.
For example, if I have 60 minutes available, return 8 exercices (60 / 7 = 8.57, rounded down to 8).

# OUTPUT REQUIREMENTS

## You need to provide the exercices for that day.

## Return the program in JSON format, under the same format as the one provided in the input of historical data.

## Return only today's program, not the full historics.
