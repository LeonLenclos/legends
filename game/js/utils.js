const random = (min, max) => Math.floor((Math.random()*(max-min))+min);

const constrain = (v, min, max) => Math.max(Math.min(v, max), min);

const pos_is_in_rect = (x, y, width, height) => x >= 0 && x < width && y >= 0 && y < height

const pos_to_index = (x, y, width) => y*width+x;

const calculate_max_scale = (w, h, maxw, maxh) => Math.max(1, Math.min(~~(maxw/w), ~~(maxh/h)));


const pos_to_direction = (x, y, width, height) => {
    let diag1 = (x) => x*(height/width);
    let diag2 = (x) => -x*(height/width)+height;
    if(y>=diag1(x) && y>=diag2(x)) return 'down';
    if(y>=diag1(x) && y<=diag2(x)) return 'left';
    if(y<=diag1(x) && y<=diag2(x)) return 'up';
    if(y<=diag1(x) && y>=diag2(x)) return 'right';
}


const move_to_direction = (x, y) => {
    if(x==0 && y>0)  return 'down';
    if(x<0  && y==0) return 'left';
    if(x==0 && y<0)  return 'up';
    if(x>0  && y==0) return 'right';
}