import PriorityQueue from "./PriorityQueue"

class WeightedAlgo{
    constructor(list,start,end){
        this.distances = {};
        this.previous = {};
        this.path = [];
        this.pathWeight = [];
        this.shortestPath=[];
        this.adjList = list;
        this.start = start;
        this.end = end;
        this.pQueue = new PriorityQueue;
    }

    setupInitState(){
        for(let vertex in this.adjList){
            if(vertex===this.start){
                this.distances[vertex]=0;
                this.pQueue.enqueue(vertex,0);
            }
            else{
                this.distances[vertex]=Infinity;
                this.pQueue.enqueue(vertex,Infinity);
            }
            this.previous[vertex]=null;
        }
    }

    searchingShortestPathToEachVertex(){
        while(this.pQueue.values.length!=0){
            let current = this.pQueue.dequeue();
            if(current.val==="0_0"&&current.priority===Infinity){
                break;
            }
            if(current.val==="0_1"&&current.priority===Infinity){
                break;
            }
            if(current.val===this.end){
                break;
            }
            this.path.push(current.val);
            this.pathWeight.push([current.val,this.distances[current.val]]);
            this.adjList[current.val].forEach(linkedVertex=>{
                let totalDis = linkedVertex.weight+this.distances[current.val];
                if(this.distances[linkedVertex.node]>totalDis){
                    this.distances[linkedVertex.node]=totalDis;
                    this.previous[linkedVertex.node]=current.val;
                    this.pQueue.enqueue(linkedVertex.node,totalDis);
                }
            })
        }
        // this.state.pathWeight=pathWeight;
    }
    setShortestPath(){
        //set shortest path
        this.shortestPath = [];
        let tempV = this.previous[this.end];

        // this.state.shortestPath=[];
        while(tempV!=null){
            this.shortestPath.unshift(tempV);
            tempV=this.previous[tempV];
        }
        this.shortestPath.shift();
    }
}

export default WeightedAlgo;