echo Generating models only...
call npx @openapitools/openapi-generator-cli generate ^
    -i openapi.yaml ^
    -g dart ^
    -o frontend/ ^
    --global-property models ^
    --additional-properties=pubName=workout_api_models,pubVersion=1.0.0,pubLibrary=workout_api_models.api,generateApis=false,generateApiTests=false,generateApiDocumentation=false ^
    --skip-validate-spec ^
    --ignore-file-override=.openapi-generator-ignore

@REM pause

@REM echo Moving api_helper.dart and api.dart to model folder...
@REM if exist "frontend\lib\api_helper.dart" move "frontend\lib\api_helper.dart" "frontend\lib\model\"
@REM if exist "frontend\lib\api.dart" move "frontend\lib\api.dart" "frontend\lib\model\"

@REM call npx @openapitools/openapi-generator-cli generate ^
@REM     -i openapi.yaml ^
@REM     -g python ^
@REM     -o backend/ ^
@REM     --global-property=models ^
@REM     --additional-properties=packageName=models,packageVersion=1.0.0,generateSourceCodeOnly=true,generateApis=false,generateApiTests=false,generateApiDocumentation=false,generateModelTests=false,generateModelDocumentation=false,enablePostProcessFile=true ^
@REM     --skip-validate-spec ^
@REM     --ignore-file-override=.openapi-generator-ignore

@REM pause
