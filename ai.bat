@echo off

set "model_name=merge-model"

:: CREATE MODEL FUNCTION
:create_model
ollama create %model_name% -f Modelfile
EXIT /B 0

:: CHECK & CREATE
ollama list | findstr /c:"%model_name% " >nul
if errorlevel 1 (
    echo Model not found. Creating %model_name%...
    CALL :create_model
) else (
    echo Model already exists.
    ollama rm %model_name%
    CALL :create_model
)