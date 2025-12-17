  _____    _____    _   _    ______        ______    _         __  __    _____   
 / ____|  |_   _|  | \ | |  |  ____|      |  ____|  | |       |  \/  |  |_   _|  
| |         | |    |  \| |  | |__         | |__     | |       | \  / |    | |    
| |         | |    | . ` |  |  __|        |  __|    | |       | |\/| |    | |    
| |____    _| |_   | |\  |  | |____       | |____   | |____   | |  | |   _| |_   
 \_____|  |_____|  |_| \_|  |______|      |______|  |______|  |_|  |_|  |_____|  

Bienvenue dans CINÉ ELMI, votre portail de films et de séances. Ce projet utilise une base de données PostgreSQL, un backend Spring Boot et un frontend Vite/React orchestrés par Docker.

Installation et lancement :

1-Télécharger le projet – clonez ou téléchargez l’archive contenant l’ensemble du projet sur votre machine.

2-Se placer dans le dossier du projet :

	cd chemin/vers/le/projet
	
3-S’assurer que Docker et Docker Compose sont installés. Si ce n’est pas le cas, installez‑les depuis docker.com

4-Construire et lancer les conteneurs :

	docker compose up --build
	
5-Arrêter et nettoyer : lorsque vous souhaitez arrêter l’application et supprimer les conteneurs ainsi que les volumes persistants, exécutez :
	
	docker compose down -v
	