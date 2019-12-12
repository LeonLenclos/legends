const images_dir = "img/";

const PATH = {
    'world' : 'script/world.json',
    'script' : 'script/',
    'tiled_map' : 'script/map.json',
    'objects' : 'script/objects/',
}

// Utils
const [NORTH,EAST,SOUTH,WEST] = [0,1,2,3];

const KEYS = {
    'z':NORTH,
    'w':NORTH,
    'q':WEST,
    'a':WEST,
    's':SOUTH,
    'd':EAST,
};

// TIME
const TICK_PER_SEC = 50;
const TURN_PER_SEC = 10;


// SIZE
const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;
const TILE_SIZE = 8;