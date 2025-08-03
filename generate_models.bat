echo Generating models only...
call npx @openapitools/openapi-generator-cli generate ^
    -i openapi.yaml ^
    -g dart ^
    -o frontend/ ^
    --global-property models ^
    --additional-properties=pubName=workout_api_models,pubVersion=1.0.0,pubLibrary=workout_api_models.api,generateApis=false,generateApiTests=false,generateApiDocumentation=false ^
    --skip-validate-spec ^
    --ignore-file-override=.openapi-generator-ignore

echo Moving api_helper.dart and api.dart to model folder...
if exist "frontend\lib\api_helper.dart" move "frontend\lib\api_helper.dart" "frontend\lib\model\"
if exist "frontend\lib\api.dart" move "frontend\lib\api.dart" "frontend\lib\model\"

call npx @openapitools/openapi-generator-cli generate ^
    -i openapi.yaml ^
    -g python ^
    -o backend/ ^
    --global-property=models ^
    --additional-properties=packageName=models,packageVersion=1.0.0,generateSourceCodeOnly=true,generateApis=false,generateApiTests=false,generateApiDocumentation=false,generateModelTests=false,generateModelDocumentation=false,enablePostProcessFile=true ^
    --skip-validate-spec ^
    --ignore-file-override=.openapi-generator-ignore

pause
