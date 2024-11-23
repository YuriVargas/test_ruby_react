# RAILS-REACT

- Construir entorno con Dockerfile y docker-compose
- Una vez el entorno este preparado. Crear db, esto lo permite hacer Reals desde la web.
  
Algunos comandos que ejecutar para crear tablas
-  sudo docker compose run web rails generate model Gps latitude:string longitude:string sent_at:datetime vehicle_identifier:string --force
-  sudo docker compose run web rails generate model Vehicle vehicle_identifier:string color:string type:string --force

-  sudo docker compose run web rails db:create
-  sudo docker compose run web rails db:migrate

Sideqik Dashboard preview
<img width="874" alt="image" src="https://github.com/user-attachments/assets/d62f2b39-63f0-4566-bd25-21570b81125c">

Project preview
<img width="920" alt="image" src="https://github.com/user-attachments/assets/78243996-473b-47c3-8dd2-7a586ae8d2f8">

El proyecto fue probado en un ubuntu WSL.
