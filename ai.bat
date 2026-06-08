@echo off

set "model_name=merge-model"

ollama list | findstr /c:"%model_name% " >nul

if errorlevel 1 (
    echo Model not found. Creating %model_name%...
    ollama create %model_name% -f Modelfile
) else (
    echo Model already exists.
)

ollama run %model_name%