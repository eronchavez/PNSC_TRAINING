const people = [
    {name: "Ana", age:17},
    {name: "Ben", age:20},
    {name: "Mary", age:27},
];

const numbers = [1,2,3,4,5,6];
const names = ["Aaron", "James", "Chavez"];

// Sort 
names.sort();
names.sort().reverse();
console.log(names);

//Search
const result = people.find(person => person.name === "Ben");

// Filter
const adults = people.filter(person => person.age >= 18);

const even = numbers.filter(n => n % 2 === 0);

console.log(even);

console.log("Adult: ", adults);
console.log("Search: ",  result);