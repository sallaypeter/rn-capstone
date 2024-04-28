import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'create table if not exists menuitems (id integer primary key autoincrement, name text, price real, description text, image text, category text);'
          );
        },
        reject,
        resolve
      );
    });
}

export async function deleteTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql('DELETE FROM menuitems');
          },
          reject,
          resolve
        );
    });
}

export async function getMenuItems(sqlQuery) {
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(sqlQuery, [], (_, { rows }) => {
          resolve(rows._array);
        });
      });
    });
}

/*
export async function saveMenuItems(menu) {
    console.log(menu)
    return new Promise(
        (resolve, reject) => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        `INSERT INTO menuitems (name, price, description, image, category) VALUES
                        ${
                            menu.map(
                                item => `('${item.price}', ${item.price}, '${item.description}', '${item.image}', '${item.category}')`
                            ).join(', ')
                        }`
                    );
                },
                reject,
                resolve
            );
        }
    );
}
*/

export async function saveMenuItems(menu) {
    return new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            menu.forEach(item => {
                tx.executeSql(
                  'INSERT INTO menuitems (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
                  [item.name, item.price, item.description, item.image, item.category]
                );
              });
          },
          reject,
          resolve
        );
    });
}