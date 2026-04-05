class Priority_Queue{
    constructor(){
        this.items = [];
    }

    enqueue(item, priority) {
        this.items.push({ item: item, priority: priority });
    }

    dequeue(criteria) {
        if (this.items.length === 0){
            return null;
        }
        if (criteria === "oldest"){
            return this.items.shift();
        }
        else if (criteria === "newest"){
            return this.items.pop();
        }
        else if (criteria === "highest"){
            let hiIndex = 0;
            for(let i = 1; i < this.items.length; i++){
                if (this.items[i].priority > this.items[hiIndex].priority){
                    hiIndex = i;
                }
            }
            return this.items.splice(hiIndex, 1)[0];
        }
        else if (criteria === "lowest"){
            let lowIndex = 0;
            for(let i = 1; i < this.items.length; i++){
                if(this.items[i].priority<this.items[lowIndex].priority){
                    lowIndex = i;
                }
            }
            return this.items.splice(lowIndex, 1)[0];
        }


    }
}
const q = new Priority_Queue();

q.enqueue("A", 5);
q.enqueue("B", 100);
q.enqueue("C", 1);
q.enqueue("D", 5);

console.log(q.dequeue("highest"));
console.log(q.dequeue("lowest"));
console.log(q.dequeue("oldest"));
console.log(q.dequeue("newest"));
console.log(q.dequeue("highest"));