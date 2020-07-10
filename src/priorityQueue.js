class PriorityQueue{
    constructor(){
        this.values=[];
    }

    enqueue(val,priority){
        this.values.push({val,priority});
        this.sortQ();
    }

    dequeue(){
        return this.values.shift();
    }

    sortQ(){
        this.values.sort((a,b)=>{return a.priority-b.priority});
    }
}

export default PriorityQueue;