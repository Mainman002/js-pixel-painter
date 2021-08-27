// export class ArrayTools {
//     constructor(){
//         this.array = [];
//     }
// }

// Calls the pushArray function to add an array of objects
export function initArray(_ob, _pos, _count, _arr) {
    for (let x = 1; x <= _count.x; x++){
        for (let y = 1; y <= _count.y; y++){
            _pos.x = 1*x;
            _pos.y = 1*y;
            pushArray(new _ob(_pos.x, _pos.y), 1, _arr);
        }
    }
    return _arr;
}

// Pushes objects to an array
export function pushArray(_ob, _i, _arr) {
    for (let idx = 0; idx < _i; idx++){
        _arr.push(_ob);
    }
    return _arr;
}

// Pushes objects to an array
// export function returnArray() {
//     if (this.array) return this.array;
//     else return;
// }