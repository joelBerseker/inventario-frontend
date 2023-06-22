cd ..
cd inventario-backend
call venv\Scripts\activate & python manage.py migrate & python manage.py runserver