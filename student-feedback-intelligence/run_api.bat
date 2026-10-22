@echo off
cd /d "%~dp0"
set "PYTHON_CMD=python"
where python >nul 2>nul
if %errorlevel% neq 0 (
    set "PYTHON_CMD=C:\Users\utkar\AppData\Local\Programs\Python\Python310\python.exe"
)
"%PYTHON_CMD%" -m uvicorn api.main:app --host 127.0.0.1 --port 8000
pause
