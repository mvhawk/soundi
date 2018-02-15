# MAVP - Proyecto web curso udemy nodejs, mongodb, angular

#### Requerimiento previos
> Funcionamiento base tener node 6.11.x y npm 3.10.x o versiones posteriores


Clonar proyecto
```
git clone https://mv_hawk81@bitbucket.org/mv_hawk81/curso-udemy.git
```
Instalar mongodb
```
Ubuntu: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
Cloud9: sudo apt-get install -y mongodb-org
```

Crear repositorios y shell Cloud 9
```
mkdir data
echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
chmod a+x mongod
```

Ejecutar mongo 
```
Ubuntu: sudo service mongod start
Cloud9: ./mongod
```

Conexión por consola ubuntu y cloud9
```
mongo
```

Instalar git
```
apt-get install git
```

Instalar angular
```
npm install -g @angular/cli
```

Para instalar dependencias node_modules
```
cd soundic.data / soundic.ui
npm install
```

#### Ejecutar compilación local data y ui
```
npm start
```

#### Ejecutar compilación distribución ui
```
npm build
```