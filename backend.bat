cd ..
cd inventario-backend
call venv\Scripts\activate & git pull & python manage.py migrate & python manage.py runserver