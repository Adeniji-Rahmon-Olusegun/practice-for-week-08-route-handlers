let data1 = {name: "Ade", age: 23};
let data2 = {name: "Tade", age: 27};

let datas = {1: data1, 2: data2}

console.log((datas));

let staff = ["Bright", "Clement", "Victor", "Lukman", "Kodugbe", "Chris"]

for (let i = 0; i < staff.length; i++) {
    for (let j = i + 1; j < staff.length; j++) {
        console.log(staff[i], staff[j]);
    }
}