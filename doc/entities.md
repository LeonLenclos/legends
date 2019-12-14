# Comment définir une entité.

Ce sont donc des attributs et leur valeur sous le format JSON.

```
{
    "attribut_1" : "un texte",
    "attribut_2" : 33324,
    "attribut_3" : {
        "sous_attribut_1" : "blabla",
        "sous_attribut_2" : "blablabla",
        },
}
```

On peut créer l'attribut qu'on veut. On peut par exemple décider qu'un personnage a l'attribut `haine_des_humains`. Pour ça on n'a qu'à écrire : `"haine_des_humains" : 0` dans sa definition.

Certains attributs ont un rôle particulier :

### "id"

C'est l'identifiant de l'entité. ça permet de l'identifier.

**Attention :** Deux entitées ne sont pas sensés avoir le même `id`

### "img"

C'est l'image qui représente l'entité sur la map.

### "title"

C'est le titre qui s'affiche dans l'interface d'interaction/

### "x" et "y"

C'est la positoin de l'entité sur la map


### "interaction_state"

C'est la position dans le script.

### "script"

C'est le scénario de l'interaction qui sera ouverte si on va à la rencontre de l'entité.

#### Format du script

exemple de script :

    "script" : {
        "start":{
            "txt" : "texte du départ.",
            "actions":[
                {"txt":"Texte du choix 1", "do":["COMMANDE argument argument"]},
                {"txt":"Texte du choix 2.", "do":["COMMANDE"]}
            ]
        },
        "coucou":{
            "txt" : "blablablabla",
            "actions":[
                {"txt":"blabla.", "do":["COMMANDE"]}
            ]
        }
    }

Donc en gros on a differents moments qui ont chacun un nom (dans l'exemple les noms sont "start" et "coucou").

Pour chaque moment on indique le texte à afficher `"txt":""` et la liste des actions que l'on propose `"actions":[]`

Pour chaque action on indique le texte du bouton `"txt":""` et la liste de ce qu'il faut faire `"do":[]`

#### Lecture du script

Le moteur du jeu lira le moment du script indiqué par l'attribut `interaction_state`. Si aucun `interaction_state` n'est renseigné, il lira le moment qui s'appelle "start"

#### Les commandes

La syntaxe d'une commande c'est le nom de la commande en MAJUSCULE et les arguments séparés par un espace.

Voici les commandes disponnibles :

- `EXIT` : Quitter le mode interaction
- `GOTO *un_nouveau_state*` : changer l'`interaction_state`, c'est à dire continuer la lecture du script au moment indiqué par `*nouveau_state*`
- `GIVE *une_quantite un_attrinut une_entite*` : ajouter la quantité indiqué à l'attribut indiqué de l'entité indiquée. Si aucune entité n'est indiqué. L'ajouter à l'entité actuelle.
