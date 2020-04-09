const images_dir = "img/";

const ALLOW_DEV_MODE = true;

const PATH = {
    'world' : 'script/world.json',
    'script' : 'script/',
    'tiled_map' : 'script/map.json',
    'entities' : 'script/entities/',
}

// Utils
const [NORTH,EAST,SOUTH,WEST] = [0,1,2,3];

const KEYS = {
    'z':'up',
    'w':'down',
    'q':'left',
    'a':'left',
    's':'down',
    'd':'right',
    'ArrowDown':'down',
    'ArrowUp':'up',
    'ArrowLeft':'left',
    'ArrowRight':'right',
    ' ':'ok',
    'Enter':'ok',

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
const TICK_PER_SEC = 60;
const TURN_PER_SEC = 6;


// SIZE
const VIEW_TILE_WIDTH = 40;
const VIEW_TILE_HEIGHT = 20

const TILE_SIZE = 8;

const VIEW_PX_WIDTH = VIEW_TILE_WIDTH * TILE_SIZE;
const VIEW_PX_HEIGHT = VIEW_TILE_HEIGHT * TILE_SIZE;
