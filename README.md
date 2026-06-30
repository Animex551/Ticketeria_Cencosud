se uso un entorno de conda con python 3.11.0
con los pip: 
asgiref==3.11.1
Django==5.2.4
django-cors-headers==4.9.0
djangorestframework==3.17.1
packaging==26.0
pillow==12.2.0
psycopg2-binary==2.9.10
sqlparse==0.5.5
tzdata==2026.2
para correr el  server se usan los comandos:
crear una base de datos vacia postgres
editar settings.py con los datos de la base de datos para que funcione
python manage.py makemigrations
python manage.py migrate
esto para migrar la base de datos
python manage.py runserver para prender el server


---------------------------------------------------------------
---------------------------------------------------------------
se uso react con los siguientes npm installs:
├── eslint@10.4.0
├── globals@17.6.0
├── node-addon-api@7.1.1 extraneous
├── react-dom@19.2.6
├── react-router-dom@7.18.0
├── react@19.2.6
├── readdirp@5.0.0 extraneous
├── recharts@3.9.0
├── sass-embedded@1.100.0
├── sass@1.100.0 extraneous
└── vite@8.0.16
para comenzar el front end usar :
npm run dev
