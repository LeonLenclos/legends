const images_dir = "img/";

const PATH = {
    'world' : 'script/world.json',
    'script' : 'script/',
    'tiled_map' : 'script/map.json',
    'entities' : 'script/entities/',
}

// Utils
const [NORTH,EAST,SOUTH,WEST] = [0,1,2,3];
const MAP_KEYS = {
    'z':NORTH,
    'w':NORTH,
    'q':WEST,
    'a':WEST,
    's':SOUTH,
    'd':EAST,
    'ArrowDown':SOUTH,
    'ArrowUp':NORTH,
    'ArrowLeft':WEST,
    'ArrowRight':EAST,
};


const [PREV,NEXT,SUBMIT] = [0,1,2];
const INTERACTION_KEYS = {
    'z':PREV,
    'w':PREV,
    'q':PREV,
    'a':PREV,
    's':NEXT,
    'd':NEXT,
    'ArrowDown':NEXT,
    'ArrowUp':PREV,
    'ArrowLeft':PREV,
    'ArrowRight':NEXT,
    'ArrowRight':NEXT,
    ' ':SUBMIT,
    'Enter':SUBMIT,
};

// TIME
const TICK_PER_SEC = 50;
const TURN_PER_SEC = 10;


// SIZE
const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;
const TILE_SIZE = 8;