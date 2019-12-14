# *LA DOC*

# Gameplay

Le jeu contient deux interfaces principales :
- L'interface map
- L'interface interaction

## Interface map

Le joueur se déplace sur une map. Sur la map il ne peut rien faire d'autre que déplacer le `hero` dans 4 directions.

### Murs

La map contient des cases `walls` sur lesquelles le `hero` ne peut pas aller

### Entités

Sur la map sont placés des `entities`. 

#### Hero

Le `hero` est une `entity` avec un statut particulier. 

#### Autres entités

Si le `hero` se déplace sur `entity` le jeu passe en mode interaction

## Interface interaction

Le joueur lis un texte, il peut choisir des actions dans un menu ces actions peuvent :
- Modifier l'état des `entities`.
- Quitter l'interaction (Faire basculer le jeu en mode map)



# Architecture de fichiers

Principaux dossiers et fichiers du projet et rapide résumé de leur rôle.

```
.
├── doc/                    (contient la documentation)
├── game/                   (contient l'ensemble du jeu)
│   ├── assets/             (contient les elements à intégrer dans le jeu)
│   │   ├── img/            (contient toutes les images)
│   │   │   ├── entities/   (contient les images des entiées)
│   │   │   └── tileset.png (image unique à partir de laquelle est générée la map)
│   │   └── json/           (contient touts les json)
│   │       ├── assets.json (liste de tous les assets à charger)
│   │       ├── entities/   (contient les definitions des entités)
│   │       ├── map.json    (fichier généré par Tiled, description de la map)
│   │       ├── status_bar_infos.json (liste des informations à afficher dans la barre d'état)
│   │       └── world.json  (définition du monde, essentiellemnt la liste des entités)
│   ├── css/                (contient les feuilles de style)
│   ├── index.html          (page web du jeu)
│   └── js/                 (contient le moteur de jeu (javascript))
└── src/                    (contient les sources)

```


# Level design

**Attention** : lorsqu'on modifie ou cree des fichiers à respecter les simples mais importantes [conventions d'écriture](conventions.md) !

## Map

**Rappel** : La map ne contient pas les entitées, uniquement le décors en arrière plan et l'emplacement des murs.

L'edtion de la map se fait à l'aide du logiciel [Tiled](https://www.mapeditor.org/).

### Ouvrir la map sur tiled

Fichier > Ouvrir > src/map.tmx

**Note** : Si le logiciel ne trouve pas les tileset, ils sont dans game/assets/img/

### Exporter la map

Fichier > Export > game/assets/json/map.json

### Les calques

- `base` : calque principal pour dessiner la map.
- `details` : calque secondaire pour ajouter des elements en transparence.
- `walls` : calque pour placer les murs.

**Attention** : penser à masquer le calque `walls` avant d'exporter la map.

## Entités

### world.json

Le moteur de jeu va chercher les entités dans le fichier `game/assets/json/world.json`.

Ce fichier contient donc la liste des définition des entités.

Pour chaque entité on indique le nom du fichier json qui contient sa definition plus complète (`extra_data`).

**Note** : plusieurs entités peuvent être liées à la même `extra_data`.

On peut aussi ajouter des attributs qui ne sont pas dans la `extra_data`.

Et enfin on peut écraser des attributs de la `extra_data`.

Par convention on met un mininum d'info dans ce fichier. On se limite pour chaque entité à :
- `extra_data`
- la position `x` et `y`
- les attributs qui changent d'une entité à une autre aillant la même `extra_data`

### entities/

Les fichiers référencés par l'attribut `extra_data` sont rangés dans `game/assets/json/entities`.

**Rappel** : C'est dans ces fichiers que sont décris les entités (tout ce avec quoi peut interagir le héro et le héro lui-même)

On y renseigne les attributs de l'entité.

Un de ces atributs, le `script` défini le scénario de l'interaction qui sera ouverte si on va à la rencontre de l'entité.

**Doc détaillée : (entities)[entities.md]**

## Barre d'état

La barre d'état s'affiche en bas de l'écran. Ce sont des informations sur le héro. La liste des informations à donner est définie par  `game/assets/json/status_bar_infos.json`.

Pour chaque information on renseigne le nom réel de l'attribut (`name`) ainsi que le nom à afficher (`title`).

## Assets.

Lorsque l'on crèe un nouveau fichier dans `game/assets/json/` ou qu'on importe une nouvelle image dans `game/assets/img/` il faut renseigner son nom (sans l'extension)dans `game/assets/json/assets.json`.