import fs from 'fs';

let list: string[] = [];

const read = () => {
    list = JSON.parse(fs.readFileSync(__dirname + '/../public/list.json', 'utf-8'));
}

const addList = (id: string) => {
    if (!list.includes(id)) {
        list.push(id);
        fs.writeFileSync(__dirname + '/../public/list.json', JSON.stringify(list), 'utf-8');
    }
}

const hasList = (id: string): boolean => list.includes(id);

export { read, addList, hasList, list };