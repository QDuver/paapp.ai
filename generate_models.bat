echo Generating models only...
call npx @openapitools/openapi-generator-cli generate ^
    -i openapi.yaml ^
    -g dart ^
    -o frontend/ ^
    --global-property models ^
    --additional-properties=pubName=workout_api_models,pubVersion=1.0.0,pubLibrary=workout_api_models.api,generateApis=false,generateApiTests=false,generateApiDocumentation=false ^
    --skip-validate-spec ^
    --ignore-file-override=.openapi-generator-ignore

pause
