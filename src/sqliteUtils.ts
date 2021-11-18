import { ITODO } from './utils';

const { ipcRenderer } = window.require('electron');


export const initTable = () => {
    const tableSchema = `CREATE TABLE IF NOT EXISTS todos (id,content,isCompleted,orderId)`;
    ipcRenderer.send('sqliteOperations', {
        type: 'CREATE',
        data: [tableSchema],
    });
};


export const insertTodo = (todo: ITODO) => {
    ipcRenderer.send('sqliteOperations', {
        type: 'INSERT',
        data: [
            'INSERT INTO todos VALUES (?, ?, ?,?)',
            [todo.id, todo.content, todo.isCompleted, todo.orderId],
        ],
    });
}


export const updateTodo = (todo: ITODO) => {
    ipcRenderer.send('sqliteOperations', {
        type: 'INSERT',
        data: [
            'UPDATE todos SET content = (?) WHERE ID = (?)',
            [todo.content, todo.id],
        ],
    });
}

export const updateTodoOrdeId = (todo: ITODO) => {
    ipcRenderer.send('sqliteOperations', {
        type: 'INSERT',
        data: [
            'UPDATE todos SET orderId = (?) WHERE ID = (?)',
            [todo.orderId, todo.id],
        ],
    });
}

export const fetchAllTodos = () => {
    ipcRenderer.send('sqliteOperations', {
        type: 'FETCH',
        data: 'SELECT * FROM todos',
    });
}


export const registerIpcListener = (cb: any) => {
    ipcRenderer.on('sqliteOperationsResp', (event: any, arg: any) => {
        console.log(arg);
    });
    ipcRenderer.on('todos', (event: any, arg: any) => {
        console.log('todos', arg);
        cb(arg);
    });
};


export const deleteTodo = (todo: ITODO) => {
    ipcRenderer.send('sqliteOperations', {
        type: 'INSERT',
        data: [`DELETE FROM todos WHERE id=?`, todo.id],
    });
}