ECHO OFF
CLS
ECHO.

IF "%~1"=="" GOTO BLANK

docker login sldevrg.azurecr.io
docker build -t sldevrg.azurecr.io/erik.blocket-ping:latest -t sldevrg.azurecr.io/erik.blocket-ping:%1 .
docker push sldevrg.azurecr.io/erik.blocket-ping:latest
docker push sldevrg.azurecr.io/erik.blocket-ping:%1
GOTO DONE

:BLANK

ECHO Please supply a tag

:DONE