echo Generating Python models only...
call npx @openapitools/openapi-generator-cli generate ^
    -i openapi.yaml ^
    -g python ^
    -o backend/ ^
    --global-property models ^
    --additional-properties=packageName=models,packageVersion=1.0.0,generateSourceCodeOnly=true,generateApis=false,generateApiTests=false,generateApiDocumentation=false,generateModelTests=false,generateModelDocumentation=false ^
    --skip-validate-spec ^
    --ignore-file-override=.openapi-generator-ignore

pause
